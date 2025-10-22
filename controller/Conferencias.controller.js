const mongoose = require("mongoose");
const db = require("../database/conection");
const ModelFile = require("../models/conferencias.model");

const ensureConnected = async () => {
  if (!db.connections.defaultConn) await db.connect();
};

module.exports = {
  guardarConferencia: async (req, res) => {
    try {
      await ensureConnected();
      const { titulo, fecha, descripcion, ponentes } = req.body;
      const faltantes = [];
      if (!titulo) faltantes.push('titulo');
      if (faltantes.length) return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios', faltantes });

      const Model = ModelFile.getModel();
      const nuevo = new Model({ titulo, fecha, descripcion, ponentes });
      const saved = await nuevo.save();
      return res.status(201).json({ status: 'success', message: 'Conferencia guardada', data: saved });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error guardando conferencia", error: err.message });
    }
  },
  listarConferencias: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
  // Asegurar que el modelo Ponentes esté registrado en la conexión por defecto
  try { require('../models/ponentes.model').getModel(); } catch (e) { /* ignore */ }

  // populate solo 'ponentes' (mismo connection/defaultConn). 'participantes' está en teamsConn
  const items = await Model.find().populate('ponentes').lean();

  // Recolectar participantes y cargarlos desde teamsConn
  const allParticipantIds = items.reduce((acc, it) => {
    if (Array.isArray(it.participantes) && it.participantes.length) acc.push(...it.participantes.map(String));
    return acc;
  }, []);
  if (allParticipantIds.length) {
    try {
      const ParticipantesModel = require('../models/participantes.model').getModel();
      const parts = await ParticipantesModel.find({ _id: { $in: allParticipantIds } }).lean();
      const byId = parts.reduce((m,p)=>{ m[p._id.toString()] = p; return m; },{});
      items.forEach(it=>{ if (Array.isArray(it.participantes)) it.participantes = it.participantes.map(id=> byId[id.toString()] || id); });
    } catch(e) {
      console.warn('No se pudieron cargar participantes (cross-db):', e.message);
    }
  }
  return res.json(items);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error listando conferencias", error: err.message });
    }
  },
  obtenerConferenciaPorId: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "ID inválido" });
  // asegurar Ponentes registrado
  try { require('../models/ponentes.model').getModel(); } catch (e) { /* ignore */ }
  const item = await Model.findById(req.params.id).populate('ponentes').lean();
      if (!item) return res.status(404).json({ message: "No encontrado" });

      if (item && Array.isArray(item.participantes) && item.participantes.length) {
        try {
          const ParticipantesModel = require('../models/participantes.model').getModel();
          const parts = await ParticipantesModel.find({ _id: { $in: item.participantes } }).lean();
          const byId = parts.reduce((m,p)=>{ m[p._id.toString()] = p; return m; },{});
          item.participantes = item.participantes.map(id=> byId[id.toString()] || id);
        } catch(e) {
          console.warn('No se pudieron cargar participantes (cross-db):', e.message);
        }
      }

      return res.json(item);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error buscando conferencia", error: err.message });
    }
  },
  eliminarConferencia: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "ID inválido" });
      const deleted = await Model.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "No encontrado" });
      return res.json({ message: "Eliminado" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error eliminando conferencia", error: err.message });
    }
  },
  actualizarConferencia: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ status: 'error', message: 'ID inválido' });

      const { titulo, fecha, descripcion, ponentes } = req.body;
      if (!titulo && !fecha && !descripcion && !ponentes) {
        return res.status(400).json({ status: 'error', message: 'Debe proporcionar al menos un campo para actualizar' });
      }

      const datosActualizar = {};
      if (titulo) datosActualizar.titulo = titulo;
      if (fecha) datosActualizar.fecha = fecha;
      if (descripcion) datosActualizar.descripcion = descripcion;
      if (ponentes) datosActualizar.ponentes = ponentes;

      const updated = await Model.findByIdAndUpdate(id, datosActualizar, { new: true, runValidators: true, context: 'query' });
      if (!updated) return res.status(404).json({ status: 'error', message: 'Conferencia no encontrada' });
      return res.status(200).json({ status: 'success', message: 'Conferencia actualizada correctamente', data: updated });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error actualizando conferencia", error: err.message });
    }
  },
};
