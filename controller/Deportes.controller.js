const db = require("../database/conection");
const ModelFile = require("../models/deportes.model");

const ensureConnected = async () => {
  if (!db.connections.defaultConn) await db.connect();
};

module.exports = {
  guardar: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      const doc = new Model(req.body);
      const saved = await doc.save();
      return res.status(201).json(saved);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error guardando deporte", error: err.message });
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
      return res.status(500).json({ message: "Error listando deportes", error: err.message });
    }
  },
  PlatillosPorId: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      const item = await Model.findById(req.params.id).lean();
      if (!item) return res.status(404).json({ message: "No encontrado" });
      return res.json(item);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error buscando deporte", error: err.message });
    }
  },
  eliminarPlatillos: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      const deleted = await Model.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "No encontrado" });
      return res.json({ message: "Eliminado" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error eliminando deporte", error: err.message });
    }
  },
  actualizarPlatillos: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: "No encontrado" });
      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error actualizando deporte", error: err.message });
    }
  },
};
