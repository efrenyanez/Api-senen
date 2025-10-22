const mongoose = require("mongoose");
const db = require("../database/conection");
const ModelFile = require("../models/cultural.model");

const ensureConnected = async () => {
  if (!db.connections.defaultConn) await db.connect();
};

module.exports = {
  guardarCultural: async (req, res) => {
    try {
      await ensureConnected();
      const { nombre, fecha } = req.body;
      const faltantes = [];
      if (!nombre) faltantes.push('nombre');
      if (!fecha) faltantes.push('fecha');
      if (faltantes.length) return res.status(400).json({ status: 'error', message: 'Faltan campos', faltantes });

      const Model = ModelFile.getModel();
      const saved = await Model.create(req.body);
      return res.status(201).json({ status: 'success', message: 'Evento cultural guardado', data: saved });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error guardando cultural", error: err.message });
    }
  },
  listarCulturales: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      // participantes están en teamsConn: cargar ids y luego consultar en la otra conexión
      const items = await Model.find().lean();
      const allParticipantIds = items.reduce((acc, it) => {
        if (Array.isArray(it.participantes) && it.participantes.length) acc.push(...it.participantes.map(String));
        return acc;
      }, []);
      if (allParticipantIds.length) {
        try {
          const ParticipantesModel = require('../models/participantes.model').getModel();
          const parts = await ParticipantesModel.find({ _id: { $in: allParticipantIds } }).lean();
          const byId = parts.reduce((m,p)=>{ m[p._id.toString()]=p; return m; },{});
          items.forEach(it=>{ if (Array.isArray(it.participantes)) it.participantes = it.participantes.map(id=> byId[id.toString()] || id); });
        } catch(e) {
          console.warn('No se pudieron cargar participantes (cross-db):', e.message);
        }
      }
      return res.json(items);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error listando culturales", error: err.message });
    }
  },
  obtenerCulturalPorId: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "ID inválido" });
      const item = await Model.findById(req.params.id).lean();
      if (item && Array.isArray(item.participantes) && item.participantes.length) {
        try {
          const ParticipantesModel = require('../models/participantes.model').getModel();
          const parts = await ParticipantesModel.find({ _id: { $in: item.participantes } }).lean();
          const byId = parts.reduce((m,p)=>{ m[p._id.toString()]=p; return m; },{});
          item.participantes = item.participantes.map(id=> byId[id.toString()] || id);
        } catch(e) {
          console.warn('No se pudieron cargar participantes (cross-db):', e.message);
        }
      }
      if (!item) return res.status(404).json({ message: "No encontrado" });
      return res.json(item);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error buscando cultural", error: err.message });
    }
  },
  eliminarCultural: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "ID inválido" });
      const deleted = await Model.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "No encontrado" });
      return res.json({ message: "Eliminado" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error eliminando cultural", error: err.message });
    }
  },
  actualizarCultural: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ status: 'error', message: 'ID inválido' });

      const { nombre, fecha, descripcion } = req.body;
      if (!nombre && !fecha && !descripcion) {
        return res.status(400).json({ status: 'error', message: 'Debe proporcionar al menos un campo para actualizar' });
      }

      const datosActualizar = {};
      if (nombre) datosActualizar.nombre = nombre;
      if (fecha) datosActualizar.fecha = fecha;
      if (descripcion) datosActualizar.descripcion = descripcion;

      const updated = await Model.findByIdAndUpdate(id, datosActualizar, { new: true, runValidators: true, context: 'query' });
      if (!updated) return res.status(404).json({ status: 'error', message: 'Evento cultural no encontrado' });
      return res.status(200).json({ status: 'success', message: 'Evento cultural actualizado correctamente', data: updated });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error actualizando cultural", error: err.message });
    }
  },
};
