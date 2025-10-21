const mongoose = require("mongoose");
const db = require("../database/conection");
const ModelFile = require("../models/conferencias.model");

const ensureConnected = async () => {
  if (!db.connections.defaultConn) await db.connect();
};

module.exports = {
  guardar: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      const saved = await Model.create(req.body);
      return res.status(201).json(saved);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error guardando conferencia", error: err.message });
    }
  },
  ListarTodos: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      const items = await Model.find().lean();
      return res.json(items);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error listando conferencias", error: err.message });
    }
  },
  PlatillosPorId: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "ID inválido" });
      const item = await Model.findById(req.params.id).lean();
      if (!item) return res.status(404).json({ message: "No encontrado" });
      return res.json(item);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error buscando conferencia", error: err.message });
    }
  },
  eliminarPlatillos: async (req, res) => {
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
  actualizarPlatillos: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "ID inválido" });
      const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, context: 'query' });
      if (!updated) return res.status(404).json({ message: "No encontrado" });
      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error actualizando conferencia", error: err.message });
    }
  },
};
