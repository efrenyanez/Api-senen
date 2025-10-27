const mongoose = require("mongoose");
const ParticipantesModel = require("../models/participantes.model");

// Register related models for populate
try { require('../models/equipos.model').getModel(); } catch(e) { /* ignore */ }
try { require('../models/evento.model').getModel(); } catch(e) { /* ignore */ }

const Participante = () => ParticipantesModel.getModel();

/** Crear participante */
const crearParticipante = async (req, res) => {
  try {
    // 1) Recibir datos
    const { nombre, apellido, email, telefono, tipo, equipo, eventos } = req.body;

    // 2) Validar obligatorios (ajusta si también quieres exigir apellido)
    if (!nombre) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios: nombre",
      });
    }

    // 3) Crear y guardar
    const nuevo = new (Participante())({
      nombre,
      apellido,
      email,
      telefono,
      tipo,       // "asistente" | "organizador" | "ponente" | "jugador" (según tu schema)
      equipo,     // ObjectId de Equipos
      eventos,    // [ObjectId] de Eventos
    });

    const guardado = await nuevo.save();

    // 4) Responder
    return res.status(201).json({
      status: "success",
      message: "Participante guardado correctamente",
      data: guardado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al crear participante",
      error: err.message,
    });
  }
};

/** Listar participantes */
const listarParticipantes = async (req, res) => {
  try {
    const items = await Participante()
      .find()
      .populate("equipo")
      .populate("eventos");

    return res.status(200).json({
      status: "success",
      message: "Participantes obtenidos correctamente",
      data: items,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al listar participantes",
      error: err.message,
    });
  }
};

/** Obtener participante por ID */
const obtenerParticipante = async (req, res) => {
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
    const doc = await Participante()
      .findById(id)
      .populate("equipo")
      .populate("eventos");

    // 3) No encontrado
    if (!doc) {
      return res.status(404).json({
        status: "error",
        message: "Participante no encontrado",
      });
    }

    // 4) OK
    return res.status(200).json({
      status: "success",
      message: "Participante encontrado",
      data: doc,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener participante",
      error: err.message,
    });
  }
};

/** Eliminar participante por ID */
const eliminarParticipante = async (req, res) => {
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
    const eliminado = await Participante().findByIdAndDelete(id).lean();

    // 3) No encontrado
    if (!eliminado) {
      return res.status(404).json({
        status: "error",
        message: "Participante no encontrado",
      });
    }

    // 4) OK
    return res.status(200).json({
      status: "success",
      message: "Participante eliminado correctamente",
      data: eliminado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar participante",
      error: err.message,
    });
  }
};

/** Actualizar participante (parcial) */
const actualizarParticipante = async (req, res) => {
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
    const { nombre, apellido, email, telefono, tipo, equipo, eventos } = req.body;

    // 3) Validar que venga al menos un campo
    if (!nombre && !apellido && !email && !telefono && !tipo && !equipo && !eventos) {
      return res.status(400).json({
        status: "error",
        message: "Debe proporcionar al menos un campo para actualizar",
      });
    }

    // 4) Armar objeto de actualización
    const datosActualizar = {};
    if (nombre) datosActualizar.nombre = nombre;
    if (apellido) datosActualizar.apellido = apellido;
    if (email) datosActualizar.email = email;
    if (telefono) datosActualizar.telefono = telefono;
    if (tipo) datosActualizar.tipo = tipo;
    if (equipo) datosActualizar.equipo = equipo;
    if (eventos) datosActualizar.eventos = eventos;

    // 5) Actualizar
    const actualizado = await Participante().findByIdAndUpdate(id, datosActualizar, {
      new: true,
      runValidators: true,
      context: "query",
    });

    // 6) No encontrado
    if (!actualizado) {
      return res.status(404).json({
        status: "error",
        message: "Participante no encontrado",
      });
    }

    // 7) OK
    return res.status(200).json({
      status: "success",
      message: "Participante actualizado correctamente",
      data: actualizado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar participante",
      error: err.message,
    });
  }
};

module.exports = {
  crearParticipante,
  listarParticipantes,
  obtenerParticipante,
  actualizarParticipante,
  eliminarParticipante,
};
