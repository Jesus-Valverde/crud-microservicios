#Este es el código intermediario entre en servidor y el frontend
from flask import Flask, jsonify, request
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

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    correo = data.get("correo")
    contrasena = data.get("contrasena")
    
    return jsonify(usuarioAPI.autenticarUsuario(correo, contrasena))

@app.route("/api/registrarUsuario", methods=["POST"])
def let_user():
    data = request.json
    nombre = data.get("nombre")
    correo = data.get("correo")
    contrasena = data.get("contrasena")
    return jsonify(usuarioAPI.registrarUsuario(nombre, correo, contrasena))

@app.route("/api/getUsuarios")
def get_users():
    return usuarioAPI.getUsuarios()

@app.route("/api/getUsuarioById")
def get_userById():
    userId = int(request.args.get('id'))
    return usuarioAPI.getUsuarioById(userId)

@app.route("/api/updateUsuario", methods=["PUT"])
def actualizar_usuario():
    data = request.json
    id_usuario = data.get("id")
    nombre = data.get("nombre")
    correo = data.get("correo")
    contrasena = data.get("contrasena")

    return jsonify(usuarioAPI.updateUsuario(id_usuario, nombre, correo, contrasena))

@app.route("/api/cambiarEstadoUsuario", methods=["PUT"])
def cambiar_estado():
    data = request.json
    id_usuario = data.get("id")
    nuevo_estado = data.get("estado")  # 1 o 0

    return jsonify(usuarioAPI.cambiarEstadoUsuario(id_usuario, nuevo_estado))

if __name__ == '__main__':
    app.run(debug=True) # Flask corre en el puerto 5000 por defecto