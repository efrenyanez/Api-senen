const mongoose = require('mongoose');

const conferenciaSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  fecha: { type: Date },
  ponentes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ponente' }],
  participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participante' }],
}, { timestamps: true });

function getModel() {
  return mongoose.models.Conferencia || mongoose.model("Conferencia", conferenciaSchema);
}
module.exports = { getModel };
