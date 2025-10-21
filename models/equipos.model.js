const { Schema } = require("mongoose");
const db = require("../database/conection");

// Helper to get the teams connection (may be null until connect() is called)
const getModel = () => {
  const conn = db.connections.teamsConn;
  if (!conn) throw new Error("Teams DB connection not initialized. Call connect() first.");

  try {
    return conn.model("Equipos");
  } catch (e) {
    const equiposSchema = new Schema({
      nombre: { type: String, required: true, trim: true },
      pais: { type: String, trim: true },
      integrantes: [{ type: Schema.Types.ObjectId, ref: "Participantes" }],
      eventos: [{ type: Schema.Types.ObjectId, ref: "Eventos" }],
      descripcion: { type: String, trim: true },
      creadoEn: { type: Date, default: Date.now },
    });

    return conn.model("Equipos", equiposSchema);
  }
};

module.exports = {
  getModel,
};
