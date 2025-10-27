const mongoose = require('mongoose');

const participanteSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, trim: true },
  email: { type: String, trim: true },
  telefono: { type: String, trim: true },
  tipo: { type: String, enum: ['asistente','organizador','ponente','jugador'], default: 'asistente', trim: true },
  equipo: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipo' },
  eventos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evento' }],
  creadoEn: { type: Date, default: Date.now },
}, { timestamps: true });

function getModel() {
  return mongoose.models.Participante || mongoose.model('Participante', participanteSchema);
}

module.exports = { getModel };
