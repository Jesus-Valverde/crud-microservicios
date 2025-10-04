from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import os
from src.services.apiServices import usuariosApiService, systemApiService

app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"]
)

# JWT
app.config["JWT_SECRET_KEY"] = "wibioapp"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_HOURS", 2)))
jwt = JWTManager(app)

usuarioAPI = usuariosApiService()
systemAPI = systemApiService()

# ---------------------
# Login
# ---------------------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    correo = data.get("correo")
    contrasena = data.get("contrasena")
    resultado = usuarioAPI.loginUsuario(correo, contrasena)
    if resultado["success"]:
        token = create_access_token(identity=str(resultado["usuario"]["id_usuario"]))
        resultado["token"] = token
    return jsonify(resultado)

# ---------------------
# Registro
# ---------------------
@app.route("/api/registrarUsuario", methods=["POST"])
@jwt_required()
def registrar_usuario():
    data = request.json
    nombre = data.get("nombre")
    correo = data.get("correo")
    contrasena = data.get("contrasena")
    return jsonify(usuarioAPI.registrarUsuario(nombre, correo, contrasena))

# ---------------------
# Usuarios CRUD
# ---------------------
@app.route("/api/getUsuarios")
@jwt_required()
def get_usuarios():
    return usuarioAPI.getUsuarios()

@app.route("/api/getUsuarioById")
@jwt_required()
def get_usuario_by_id():
    userId = int(request.args.get('id'))
    return usuarioAPI.getUsuarioById(userId)

@app.route("/api/updateUsuario", methods=["PUT"])
@jwt_required()
def update_usuario():
    data = request.json
    id_usuario = data.get("id")
    nombre = data.get("nombre")
    correo = data.get("correo")
    contrasena = data.get("contrasena")
    return jsonify(usuarioAPI.updateUsuario(id_usuario, nombre, correo, contrasena))

@app.route("/api/cambiarEstadoUsuario", methods=["PUT"])
@jwt_required()
def cambiar_estado():
    data = request.json
    id_usuario = data.get("id")
    nuevo_estado = data.get("estado")
    return jsonify(usuarioAPI.cambiarEstadoUsuario(id_usuario, nuevo_estado))

# ---------------------
# Sistema
# ---------------------
@app.route("/api/getNombreTablas")
@jwt_required()
def get_tablas():
    return systemAPI.getNombreTablas()

@app.route("/api/getBasesDatos", methods=["GET"])
@jwt_required()
def get_bases_datos():
    return systemAPI.getBasesDatos()

# ---------------------
# Endpoint protegido
# ---------------------
@app.route("/api/protegido")
@jwt_required()
def protegido():
    usuario_id = get_jwt_identity()
    return jsonify({"success": True, "message": f"Acceso permitido, usuario ID: {usuario_id}"})

if __name__ == "__main__":
    app.run(debug=True)
