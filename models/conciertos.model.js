const { trim } = require("validator");

//modelo para conciertos
const conciertosSchema = new Schema({
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
});

module.exports = model("Conciertos", conciertosSchema);