const mongoose = require("mongoose");
const ConferenciasModel = require("../models/conferencias.model");
// Registrar modelos relacionados para populate
try { require('../models/ponentes.model').getModel(); } catch(e) { /* ignore */ }
try { require('../models/participantes.model').getModel(); } catch(e) { /* ignore */ }

const Conferencia = () => ConferenciasModel.getModel();

/** Crear */
const crearConferencia = async (req, res) => {
  try {
    // 1) Recibir datos
    const { titulo, fecha, descripcion, ponentes, participantes } = req.body;

    // 2) Validar obligatorios (ajusta si quieres exigir fecha)
    if (!titulo) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios: titulo",
      });
    }

    // 3) Crear y guardar
    const nueva = new (Conferencia())({
      titulo,
      fecha,
      descripcion,
      ponentes,
      participantes,
    });

    const guardada = await nueva.save();

    // 4) Responder
    return res.status(201).json({
      status: "success",
      message: "Conferencia guardada correctamente",
      data: guardada,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al crear conferencia",
      error: err.message,
    });
  }
};

/** Listar */
const listarConferencias = async (req, res) => {
  try {
    const items = await Conferencia()
      .find()
      .populate("ponentes")
      .populate("participantes");

    return res.status(200).json({
      status: "success",
      message: "Conferencias obtenidas",
      data: items,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al listar conferencias",
      error: err.message,
    });
  }
};

/** Obtener por ID */
const obtenerConferencia = async (req, res) => {
  try {
    const { id } = req.params;

    // 1) Validar ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ status: "error", message: "ID inválido" });
    }

    // 2) Buscar
    const doc = await Conferencia()
      .findById(id)
      .populate("ponentes")
      .populate("participantes");

    // 3) No encontrado
    if (!doc) {
      return res.status(404).json({
        status: "error",
        message: "Conferencia no encontrada",
      });
    }

    // 4) OK
    return res.status(200).json({
      status: "success",
      message: "Conferencia encontrada",
      data: doc,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener conferencia",
      error: err.message,
    });
  }
};

/** Eliminar */
const eliminarConferencia = async (req, res) => {
  try {
    const { id } = req.params;

    // 1) Validar ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ status: "error", message: "ID inválido" });
    }

    // 2) Eliminar
    const eliminado = await Conferencia().findByIdAndDelete(id).lean();

    // 3) No encontrado
    if (!eliminado) {
      return res.status(404).json({
        status: "error",
        message: "Conferencia no encontrada",
      });
    }

    // 4) OK
    return res.status(200).json({
      status: "success",
      message: "Conferencia eliminada correctamente",
      data: eliminado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar conferencia",
      error: err.message,
    });
  }
};

/** Actualizar (parcial) */
const actualizarConferencia = async (req, res) => {
  try {
    const { id } = req.params;

    // 1) Validar ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ status: "error", message: "ID inválido" });
    }

    // 2) Recibir datos
    const { titulo, fecha, descripcion, ponentes, participantes } = req.body;

    // 3) Validar que venga al menos un campo
    if (!titulo && !fecha && !descripcion && !ponentes && !participantes) {
      return res.status(400).json({
        status: "error",
        message: "Debe proporcionar al menos un campo para actualizar",
      });
    }

    // 4) Armar objeto de actualización
    const datosActualizar = {};
    if (titulo) datosActualizar.titulo = titulo;
    if (fecha) datosActualizar.fecha = fecha;
    if (descripcion) datosActualizar.descripcion = descripcion;
    if (ponentes) datosActualizar.ponentes = ponentes;
    if (participantes) datosActualizar.participantes = participantes;

    // 5) Actualizar
    const actualizado = await Conferencia().findByIdAndUpdate(id, datosActualizar, {
      new: true,
      runValidators: true,
      context: "query",
    });

    // 6) No encontrado
    if (!actualizado) {
      return res.status(404).json({
        status: "error",
        message: "Conferencia no encontrada",
      });
    }

    // 7) OK
    return res.status(200).json({
      status: "success",
      message: "Conferencia actualizada correctamente",
      data: actualizado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar conferencia",
      error: err.message,
    });
  }
};

module.exports = {
  crearConferencia,
  listarConferencias,
  obtenerConferencia,
  eliminarConferencia,
  actualizarConferencia,
};
