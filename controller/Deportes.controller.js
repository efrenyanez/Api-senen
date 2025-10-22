const mongoose = require("mongoose");
const db = require("../database/conection");
const ModelFile = require("../models/deportes.model");

const ensureConnected = async () => {
  if (!db.connections.defaultConn) await db.connect();
};

module.exports = {
  guardarDeporte: async (req, res) => {
    try {
      await ensureConnected();
      const { nombre, tipo, equipos, fecha } = req.body;
      const faltantes = [];
      if (!nombre) faltantes.push('nombre');
      if (faltantes.length) return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios', faltantes });

      const Model = ModelFile.getModel();
      const nuevo = new Model({ nombre, tipo, equipos, fecha });
      const saved = await nuevo.save();
      return res.status(201).json({ status: 'success', message: 'Evento deportivo guardado', data: saved });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error guardando deporte", error: err.message });
    }
  },
  listarDeportes: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      // cargar items sin populate cross-db
      const items = await Model.find().lean();

      // recopilar ids de equipos y participantes
      const allTeamIds = [];
      const allParticipantIds = [];
      items.forEach(it => {
        if (Array.isArray(it.equipos)) allTeamIds.push(...it.equipos.map(String));
        if (Array.isArray(it.participantes)) allParticipantIds.push(...it.participantes.map(String));
      });

      // cargar desde teamsConn si hay ids
      try {
        const EquiposModel = require('../models/equipos.model').getModel();
        const ParticipantesModel = require('../models/participantes.model').getModel();
        const [teams, parts] = await Promise.all([
          allTeamIds.length ? EquiposModel.find({ _id: { $in: allTeamIds } }).lean() : [],
          allParticipantIds.length ? ParticipantesModel.find({ _id: { $in: allParticipantIds } }).lean() : []
        ]);
        const teamsById = teams.reduce((m,t)=>{ m[t._id.toString()] = t; return m; },{});
        const partsById = parts.reduce((m,p)=>{ m[p._id.toString()] = p; return m; },{});
        items.forEach(it=>{
          if (Array.isArray(it.equipos)) it.equipos = it.equipos.map(id=> teamsById[id.toString()] || id);
          if (Array.isArray(it.participantes)) it.participantes = it.participantes.map(id=> partsById[id.toString()] || id);
        });
      } catch(e) {
        console.warn('No se pudieron cargar equipos/participantes (cross-db):', e.message);
      }

      return res.json(items);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error listando deportes", error: err.message });
    }
  },
  obtenerDeportePorId: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "ID inválido" });
      const item = await Model.findById(req.params.id).lean();
      if (!item) return res.status(404).json({ message: 'No encontrado' });
      try {
        const EquiposModel = require('../models/equipos.model').getModel();
        const ParticipantesModel = require('../models/participantes.model').getModel();
        const [teams, parts] = await Promise.all([
          Array.isArray(item.equipos) && item.equipos.length ? EquiposModel.find({ _id: { $in: item.equipos } }).lean() : [],
          Array.isArray(item.participantes) && item.participantes.length ? ParticipantesModel.find({ _id: { $in: item.participantes } }).lean() : []
        ]);
        const teamsById = teams.reduce((m,t)=>{ m[t._id.toString()] = t; return m; },{});
        const partsById = parts.reduce((m,p)=>{ m[p._id.toString()] = p; return m; },{});
        if (Array.isArray(item.equipos)) item.equipos = item.equipos.map(id=> teamsById[id.toString()] || id);
        if (Array.isArray(item.participantes)) item.participantes = item.participantes.map(id=> partsById[id.toString()] || id);
      } catch(e) {
        console.warn('No se pudieron cargar equipos/participantes (cross-db):', e.message);
      }
      if (!item) return res.status(404).json({ message: "No encontrado" });
      return res.json(item);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error buscando deporte", error: err.message });
    }
  },
  eliminarDeporte: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "ID inválido" });
      const deleted = await Model.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "No encontrado" });
      return res.json({ message: "Eliminado" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error eliminando deporte", error: err.message });
    }
  },
  actualizarDeporte: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ status: 'error', message: 'ID inválido' });

      const { nombre, tipo, equipos, fecha } = req.body;
      if (!nombre && !tipo && !equipos && !fecha) {
        return res.status(400).json({ status: 'error', message: 'Debe proporcionar al menos un campo para actualizar' });
      }

      const datosActualizar = {};
      if (nombre) datosActualizar.nombre = nombre;
      if (tipo) datosActualizar.tipo = tipo;
      if (equipos) datosActualizar.equipos = equipos;
      if (fecha) datosActualizar.fecha = fecha;

      const updated = await Model.findByIdAndUpdate(id, datosActualizar, { new: true, runValidators: true, context: 'query' });
      if (!updated) return res.status(404).json({ status: 'error', message: 'Evento deportivo no encontrado' });
      return res.status(200).json({ status: 'success', message: 'Evento deportivo actualizado correctamente', data: updated });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error actualizando deporte", error: err.message });
    }
  },
};
