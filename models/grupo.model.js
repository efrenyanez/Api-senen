const mongoose = require('mongoose');

const grupoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  genero: { type: String, trim: true },
  integrantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participante' }],
  eventos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evento' }],
  creadoEn: { type: Date, default: Date.now },
}, { timestamps: true });

function getModel() {
  return mongoose.models.Grupo || mongoose.model('Grupo', grupoSchema);
}

module.exports = { getModel };
