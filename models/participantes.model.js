const { Schema } = require("mongoose");
const db = require("../database/conection");

const getModel = () => {
  const conn = db.connections.teamsConn;
  if (!conn) throw new Error("Teams DB connection not initialized. Call connect() first.");

  try {
    return conn.model("Participantes");
  } catch (e) {
    const participantesSchema = new Schema({
      nombre: { type: String, required: true, trim: true },
      apellido: { type: String, trim: true },
      email: { type: String, trim: true },
      telefono: { type: String, trim: true },
      tipo: { type: String, enum: ["asistente", "organizador", "ponente", "jugador"], default: "asistente" },
      equipo: { type: Schema.Types.ObjectId, ref: "Equipos" },
      eventos: [{ type: Schema.Types.ObjectId, ref: "Eventos" }],
      creadoEn: { type: Date, default: Date.now },
    });

    return conn.model("Participantes", participantesSchema);
  }
};

module.exports = {
  getModel,
};
