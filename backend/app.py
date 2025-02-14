from flask import Flask, request, jsonify
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split

app = Flask(__name__)

# Load dataset
file_path = "MSME.csv"
data = pd.read_csv(file_path)

# Preprocessing
categorical_cols = ['state_name', 'district_name']
label_encoders = {}

for col in categorical_cols:
    le = LabelEncoder()
    data[col] = le.fit_transform(data[col])
    label_encoders[col] = le

X = data.drop(['total'], axis=1)
y = data['total']

scaler = StandardScaler()
X = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest Model
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Save model & encoders
joblib.dump(rf_model, 'random_forest_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(label_encoders, 'label_encoders.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        file = request.files['file']
        df = pd.read_csv(file)

        # Drop the "total" column if present
        if 'total' in df.columns:
            df = df.drop(['total'], axis=1)

        # Apply encoding to categorical columns
        for col in categorical_cols:
            if col in df.columns and col in label_encoders:
                df[col] = label_encoders[col].transform(df[col])

        # Standardize the input
        df = scaler.transform(df)

        # Load trained model and make predictions
        model = joblib.load('random_forest_model.pkl')
        predictions = model.predict(df)

        return jsonify({"predictions": predictions.tolist()})

    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == '__main__':
    app.run(debug=True)
