const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  tipo: { type: String, enum: ['deportivo','cultural','concierto','conferencia'], required: true, trim: true },
  descripcion: { type: String, trim: true },
  fecha: { type: Date },
  lugar: { type: String, trim: true },
  ponentes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ponente' }],
  gruposMusicales: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Grupo' }],
  equipos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipo' }],
  participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participante' }],
  creadoEn: { type: Date, default: Date.now },
}, { timestamps: true });

function getModel() {
  return mongoose.models.Evento || mongoose.model('Evento', eventoSchema);
}

module.exports = { getModel };
