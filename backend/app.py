from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/process', methods=['POST'])
def process():
    # Accept JSON or form-encoded data
    data = request.get_json(silent=True)
    if not data:
        data = request.form.to_dict()

    name = data.get('name', '')
    age = data.get('age', '')
    message = data.get('message', '')

    reply = {
        "received_name": name,
        "received_age": age,
        "received_message": message,
        "status": "processed",
        "note": f"Hello {name}. Your message was processed by Flask."
    }
    return jsonify(reply)

# Optional small GET for root (avoids 404 noise)
@app.route('/', methods=['GET'])
def home():
    return "Flask backend running. POST /process with JSON or form data.", 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
