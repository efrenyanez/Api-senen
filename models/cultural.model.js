const mongoose = require("mongoose");
const db = require("../database/conection");

const getModel = () => {
  const conn = db.connections.defaultConn;
  if (!conn) throw new Error("Default DB connection not initialized. Call connect() first.");
  try {
    return conn.model("Cultural");
  } catch (e) {
    const schema = new mongoose.Schema({
      nombre: { type: String, required: true, trim: true },
      descripcion: { type: String, trim: true },
      fecha: { type: Date },
      participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Participantes" }],
    });
    return conn.model("Cultural", schema);
  }
};

module.exports = { getModel };
