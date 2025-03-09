from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

app = Flask(__name__)
CORS(app)

# Store processed data in memory (temporary solution, use a database for production)
processed_data_store = {}

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        file = request.files.get('file')
        if not file:
            return jsonify({"error": "No file received"}), 400

        df = pd.read_csv(file)

        # Preprocess Data
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

        # Train model
        y = df["Growth_Rate (%)"]
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
        model = RandomForestRegressor(n_estimators=40, max_depth=8, random_state=42)
        model.fit(X_train, y_train)

        # Make predictions
        predictions = model.predict(X_scaled)

        # Calculate accuracy
        y_pred_test = model.predict(X_test)
        rmse = mean_squared_error(y_test, y_pred_test) ** 0.5
        r2 = r2_score(y_test, y_pred_test)

        # Store processed data in memory
        processed_data_store["processed_data"] = df.to_dict(orient='records')
        processed_data_store["growth_predictions"] = predictions.tolist()
        processed_data_store["accuracy"] = {"RMSE": rmse, "R2": r2}

        return jsonify({"message": "Data processed successfully!"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get-processed-data', methods=['GET'])
def get_processed_data():
    """ Serve stored processed data to the frontend """
    if not processed_data_store:
        return jsonify({"error": "No processed data available"}), 400
    return jsonify(processed_data_store)

if __name__ == '__main__':
    app.run(debug=True)
