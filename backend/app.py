from flask import Flask, request, jsonify
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

app = Flask(__name__)

# Define feature processing function
def preprocess_data(data):
    # Feature Engineering
    data["Revenue_Growth_Rate"] = (data["Annual_Revenue_Year3"] - data["Annual_Revenue_Year1"]) / data["Annual_Revenue_Year1"]
    data["Asset_Growth_Rate"] = (data["Assets_Year3"] - data["Assets_Year1"]) / data["Assets_Year1"]
    data["Loan_Dependency_Ratio"] = data["Loan_Amount_Year3"] / data["Annual_Revenue_Year3"]
    
    # Drop NaN values
    data = data.dropna()
    
    # Encode categorical features
    categorical_cols = ["Industry_Type", "Business_Type", "State", "District"]
    label_encoders = {}
    for col in categorical_cols:
        le = LabelEncoder()
        data[col] = le.fit_transform(data[col])
        label_encoders[col] = le
    
    return data, label_encoders

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        file = request.files['file']
        df = pd.read_csv(file)
        
        # Preprocess the data
        df, label_encoders = preprocess_data(df)
        
        # Select features
        features = [
            "Employees", "Years_in_Operation", "Credit_Score",
            "Revenue_Growth_Rate", "Asset_Growth_Rate", "Loan_Dependency_Ratio",
            "Industry_Type", "Business_Type", "State", "District"
        ]
        
        X = df[features]
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Train best Random Forest model
        y = df["Growth_Rate (%)"]
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
        best_rf_model = RandomForestRegressor(
            n_estimators=40,
            max_depth=8,
            min_samples_split=6,
            min_samples_leaf=3,
            max_features=1.0,  # Use all features
            random_state=42,
            n_jobs=1
        )
        best_rf_model.fit(X_train, y_train)
        
        # Make predictions
        predictions = best_rf_model.predict(X_scaled)
        
        # Calculate accuracy metrics
        y_pred_test = best_rf_model.predict(X_test)
        rmse = mean_squared_error(y_test, y_pred_test) ** 0.5
        r2 = r2_score(y_test, y_pred_test)
        
        return jsonify({
            "growth_predictions": predictions.tolist(),
            "processed_data": df.to_dict(orient='records'),
            "accuracy": {"RMSE": rmse, "R2": r2}
        })
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
