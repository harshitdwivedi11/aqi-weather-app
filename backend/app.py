from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

# Load your trained model at startup
model = joblib.load('rf_model.pkl')

@app.route('/predict', methods=['POST'])
def predict_aqi():
    data = request.get_json()
    pm25 = data.get('pm25')
    if pm25 is None:
        return jsonify({'error': 'PM2.5 value is required'}), 400
    try:
        aqi = model.predict([[float(pm25)]])[0]
        return jsonify({'aqi': aqi})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)