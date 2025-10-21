// 1.- Requerir mongoose

const mongoose = require("mongoose");

// 2.- Crear funcion para conectarme a dos BDs
//    - defaultConn: para documentos (eventos, grupos, etc.)
//    - teamsConn: para equipos y participantes (BD separada)

const connections = {
    defaultConn: null,
    teamsConn: null,
};

const connect = async () => {
    console.log("Intentando conectar a las bases de datos...");
    try {
        connections.defaultConn = await mongoose.createConnection(
            "mongodb://127.0.0.1:27017/db-documents",
            { useNewUrlParser: true, useUnifiedTopology: true }
        );

        connections.teamsConn = await mongoose.createConnection(
            "mongodb://127.0.0.1:27017/db-teams",
            { useNewUrlParser: true, useUnifiedTopology: true }
        );

        console.log("::: EXITO Conectado a las BDs :::");
        return connections;
    } catch (error) {
        console.error("Error conectando a las BDs:", error);
        throw new Error("::: ERROR No se ha podido establecer la conexion con las BDs :::");
    }
};

module.exports = {
    connect,
    connections,
};