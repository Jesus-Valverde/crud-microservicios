#Este es el código intermediario entre en servidor y el frontend
from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
from src.constants.config import db_config
from src.services.apiServices import usuariosApiService

app = Flask(__name__)
CORS(app) #Habilitar CORS en todas las rutas
usuarioAPI = usuariosApiService()

@app.route("/")
def hello_world():
    return jsonify({"hola mundo": "Archivo inicial - API funcionando con Flask"})

# Prueba para recibir los usuarios del servidor
@app.route("/api/getUsuarios")
def get_users():
    return usuarioAPI.getUsuarios()

if __name__ == '__main__':
    app.run(debug=True) # Flask corre en el puerto 5000 por defecto