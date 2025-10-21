const mongoose = require("mongoose");
const db = require("../database/conection");

const getModel = () => {
  const conn = db.connections.defaultConn;
  if (!conn) throw new Error("Default DB connection not initialized. Call connect() first.");
  try {
    return conn.model("Grupo");
  } catch (e) {
    const schema = new mongoose.Schema({
      nombre: { type: String, required: true, trim: true },
      genero: { type: String, trim: true },
      integrantes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Participantes" }],
      creadoEn: { type: Date, default: Date.now },
    });
    return conn.model("Grupo", schema);
  }
};

module.exports = { getModel };
