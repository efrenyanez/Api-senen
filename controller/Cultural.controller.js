const mongoose = require("mongoose");
const CulturalModel = require("../models/cultural.model");

// Register related models for populate
try { require('../models/participantes.model').getModel(); } catch(e) { /* ignore */ }

const Cultural = () => CulturalModel.getModel();

/** Crear evento cultural */
const crearCultural = async (req, res) => {
  try {
    // 1) Recibir datos
    const { nombre, descripcion, fecha, participantes } = req.body;

    // 2) Validar obligatorios
    if (!nombre) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios: nombre",
      });
    }

    // 3) Crear y guardar
    const nuevo = new (Cultural())({
      nombre,
      descripcion,
      fecha,
      participantes,
    });

    const guardado = await nuevo.save();

    // 4) Responder
    return res.status(201).json({
      status: "success",
      message: "Evento cultural guardado correctamente",
      data: guardado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al crear evento cultural",
      error: err.message,
    });
  }
};

/** Listar eventos culturales */
const listarCulturales = async (req, res) => {
  try {
    const items = await Cultural().find().populate("participantes");
    return res.status(200).json({
      status: "success",
      message: "Eventos culturales obtenidos",
      data: items,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al listar eventos culturales",
      error: err.message,
    });
  }
};

/** Obtener evento cultural por ID */
const obtenerCultural = async (req, res) => {
  try {
    const { id } = req.params;

    // 1) Validar ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID inválido",
      });
    }

    // 2) Buscar
    const cultural = await Cultural().findById(id).populate("participantes");

    // 3) No encontrado
    if (!cultural) {
      return res.status(404).json({
        status: "error",
        message: "Evento cultural no encontrado",
      });
    }

    // 4) OK
    return res.status(200).json({
      status: "success",
      message: "Evento cultural encontrado",
      data: cultural,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener evento cultural",
      error: err.message,
    });
  }
};

/** Eliminar evento cultural */
const eliminarCultural = async (req, res) => {
  try {
    const { id } = req.params;

    // 1) Validar ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID inválido",
      });
    }

    // 2) Eliminar
    const eliminado = await Cultural().findByIdAndDelete(id).lean();

    // 3) No encontrado
    if (!eliminado) {
      return res.status(404).json({
        status: "error",
        message: "Evento cultural no encontrado",
      });
    }

    // 4) OK
    return res.status(200).json({
      status: "success",
      message: "Evento cultural eliminado correctamente",
      data: eliminado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar evento cultural",
      error: err.message,
    });
  }
};

/** Actualizar evento cultural */
const actualizarCultural = async (req, res) => {
  try {
    const { id } = req.params;

    // 1) Validar ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID inválido",
      });
    }

    // 2) Recibir datos
    const { nombre, descripcion, fecha, participantes } = req.body;

    // 3) Validar que venga al menos un campo
    if (!nombre && !descripcion && !fecha && !participantes) {
      return res.status(400).json({
        status: "error",
        message: "Debe proporcionar al menos un campo para actualizar",
      });
    }

    // 4) Armar objeto
    const datosActualizar = {};
    if (nombre) datosActualizar.nombre = nombre;
    if (descripcion) datosActualizar.descripcion = descripcion;
    if (fecha) datosActualizar.fecha = fecha;
    if (participantes) datosActualizar.participantes = participantes;

    // 5) Actualizar
    const actualizado = await Cultural().findByIdAndUpdate(id, datosActualizar, {
      new: true,
      runValidators: true,
      context: "query",
    });

    // 6) No encontrado
    if (!actualizado) {
      return res.status(404).json({
        status: "error",
        message: "Evento cultural no encontrado",
      });
    }

    // 7) OK
    return res.status(200).json({
      status: "success",
      message: "Evento cultural actualizado correctamente",
      data: actualizado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar evento cultural",
      error: err.message,
    });
  }
};

module.exports = {
  crearCultural,
  listarCulturales,
  obtenerCultural,
  eliminarCultural,
  actualizarCultural,
};
