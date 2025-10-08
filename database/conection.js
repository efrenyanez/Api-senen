// 1.- Requerir mongoose

const mongoose = require("mongoose");

// 2.- Crear funcion para conectarme a la bd

const connection= async()=>{
    console.log("Desde la funcion Conection, Intentando conectar");
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/db-platillos");
        console.log("::: EXITO Conectado a la BD :::");
    } catch (error) {
        console.log("Error", error);
        throw new Error("::: ERROR No se ha podido establecer la conexion con la BD :::");
    }
};

// 3.- Exportar esa funcion (modulo) para utilizarlo en otro archivo0

module.exports = connection;