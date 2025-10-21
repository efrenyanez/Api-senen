const mongoose = require("mongoose");
const db = require("../database/conection");

const getModel = () => {
  const conn = db.connections.defaultConn;
  if (!conn) throw new Error("Default DB connection not initialized. Call connect() first.");
  try {
    return conn.model("Conferencias");
  } catch (e) {
    const schema = new mongoose.Schema({
      titulo: { type: String, required: true, trim: true },
      descripcion: { type: String, trim: true },
      fecha: { type: Date },
      ponentes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ponentes" }],
      participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Participantes" }],
    });
    return conn.model("Conferencias", schema);
  }
};

module.exports = { getModel };
