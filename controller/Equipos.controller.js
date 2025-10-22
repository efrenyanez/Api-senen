const mongoose = require("mongoose");
const db = require("../database/conection");
const EquiposModel = require("../models/equipos.model");

const ensureConnected = async () => {
  if (!db.connections.teamsConn) {
    await db.connect();
  }
};

module.exports = {
  guardarEquipo: async (req, res) => {
    try {
      await ensureConnected();
      const { nombre, pais, integrantes, descripcion, eventos } = req.body;
      const faltantes = [];
      if (!nombre) faltantes.push('nombre');
      if (faltantes.length) return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios', faltantes });

      const Model = EquiposModel.getModel();
      const nuevo = new Model({ nombre, pais, integrantes, descripcion, eventos });
      const saved = await nuevo.save();

      // Si se proporcionaron integrantes, actualizar su campo 'equipo'
      if (integrantes && integrantes.length) {
        try {
          const ParticipantesModel = require('../models/participantes.model');
          const Participantes = ParticipantesModel.getModel();
          await Participantes.updateMany(
            { _id: { $in: integrantes } },
            { $set: { equipo: saved._id } }
          );
        } catch (e) {
          console.warn('No se pudo enlazar integrantes con equipo:', e.message);
        }
      }

      return res.status(201).json({ status: 'success', message: 'Equipo guardado', data: saved });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error guardando equipo", error: err.message });
    }
  },
  listarEquipos: async (req, res) => {
    try {
      await ensureConnected();
  const Model = EquiposModel.getModel();
  // populate integrantes (local to teamsConn)
  const items = await Model.find().populate('integrantes').lean();

  // Cargar eventos desde defaultConn si existen
  const allEventIds = items.reduce((acc, it) => {
    if (Array.isArray(it.eventos) && it.eventos.length) acc.push(...it.eventos.map(String));
    return acc;
  }, []);
  if (allEventIds.length) {
    try {
      const EventoModel = require('../models/evento.model').getModel();
      const eventosDocs = await EventoModel.find({ _id: { $in: allEventIds } }).lean();
      const byId = eventosDocs.reduce((m,e)=>{ m[e._id.toString()] = e; return m; },{});
      items.forEach(it=>{ if (Array.isArray(it.eventos)) it.eventos = it.eventos.map(id=> byId[id.toString()] || id); });
    } catch(e) {
      console.warn('No se pudieron cargar eventos (cross-db):', e.message);
    }
  }
  return res.json(items);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error listando equipos", error: err.message });
    }
  },
  obtenerEquipoPorId: async (req, res) => {
    try {
      await ensureConnected();
      const Model = EquiposModel.getModel();
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "ID inválido" });
      const item = await Model.findById(req.params.id).populate('integrantes').lean();
      if (item && Array.isArray(item.eventos) && item.eventos.length) {
        try {
          const EventoModel = require('../models/evento.model').getModel();
          const eventosDocs = await EventoModel.find({ _id: { $in: item.eventos } }).lean();
          const byId = eventosDocs.reduce((m,e)=>{ m[e._id.toString()] = e; return m; },{});
          item.eventos = item.eventos.map(id=> byId[id.toString()] || id);
        } catch(e) {
          console.warn('No se pudieron cargar eventos (cross-db):', e.message);
        }
      }
      
      if (!item) return res.status(404).json({ message: "No encontrado" });
      return res.json(item);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error buscando equipo", error: err.message });
    }
  },
  eliminarEquipo: async (req, res) => {
    try {
      await ensureConnected();
      const Model = EquiposModel.getModel();
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "ID inválido" });
      const deleted = await Model.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "No encontrado" });
      return res.json({ message: "Eliminado" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error eliminando equipo", error: err.message });
    }
  },
  actualizarEquipo: async (req, res) => {
    try {
      await ensureConnected();
      const Model = EquiposModel.getModel();
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ status: 'error', message: 'ID inválido' });

      const { nombre, pais, integrantes, descripcion, eventos } = req.body;
      if (!nombre && !pais && !integrantes && !descripcion && !eventos) {
        return res.status(400).json({ status: 'error', message: 'Debe proporcionar al menos un campo para actualizar' });
      }

      const datosActualizar = {};
      if (nombre) datosActualizar.nombre = nombre;
      if (pais) datosActualizar.pais = pais;
      if (integrantes) datosActualizar.integrantes = integrantes;
      if (descripcion) datosActualizar.descripcion = descripcion;
      if (eventos) datosActualizar.eventos = eventos;

      const updated = await Model.findByIdAndUpdate(id, datosActualizar, { new: true, runValidators: true, context: 'query' });
      if (!updated) return res.status(404).json({ status: 'error', message: 'Equipo no encontrado' });
      return res.status(200).json({ status: 'success', message: 'Equipo actualizado correctamente', data: updated });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error actualizando equipo", error: err.message });
    }
  },
};
