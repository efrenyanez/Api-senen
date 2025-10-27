const mongoose = require("mongoose");
const DeportesModel = require("../models/deportes.model");

// Register related models for populate
try { require('../models/equipos.model').getModel(); } catch(e) { /* ignore */ }
try { require('../models/participantes.model').getModel(); } catch(e) { /* ignore */ }

const Deporte = () => DeportesModel.getModel();

/** Crear evento deportivo */
const crearDeporte = async (req, res) => {
  try {
    // 1) Recibir datos
    const { nombre, tipo, fecha, equipos, participantes } = req.body;

    // 2) Validar obligatorios
    if (!nombre) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios: nombre",
      });
    }

    // 3) Crear y guardar
    const nuevo = new (Deporte())({
      nombre,
      tipo,
      fecha,
      equipos,
      participantes,
    });

    const guardado = await nuevo.save();

    // 4) Responder
    return res.status(201).json({
      status: "success",
      message: "Evento deportivo guardado correctamente",
      data: guardado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al crear evento deportivo",
      error: err.message,
    });
  }
};

/** Listar eventos deportivos */
const listarDeportes = async (req, res) => {
  try {
    const items = await Deporte()
      .find()
      .populate("equipos")
      .populate("participantes");

    return res.status(200).json({
      status: "success",
      message: "Eventos deportivos obtenidos",
      data: items,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al listar eventos deportivos",
      error: err.message,
    });
  }
};

/** Obtener evento deportivo por ID */
const obtenerDeporte = async (req, res) => {
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
    const doc = await Deporte()
      .findById(id)
      .populate("equipos")
      .populate("participantes");

    // 3) No encontrado
    if (!doc) {
      return res.status(404).json({
        status: "error",
        message: "Evento deportivo no encontrado",
      });
    }

    // 4) OK
    return res.status(200).json({
      status: "success",
      message: "Evento deportivo encontrado",
      data: doc,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener evento deportivo",
      error: err.message,
    });
  }
};

/** Eliminar evento deportivo por ID */
const eliminarDeporte = async (req, res) => {
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
    const eliminado = await Deporte().findByIdAndDelete(id).lean();

    // 3) No encontrado
    if (!eliminado) {
      return res.status(404).json({
        status: "error",
        message: "Evento deportivo no encontrado",
      });
    }

    // 4) OK
    return res.status(200).json({
      status: "success",
      message: "Evento deportivo eliminado correctamente",
      data: eliminado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar evento deportivo",
      error: err.message,
    });
  }
};

/** Actualizar evento deportivo por ID (parcial) */
const actualizarDeporte = async (req, res) => {
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
    const { nombre, tipo, fecha, equipos, participantes } = req.body;

    // 3) Validar que venga al menos un campo
    if (!nombre && !tipo && !fecha && !equipos && !participantes) {
      return res.status(400).json({
        status: "error",
        message: "Debe proporcionar al menos un campo para actualizar",
      });
    }

    // 4) Armar objeto de actualización
    const datosActualizar = {};
    if (nombre) datosActualizar.nombre = nombre;
    if (tipo) datosActualizar.tipo = tipo;
    if (fecha) datosActualizar.fecha = fecha;
    if (equipos) datosActualizar.equipos = equipos;
    if (participantes) datosActualizar.participantes = participantes;

    // 5) Actualizar
    const actualizado = await Deporte().findByIdAndUpdate(id, datosActualizar, {
      new: true,
      runValidators: true,
      context: "query",
    });

    // 6) No encontrado
    if (!actualizado) {
      return res.status(404).json({
        status: "error",
        message: "Evento deportivo no encontrado",
      });
    }

    // 7) OK
    return res.status(200).json({
      status: "success",
      message: "Evento deportivo actualizado correctamente",
      data: actualizado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar evento deportivo",
      error: err.message,
    });
  }
};

module.exports = {
  crearDeporte,
  listarDeportes,
  obtenerDeporte,
  eliminarDeporte,
  actualizarDeporte,
};
