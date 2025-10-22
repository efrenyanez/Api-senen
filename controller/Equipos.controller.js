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
  const items = await Model.find().populate('integrantes eventos').lean();
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
  const item = await Model.findById(req.params.id).populate('integrantes eventos').lean();
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
