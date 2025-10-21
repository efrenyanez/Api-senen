const mongoose = require("mongoose");
const db = require("../database/conection");

const getModel = () => {
  const conn = db.connections.defaultConn;
  if (!conn) throw new Error("Default DB connection not initialized. Call connect() first.");
  try {
    return conn.model("Deportes");
  } catch (e) {
    const schema = new mongoose.Schema({
      nombre: { type: String, required: true, trim: true },
      tipo: { type: String },
      fecha: { type: Date },
      equipos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Equipos" }],
      participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Participantes" }],
    });
    return conn.model("Deportes", schema);
  }
};

module.exports = { getModel };
