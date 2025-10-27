const mongoose = require('mongoose');

const culturalSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  fecha: { type: Date },
  participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participante' }],
}, { timestamps: true });

function getModel() {
  return mongoose.models.Cultural || mongoose.model('Cultural', culturalSchema);
}

module.exports = { getModel };
