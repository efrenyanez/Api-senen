const db = require("../database/conection");
const EquiposModel = require("../models/equipos.model");

const ensureConnected = async () => {
  if (!db.connections.teamsConn) {
    await db.connect();
  }
};

module.exports = {
  guardar: async (req, res) => {
    try {
      await ensureConnected();
      const Model = EquiposModel.getModel();
      const doc = new Model(req.body);
      const saved = await doc.save();
      return res.status(201).json(saved);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error guardando equipo", error: err.message });
    }
  },
  ListarTodos: async (req, res) => {
    try {
      await ensureConnected();
      const Model = EquiposModel.getModel();
      const items = await Model.find().lean();
      return res.json(items);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error listando equipos", error: err.message });
    }
  },
  PlatillosPorId: async (req, res) => {
    try {
      await ensureConnected();
      const Model = EquiposModel.getModel();
      const item = await Model.findById(req.params.id).lean();
      if (!item) return res.status(404).json({ message: "No encontrado" });
      return res.json(item);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error buscando equipo", error: err.message });
    }
  },
  eliminarPlatillos: async (req, res) => {
    try {
      await ensureConnected();
      const Model = EquiposModel.getModel();
      const deleted = await Model.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "No encontrado" });
      return res.json({ message: "Eliminado" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error eliminando equipo", error: err.message });
    }
  },
  actualizarPlatillos: async (req, res) => {
    try {
      await ensureConnected();
      const Model = EquiposModel.getModel();
      const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: "No encontrado" });
      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error actualizando equipo", error: err.message });
    }
  },
};
