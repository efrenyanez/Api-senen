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
  const items = await Model.find().populate('integrantes eventos').lean();
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
  const item = await Model.findById(req.params.id).populate('integrantes eventos').lean();
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
