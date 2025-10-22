const mongoose = require("mongoose");
const db = require("../database/conection");
const ModelFile = require("../models/ponentes.model");

const ensureConnected = async () => {
  if (!db.connections.defaultConn) await db.connect();
};

module.exports = {
  guardarPonente: async (req, res) => {
    try {
      await ensureConnected();
      const { nombre } = req.body;
      if (!nombre) return res.status(400).json({ status: 'error', message: 'Falta nombre' });
      const Model = ModelFile.getModel();
      const saved = await Model.create(req.body);
      return res.status(201).json({ status: 'success', message: 'Ponente guardado', data: saved });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error guardando ponente", error: err.message });
    }
  },
  listarPonentes: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
    const items = await Model.find().populate('eventos').lean();
      return res.json(items);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error listando ponentes", error: err.message });
    }
  },
  obtenerPonentePorId: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "ID inválido" });
    const item = await Model.findById(req.params.id).populate('eventos').lean();
      if (!item) return res.status(404).json({ message: "No encontrado" });
      return res.json(item);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error buscando ponente", error: err.message });
    }
  },
  eliminarPonente: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "ID inválido" });
      const deleted = await Model.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "No encontrado" });
      return res.json({ message: "Eliminado" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error eliminando ponente", error: err.message });
    }
  },
  actualizarPonente: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ModelFile.getModel();
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ status: 'error', message: 'ID inválido' });

      const { nombre, apellido, bio } = req.body;
      if (!nombre && !apellido && !bio) {
        return res.status(400).json({ status: 'error', message: 'Debe proporcionar al menos un campo para actualizar' });
      }

      const datosActualizar = {};
      if (nombre) datosActualizar.nombre = nombre;
      if (apellido) datosActualizar.apellido = apellido;
      if (bio) datosActualizar.bio = bio;

      const updated = await Model.findByIdAndUpdate(id, datosActualizar, { new: true, runValidators: true, context: 'query' });
      if (!updated) return res.status(404).json({ status: 'error', message: 'Ponente no encontrado' });
      return res.status(200).json({ status: 'success', message: 'Ponente actualizado correctamente', data: updated });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error actualizando ponente", error: err.message });
    }
  },
};
