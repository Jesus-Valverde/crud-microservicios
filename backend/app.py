from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def hello_world():
    return jsonify({"hola mundo": "Archivo inicial - API funcionando con Flask"})

if __name__ == '__main__':
    app.run()