const mongoose = require("mongoose");
const db = require("../database/conection");
const ConciertosModel = require("../models/conciertos.model");

const ensureConnected = async () => {
  if (!db.connections.defaultConn) {
    await db.connect();
  }
};

module.exports = {
  guardar: async (req, res) => {
    try {
      await ensureConnected();
      const { nombre, artistaPrincipal, generoMusical, fecha, horaInicio, horaFin, lugar, direccion, ciudad, pais, precioMinimo, precioMaximo, moneda, boletosDisponibles, organizador } = req.body;

      // Validar campos obligatorios
      const faltantes = [];
      if (!nombre) faltantes.push('nombre');
      if (!artistaPrincipal) faltantes.push('artistaPrincipal');
      if (!generoMusical) faltantes.push('generoMusical');
      if (!fecha) faltantes.push('fecha');
      if (!horaInicio) faltantes.push('horaInicio');
      if (!horaFin) faltantes.push('horaFin');
      if (!lugar) faltantes.push('lugar');
      if (!direccion) faltantes.push('direccion');
      if (!ciudad) faltantes.push('ciudad');
      if (!pais) faltantes.push('pais');
      if (precioMinimo === undefined) faltantes.push('precioMinimo');
      if (precioMaximo === undefined) faltantes.push('precioMaximo');
      if (!moneda) faltantes.push('moneda');
      if (boletosDisponibles === undefined) faltantes.push('boletosDisponibles');
      if (!organizador) faltantes.push('organizador');

      if (faltantes.length) {
        return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios', faltantes });
      }

      const Model = ConciertosModel.getModel();
      const saved = await Model.create(req.body);
      return res.status(201).json({ status: 'success', message: 'Concierto guardado', data: saved });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error guardando concierto", error: err.message });
    }
  },
  ListarTodos: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ConciertosModel.getModel();
      const items = await Model.find().lean();
      return res.json(items);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error listando conciertos", error: err.message });
    }
  },
  PlatillosPorId: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ConciertosModel.getModel();
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "ID inválido" });
      const item = await Model.findById(req.params.id).lean();
      if (!item) return res.status(404).json({ message: "No encontrado" });
      return res.json(item);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error buscando concierto", error: err.message });
    }
  },
  eliminarPlatillos: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ConciertosModel.getModel();
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "ID inválido" });
      const deleted = await Model.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "No encontrado" });
      return res.json({ message: "Eliminado" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error eliminando concierto", error: err.message });
    }
  },
  actualizarPlatillos: async (req, res) => {
    try {
      await ensureConnected();
      const Model = ConciertosModel.getModel();
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "ID inválido" });
      const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, context: 'query' });
      if (!updated) return res.status(404).json({ message: "No encontrado" });
      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error actualizando concierto", error: err.message });
    }
  },
};
