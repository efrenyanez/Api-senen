const mongoose = require('mongoose');

const conciertoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  artistaPrincipal: { type: String, required: true, trim: true },
  artistasInvitados: [{ type: String, trim: true }],
  descripcion: { type: String, trim: true },
  generoMusical: { type: String, required: true, trim: true },
  fecha: { type: Date, required: true },
  horaInicio: { type: String, required: true, trim: true },
  horaFin: { type: String, required: true, trim: true },
  fechaPublicacion: { type: Date, default: Date.now },
  lugar: { type: String, required: true, trim: true },
  direccion: { type: String, required: true, trim: true },
  ciudad: { type: String, required: true, trim: true },
  estado: { type: String, trim: true },
  pais: { type: String, required: true, trim: true },
  precioMinimo: { type: Number, required: true },
  precioMaximo: { type: Number, required: true },
  moneda: { type: String, required: true, trim: true },
  boletosDisponibles: { type: Number, required: true },
  enlaceDeCompra: { type: String, trim: true },
  imagenPrincipal: { type: String, trim: true },
  galeriaDeImagenes: [{ type: String, trim: true }],
  videoPromocional: { type: String, trim: true },
  organizador: { type: String, required: true, trim: true },
  contactoOrganizador: { type: String, trim: true },
  patrocinadores: [{ type: String, trim: true }],
  redesSociales: { type: Map, of: String },
  grupos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Grupo' }],
  participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participante' }]
});

function getModel() {
  return mongoose.models.Concierto || mongoose.model("Concierto", conciertoSchema);
}
module.exports = { getModel };

