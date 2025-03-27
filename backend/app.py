from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import os

app = Flask(__name__)
CORS(app)

processed_data_store = {}
model_store = {}
scaler_store = {}

# 🎯 Allowed features for validation
ALLOWED_FEATURES = [
    "Employees", "Years_in_Operation", "Credit_Score",
    "Annual_Revenue_Year1", "Annual_Revenue_Year3",
    "Assets_Year1", "Assets_Year3", "Loan_Amount_Year3",
    "Industry_Type", "Business_Type", "State", "District", "Growth_Rate (%)"
]

# 📤 Upload and process CSV
@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        file = request.files.get('file')
        if not file:
            return jsonify({"error": "No file received"}), 400

        df = pd.read_csv(file)

        # ✅ Feature validation
        missing_features = [feature for feature in ALLOWED_FEATURES if feature not in df.columns]
        if missing_features:
            return jsonify({"error": f"Missing required features: {', '.join(missing_features)}"}), 400

        # Basic feature engineering
        df["Revenue_Growth_Rate"] = (df["Annual_Revenue_Year3"] - df["Annual_Revenue_Year1"]) / df["Annual_Revenue_Year1"]
        df["Asset_Growth_Rate"] = (df["Assets_Year3"] - df["Assets_Year1"]) / df["Assets_Year1"]
        df["Loan_Dependency_Ratio"] = df["Loan_Amount_Year3"] / df["Annual_Revenue_Year3"]
        df = df.dropna()

        # Encode categorical features
        categorical_cols = ["Industry_Type", "Business_Type", "State", "District"]
        for col in categorical_cols:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])

        # Feature selection
        features = ["Employees", "Years_in_Operation", "Credit_Score",
                    "Revenue_Growth_Rate", "Asset_Growth_Rate", "Loan_Dependency_Ratio",
                    "Industry_Type", "Business_Type", "State", "District"]

        X = df[features]
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        # Target variable
        y = df["Growth_Rate (%)"]

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

        # Model training
        model = RandomForestRegressor(n_estimators=50, max_depth=10, random_state=42)
        model.fit(X_train, y_train)

        # Predictions
        predictions = model.predict(X_scaled)

        # Accuracy metrics
        y_pred_test = model.predict(X_test)
        rmse = mean_squared_error(y_test, y_pred_test) ** 0.5
        r2 = r2_score(y_test, y_pred_test)

        # Store processed data
        processed_data_store["processed_data"] = df.to_dict(orient='records')
        processed_data_store["growth_predictions"] = predictions.tolist()
        processed_data_store["accuracy"] = {"RMSE": rmse, "R2": r2}

        # Save model and scaler for later use
        model_store["model"] = model
        scaler_store["scaler"] = scaler

        return jsonify({"message": "Data processed successfully!"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 📊 Get Processed Data
@app.route('/get-processed-data', methods=['GET'])
def get_processed_data():
    """ Serve stored processed data to the frontend """
    if not processed_data_store:
        return jsonify({"error": "No processed data available"}), 400
    return jsonify(processed_data_store)


# 📈 Get Feature Importance
@app.route('/get-feature-importance', methods=['GET'])
def feature_importance():
    """ Return feature importance from the trained model """
    if "model" not in model_store:
        return jsonify({"error": "Model not trained yet!"}), 400

    model = model_store["model"]
    features = ["Employees", "Years_in_Operation", "Credit_Score",
                "Revenue_Growth_Rate", "Asset_Growth_Rate", "Loan_Dependency_Ratio",
                "Industry_Type", "Business_Type", "State", "District"]

    feature_importances = model.feature_importances_
    importance_data = dict(zip(features, feature_importances))

    return jsonify({"feature_importance": importance_data})


# 📤 Export Processed Data as CSV
# 📤 Export Processed Data as CSV
@app.route('/export-data', methods=['GET'])
def export_data():
    """ Export processed data as a downloadable CSV without duplicates """
    if "processed_data" not in processed_data_store:
        return jsonify({"error": "No processed data available"}), 400

    df = pd.DataFrame(processed_data_store["processed_data"])
    
    # Drop duplicate rows based on all columns
    df = df.drop_duplicates()

    csv_file_path = "processed_data.csv"
    df.to_csv(csv_file_path, index=False)

    return send_file(csv_file_path, as_attachment=True)



# 🔄 Compare Business Growth
@app.route('/compare-business', methods=['POST'])
def compare_business():
    """ Compare growth of selected businesses """
    data = request.json
    selected_businesses = data.get("businesses", [])

    if "processed_data" not in processed_data_store:
        return jsonify({"error": "No processed data available"}), 400

    df = pd.DataFrame(processed_data_store["processed_data"])
    comparison_data = df[df["Business_Name"].isin(selected_businesses)].to_dict(orient="records")

    if not comparison_data:
        return jsonify({"error": "No matching businesses found!"}), 400

    return jsonify({"comparison_data": comparison_data})


# 📤 Predict Growth with New Data
@app.route('/predict', methods=['POST'])
def predict():
    """ Predict growth based on user-input data """
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        # Validate input data
        required_features = ["Employees", "Years_in_Operation", "Credit_Score",
                              "Revenue_Growth_Rate", "Asset_Growth_Rate", "Loan_Dependency_Ratio",
                              "Industry_Type", "Business_Type", "State", "District"]

        missing_features = [f for f in required_features if f not in data]
        if missing_features:
            return jsonify({"error": f"Missing required features: {', '.join(missing_features)}"}), 400

        # Prepare data for prediction
        model = model_store["model"]
        scaler = scaler_store["scaler"]

        input_data = pd.DataFrame([data])
        input_scaled = scaler.transform(input_data)

        prediction = model.predict(input_scaled)
        return jsonify({"predicted_growth": prediction[0]})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 📥 Upload New Data for Retraining
@app.route('/upload-new-data', methods=['POST'])
def upload_new_data():
    try:
        file = request.files.get('file')
        if not file:
            return jsonify({"error": "No file received"}), 400

        df_new = pd.read_csv(file)

        # Basic feature engineering for new data
        df_new["Revenue_Growth_Rate"] = (df_new["Annual_Revenue_Year3"] - df_new["Annual_Revenue_Year1"]) / df_new["Annual_Revenue_Year1"]
        df_new["Asset_Growth_Rate"] = (df_new["Assets_Year3"] - df_new["Assets_Year1"]) / df_new["Assets_Year1"]
        df_new["Loan_Dependency_Ratio"] = df_new["Loan_Amount_Year3"] / df_new["Annual_Revenue_Year3"]
        df_new = df_new.dropna()

        # Encode categorical features
        categorical_cols = ["Industry_Type", "Business_Type", "State", "District"]
        for col in categorical_cols:
            le = LabelEncoder()
            df_new[col] = le.fit_transform(df_new[col])

        # Feature selection
        features = ["Employees", "Years_in_Operation", "Credit_Score",
                    "Revenue_Growth_Rate", "Asset_Growth_Rate", "Loan_Dependency_Ratio",
                    "Industry_Type", "Business_Type", "State", "District"]

        X_new = df_new[features]
        scaler = StandardScaler()
        X_scaled_new = scaler.fit_transform(X_new)

        # Predictions for new data
        predictions_new = model_store["model"].predict(X_scaled_new)
        df_new["Growth_Rate (%)"] = predictions_new

        return jsonify({"uploaded_data": df_new.to_dict(orient="records")})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
