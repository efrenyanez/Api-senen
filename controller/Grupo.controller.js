const mongoose = require("mongoose");
const db = require("../database/conection");
const GrupoModel = require("../models/grupo.model");

const ensureConnected = async () => {
  if (!db.connections.defaultConn) {
    await db.connect();
  }
};

module.exports = {
  guardarGrupo: async (req, res) => {
    try {
      await ensureConnected();
      const { nombre, genero, miembros, eventos } = req.body;
      const faltantes = [];
      if (!nombre) faltantes.push('nombre');
      if (faltantes.length) return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios', faltantes });

      const Model = GrupoModel.getModel();
      const nuevo = new Model({ nombre, genero, miembros, eventos });
      const saved = await nuevo.save();
      return res.status(201).json({ status: 'success', message: 'Grupo guardado', data: saved });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error guardando grupo", error: err.message });
    }
  },
  listarGrupos: async (req, res) => {
    try {
      await ensureConnected();
  const Model = GrupoModel.getModel();
      // Asegurar que el modelo Participantes esté registrado en la conexión de teams
      try { require('../models/participantes.model').getModel(); } catch (e) { /* ignore */ }

      // No hacer populate cross-DB; obtener items y luego cargar participantes desde teamsConn
      const items = await Model.find().lean();

      // Recolectar todos los ids de participantes (soportar campos 'integrantes' y 'miembros')
      const allParticipantIds = items.reduce((acc, it) => {
        if (Array.isArray(it.integrantes) && it.integrantes.length) acc.push(...it.integrantes.map(String));
        if (Array.isArray(it.miembros) && it.miembros.length) acc.push(...it.miembros.map(String));
        return acc;
      }, []);
      if (allParticipantIds.length) {
        try {
          const ParticipantesModel = require('../models/participantes.model').getModel();
          const parts = await ParticipantesModel.find({ _id: { $in: allParticipantIds } }).lean();
          const byId = parts.reduce((m,p)=>{ m[p._id.toString()] = p; return m; },{});
          items.forEach(it => {
            if (Array.isArray(it.integrantes)) it.integrantes = it.integrantes.map(id => byId[id.toString()] || id);
            if (Array.isArray(it.miembros)) it.miembros = it.miembros.map(id => byId[id.toString()] || id);
          });
        } catch (e) {
          console.warn('No se pudieron cargar participantes (cross-db):', e.message);
        }
      }

      // Cargar eventos desde la conexión default (si existen ids)
      const allEventIds = items.reduce((acc, it) => {
        if (Array.isArray(it.eventos) && it.eventos.length) acc.push(...it.eventos.map(String));
        return acc;
      }, []);
      if (allEventIds.length) {
        try {
          const EventoModel = require('../models/evento.model').getModel();
          const eventosDocs = await EventoModel.find({ _id: { $in: allEventIds } }).lean();
          const byId = eventosDocs.reduce((m, e) => { m[e._id.toString()] = e; return m; }, {});
          items.forEach(it => { if (Array.isArray(it.eventos)) it.eventos = it.eventos.map(id => byId[id.toString()] || id); });
        } catch (e) {
          console.warn('No se pudieron cargar eventos (cross-db):', e.message);
        }
      }
      return res.json(items);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error listando grupos", error: err.message });
    }
  },
  obtenerGrupoPorId: async (req, res) => {
    try {
      await ensureConnected();
      const Model = GrupoModel.getModel();
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "ID inválido" });
      // No populate cross-DB; cargar participantes desde teamsConn si existen
      const item = await Model.findById(req.params.id).lean();
      if (item && (Array.isArray(item.integrantes) && item.integrantes.length || Array.isArray(item.miembros) && item.miembros.length)) {
        try {
          const ParticipantesModel = require('../models/participantes.model').getModel();
          const ids = [];
          if (Array.isArray(item.integrantes)) ids.push(...item.integrantes.map(String));
          if (Array.isArray(item.miembros)) ids.push(...item.miembros.map(String));
          if (ids.length) {
            const parts = await ParticipantesModel.find({ _id: { $in: ids } }).lean();
            const byId = parts.reduce((m,p)=>{ m[p._id.toString()] = p; return m; },{});
            if (Array.isArray(item.integrantes)) item.integrantes = item.integrantes.map(id => byId[id.toString()] || id);
            if (Array.isArray(item.miembros)) item.miembros = item.miembros.map(id => byId[id.toString()] || id);
          }
        } catch(e) {
          console.warn('No se pudieron cargar participantes (cross-db):', e.message);
        }
      }
      if (item && Array.isArray(item.eventos) && item.eventos.length) {
        try {
          const EventoModel = require('../models/evento.model').getModel();
          const eventosDocs = await EventoModel.find({ _id: { $in: item.eventos } }).lean();
          const byId = eventosDocs.reduce((m, e) => { m[e._id.toString()] = e; return m; }, {});
          item.eventos = item.eventos.map(id => byId[id.toString()] || id);
        } catch (e) {
          console.warn('No se pudieron cargar eventos (cross-db):', e.message);
        }
      }
      if (!item) return res.status(404).json({ message: "No encontrado" });
      return res.json(item);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error buscando grupo", error: err.message });
    }
  },
  eliminarGrupo: async (req, res) => {
    try {
      await ensureConnected();
      const Model = GrupoModel.getModel();
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "ID inválido" });
      const deleted = await Model.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "No encontrado" });
      return res.json({ message: "Eliminado" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error eliminando grupo", error: err.message });
    }
  },
  actualizarGrupo: async (req, res) => {
    try {
      await ensureConnected();
      const Model = GrupoModel.getModel();
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ status: 'error', message: 'ID inválido' });

      const { nombre, genero, miembros, eventos } = req.body;
      if (!nombre && !genero && !miembros && !eventos) {
        return res.status(400).json({ status: 'error', message: 'Debe proporcionar al menos un campo para actualizar' });
      }

      const datosActualizar = {};
      if (nombre) datosActualizar.nombre = nombre;
      if (genero) datosActualizar.genero = genero;
      if (miembros) datosActualizar.miembros = miembros;
      if (eventos) datosActualizar.eventos = eventos;

      const updated = await Model.findByIdAndUpdate(id, datosActualizar, { new: true, runValidators: true, context: 'query' });
      if (!updated) return res.status(404).json({ status: 'error', message: 'Grupo no encontrado' });
      return res.status(200).json({ status: 'success', message: 'Grupo actualizado correctamente', data: updated });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error actualizando grupo", error: err.message });
    }
  },
};
