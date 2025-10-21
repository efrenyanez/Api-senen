const mongoose = require('mongoose');
const db = require('../database/conection');

const getModel = () => {
  const conn = db.connections.defaultConn;
  if (!conn) throw new Error('La conexión a la BD no está inicializada. Llama a connect() primero.');
  if (conn.models && conn.models.Eventos) return conn.model('Eventos');

  const schema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    tipo: { type: String, enum: ['deportivo', 'cultural', 'concierto', 'conferencia'], required: true },
    fecha: { type: Date },
    lugar: { type: String, trim: true },
    descripcion: { type: String, trim: true },
    ponentes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ponentes' }],
    gruposMusicales: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Grupo' }],
    equipos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipos' }],
    participantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participantes' }],
    creadoEn: { type: Date, default: Date.now }
  });

  return conn.model('Eventos', schema);
};

module.exports = { getModel };
