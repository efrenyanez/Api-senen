const mongoose = require("mongoose");
const db = require("../database/conection");
const ParticipantesModel = require("../models/participantes.model");

const ensureConnected = async () => {
  if (!db.connections.teamsConn) {
    await db.connect();
  }
};

module.exports = {
  guardarParticipante: async (req, res) => {
    try {
      await ensureConnected();
      const { nombre, apellido, email, telefono, tipo, equipo } = req.body;
      const faltantes = [];
      if (!nombre) faltantes.push('nombre');
      if (!apellido) faltantes.push('apellido');
      if (faltantes.length) return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios', faltantes });

      const Model = ParticipantesModel.getModel();
      const nuevo = new Model({ nombre, apellido, email, telefono, tipo, equipo });
      const saved = await nuevo.save();

      // Si se proporcionó equipo, agregar referencia en el documento del equipo
      if (equipo) {
        try {
          const EquiposModel = require('../models/equipos.model');
          const Equipos = EquiposModel.getModel();
          await Equipos.findByIdAndUpdate(equipo, { $addToSet: { integrantes: saved._id } });
        } catch (e) {
          console.warn('No se pudo enlazar participante con equipo:', e.message);
        }
      }

      return res.status(201).json({ status: 'success', message: 'Participante guardado', data: saved });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error guardando participante", error: err.message });
    }
  },
  listarParticipantes: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ParticipantesModel.getModel();
      const items = await Model.find().populate('equipo').lean();

      // Cargar eventos desde defaultConn si hay ids
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
      return res.status(500).json({ message: "Error listando participantes", error: err.message });
    }
  },
  obtenerParticipantePorId: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ParticipantesModel.getModel();
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "ID inválido" });
      const item = await Model.findById(req.params.id).populate('equipo').lean();
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
      return res.status(500).json({ message: "Error buscando participante", error: err.message });
    }
  },
  eliminarParticipante: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ParticipantesModel.getModel();
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "ID inválido" });
      const deleted = await Model.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "No encontrado" });
      return res.json({ message: "Eliminado" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error eliminando participante", error: err.message });
    }
  },
  actualizarParticipante: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ParticipantesModel.getModel();
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ status: 'error', message: 'ID inválido' });

      const { nombre, apellido, email, telefono, tipo, equipo, eventos } = req.body;
      if (!nombre && !apellido && !email && !telefono && !tipo && !equipo && !eventos) {
        return res.status(400).json({ status: 'error', message: 'Debe proporcionar al menos un campo para actualizar' });
      }

      const datosActualizar = {};
      if (nombre) datosActualizar.nombre = nombre;
      if (apellido) datosActualizar.apellido = apellido;
      if (email) datosActualizar.email = email;
      if (telefono) datosActualizar.telefono = telefono;
      if (tipo) datosActualizar.tipo = tipo;
      if (equipo) datosActualizar.equipo = equipo;
      if (eventos) datosActualizar.eventos = eventos;

      const updated = await Model.findByIdAndUpdate(id, datosActualizar, { new: true, runValidators: true, context: 'query' });
      if (!updated) return res.status(404).json({ status: 'error', message: 'Participante no encontrado' });
      return res.status(200).json({ status: 'success', message: 'Participante actualizado correctamente', data: updated });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error actualizando participante", error: err.message });
    }
  },
};
