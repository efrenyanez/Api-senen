const mongoose = require('mongoose');

const ponenteSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  bio: { type: String, trim: true },
  profesion: { type: String, trim: true },
  eventos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evento' }],
  creadoEn: { type: Date, default: Date.now },
}, { timestamps: true });

function getModel() {
  return mongoose.models.Ponente || mongoose.model('Ponente', ponenteSchema);
}

module.exports = { getModel };
