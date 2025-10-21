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
    console.log("Conectando a BDs...");
    try {
        connections.defaultConn = await mongoose.createConnection("mongodb://127.0.0.1:27017/db-documents");
        connections.teamsConn = await mongoose.createConnection("mongodb://127.0.0.1:27017/db-equipos");

        console.log("BDs conectadas");
        return connections;
    } catch (error) {
        console.error("Error al conectar BDs:", error.message || error);
        throw new Error("No se pudo conectar a las bases de datos");
    }
};

module.exports = {
    connect,
    connections,
};