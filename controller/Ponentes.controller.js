const mongoose = require("mongoose");
const PonentesModel = require("../models/ponentes.model");

// Register related models for populate
try { require('../models/evento.model').getModel(); } catch(e) { /* ignore */ }

const Ponente = () => PonentesModel.getModel();

/** Crear ponente */
const crearPonente = async (req, res) => {
  try {
    // 1) Recibir datos
    const { nombre, especialidad, email, telefono, eventos, descripcion } = req.body;

    // 2) Validar obligatorios
    if (!nombre || !especialidad) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios: nombre o especialidad",
      });
    }

    // 3) Crear y guardar
    const nuevo = new (Ponente())({
      nombre,
      especialidad,
      email,
      telefono,
      descripcion,
      eventos,
    });

    const guardado = await nuevo.save();

    // 4) Responder
    return res.status(201).json({
      status: "success",
      message: "Ponente creado correctamente",
      data: guardado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al crear ponente",
      error: err.message,
    });
  }
};

/** Listar ponentes */
const listarPonentes = async (req, res) => {
  try {
    const items = await Ponente().find().populate("eventos");

    return res.status(200).json({
      status: "success",
      message: "Ponentes obtenidos correctamente",
      data: items,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al listar ponentes",
      error: err.message,
    });
  }
};

/** Obtener ponente por ID */
const obtenerPonente = async (req, res) => {
  try {
    const { id } = req.params;

    // 1) Validar ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID inválido",
      });
    }

    // 2) Buscar ponente
    const doc = await Ponente().findById(id).populate("eventos");

    // 3) No encontrado
    if (!doc) {
      return res.status(404).json({
        status: "error",
        message: "Ponente no encontrado",
      });
    }

    // 4) OK
    return res.status(200).json({
      status: "success",
      message: "Ponente encontrado",
      data: doc,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener ponente",
      error: err.message,
    });
  }
};

/** Actualizar ponente */
const actualizarPonente = async (req, res) => {
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
    const { nombre, especialidad, email, telefono, descripcion, eventos } = req.body;

    // 3) Validar que haya al menos un campo
    if (!nombre && !especialidad && !email && !telefono && !descripcion && !eventos) {
      return res.status(400).json({
        status: "error",
        message: "Debe proporcionar al menos un campo para actualizar",
      });
    }

    // 4) Armar objeto a actualizar
    const datosActualizar = {};
    if (nombre) datosActualizar.nombre = nombre;
    if (especialidad) datosActualizar.especialidad = especialidad;
    if (email) datosActualizar.email = email;
    if (telefono) datosActualizar.telefono = telefono;
    if (descripcion) datosActualizar.descripcion = descripcion;
    if (eventos) datosActualizar.eventos = eventos;

    // 5) Actualizar en BD
    const actualizado = await Ponente().findByIdAndUpdate(id, datosActualizar, {
      new: true,
      runValidators: true,
      context: "query",
    });

    // 6) No encontrado
    if (!actualizado) {
      return res.status(404).json({
        status: "error",
        message: "Ponente no encontrado",
      });
    }

    // 7) OK
    return res.status(200).json({
      status: "success",
      message: "Ponente actualizado correctamente",
      data: actualizado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar ponente",
      error: err.message,
    });
  }
};

/** Eliminar ponente */
const eliminarPonente = async (req, res) => {
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
    const eliminado = await Ponente().findByIdAndDelete(id).lean();

    // 3) No encontrado
    if (!eliminado) {
      return res.status(404).json({
        status: "error",
        message: "Ponente no encontrado",
      });
    }

    // 4) OK
    return res.status(200).json({
      status: "success",
      message: "Ponente eliminado correctamente",
      data: eliminado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar ponente",
      error: err.message,
    });
  }
};

module.exports = {
  crearPonente,
  listarPonentes,
  obtenerPonente,
  actualizarPonente,
  eliminarPonente,
};
