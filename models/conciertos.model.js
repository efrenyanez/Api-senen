const { trim } = require("validator");
const mongoose = require("mongoose");
const db = require("../database/conection");

//modelo para conciertos (se crea en la defaultConn / db-documents)
const conciertosSchema = new mongoose.Schema({
    //Datos del concierto
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    artistaPrincipal: {
        type: String,
        required: true,
        trim: true
    },
    artistasInvitados: {
        // pueden ser nombres o referencias a grupos almacenados en la BD de documentos
        type: [String],
        trim: true
    },
    descripcion:{
        type: String,
        trim: true
    },
    generoMusical: {
        type: String,
        required: true,
    },
    //Horarios y Fechas
    fecha:{
        type: Date,
        required: true
    },
    horaInicio:{
        type: String,
        required: true,
        trim: true
    },
    horaFin:{
        type: String,
        required: true,
        trim: true
    },
    fechaPublicacion:{
        type: Date,
        default: Date.now
    },
    //Ubicación
    lugar:{
        type: String,
        required: true,
        trim: true
    },
    direccion:{
        type: String,
        required: true,
        trim: true
    },
    ciudad:{
        type: String,
        required: true,
        trim: true
    },
    pais:{
        type: String,
        required: true,
        trim: true
    },
    estado:{
        type: String,
        trim: true
    },
    //Boletos y precios
    precioMinimo:{
        type: Number,
        required: true,
    },
    precioMaximo:{
        type: Number,
        required: true,
    },
    moneda:{
        type: String,
        required: true,
        trim: true
    },
    boletosDisponibles:{
        type: Number,
        required: true,
    },
    enlaceDeCompra:{
        type: String,
        trim: true
    },
    // Media 
    imagenPrincipal:{
        type: String,
        trim: true
    },
    galeriaDeImagenes:{
        type: [String],
        trim: true
    },
    videoPromocional:{
        type: String,
        trim: true
    },
    //Gestión y Organización
    organizador:{
        type: String,
        required: true,
        trim: true
    },
    contactoOrganizador:{
        type: String,
        trim: true
    },
    patrocinadores:{
        type: [String],
        trim: true
    },
    redesSociales:{
        type: Map,
        of: String
    },
        // relaciones (IDs a otras colecciones)
        grupos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Grupo" }],
        participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Participantes" }]
});
const getModel = () => {
    const conn = db.connections.defaultConn;
    if (!conn) throw new Error("Default DB connection not initialized. Call connect() first.");

    try {
        return conn.model("Conciertos");
    } catch (e) {
        return conn.model("Conciertos", conciertosSchema);
    }
};

module.exports = {
    getModel,
};