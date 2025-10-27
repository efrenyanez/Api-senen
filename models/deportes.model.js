const mongoose = require('mongoose');

const deporteSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  tipo: { type: String, trim: true },
  fecha: { type: Date },
  equipos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipo' }],
  participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participante' }],
}, { timestamps: true });

function getModel() {
  return mongoose.models.Deporte || mongoose.model('Deporte', deporteSchema);
}

module.exports = { getModel };
