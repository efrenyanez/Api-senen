const mongoose = require("mongoose");
const db = require("../database/conection");

const getModel = () => {
  const conn = db.connections.defaultConn;
  if (!conn) throw new Error("Default DB connection not initialized. Call connect() first.");
  try {
    return conn.model("Ponentes");
  } catch (e) {
    const schema = new mongoose.Schema({
      nombre: { type: String, required: true, trim: true },
      bio: { type: String, trim: true },
      profesion: { type: String, trim: true },
      creadoEn: { type: Date, default: Date.now },
      eventos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Eventos' }]
    });
    return conn.model("Ponentes", schema);
  }
};

module.exports = { getModel };
