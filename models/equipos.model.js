const mongoose = require('mongoose');

const equipoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  pais: { type: String, trim: true },
  descripcion: { type: String, trim: true },
  integrantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participante' }],
  eventos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evento' }],
  creadoEn: { type: Date, default: Date.now },
}, { timestamps: true });

function getModel() {
  return mongoose.models.Equipo || mongoose.model('Equipo', equipoSchema);
}

module.exports = { getModel };
