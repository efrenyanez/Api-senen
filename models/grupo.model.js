const mongoose = require("mongoose");
const db = require("../database/conection");

const getModel = () => {
  const conn = db.connections.defaultConn;
  if (!conn) throw new Error("La conexión a la BD no está inicializada. Llama a connect() primero.");
  if (conn.models && conn.models.Grupo) return conn.model("Grupo");

  const schema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    genero: { type: String, trim: true },
    integrantes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Participantes" }],
    creadoEn: { type: Date, default: Date.now },
    eventos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Eventos' }]
  });
  return conn.model("Grupo", schema);
};

module.exports = { getModel };
