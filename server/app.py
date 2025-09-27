from flask import Flask, jsonify
from flask-cors import CORS

app = Flask(__name__)
CORS(app) #Habilitar CORS en todas las rutas

@app.route("/")
def hello_world():
    return jsonify({"hola mundo": "Archivo inicial - API funcionando con Flask"})

@app.route("/api/usuarios")
def get_users():
    return {
        'usuarios' : ['Alice', 'Bob', 'Charlie']
    }

if __name__ == '__main__':
    app.run(debug=True) # Flask corre en el puerto 5000 por defecto