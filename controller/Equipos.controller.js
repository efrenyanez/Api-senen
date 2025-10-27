const mongoose = require("mongoose");
const EquiposModel = require("../models/equipos.model");

// Registrar modelos relacionados para populate
try { require('../models/participantes.model').getModel(); } catch(e) { /* ignore */ }
try { require('../models/evento.model').getModel(); } catch(e) { /* ignore */ }

const Equipo = () => EquiposModel.getModel();

/** Crear equipo */
const crearEquipo = async (req, res) => {
  try {
    // 1) Recibir datos
    const { nombre, pais, integrantes, eventos, descripcion } = req.body;

    // 2) Validar obligatorios
    if (!nombre) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios: nombre",
      });
    }

    // 3) Crear y guardar
    const nuevo = new (Equipo())({
      nombre,
      pais,
      integrantes,
      eventos,
      descripcion,
    });

    const guardado = await nuevo.save();

    // 4) Responder
    return res.status(201).json({
      status: "success",
      message: "Equipo guardado correctamente",
      data: guardado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al crear equipo",
      error: err.message,
    });
  }
};

/** Listar equipos */
const listarEquipos = async (req, res) => {
  try {
    const items = await Equipo().find().populate("integrantes").populate("eventos");
    return res.status(200).json({
      status: "success",
      message: "Equipos obtenidos correctamente",
      data: items,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al listar equipos",
      error: err.message,
    });
  }
};

/** Obtener equipo por ID */
const obtenerEquipo = async (req, res) => {
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
    const equipo = await Equipo().findById(id).populate("integrantes").populate("eventos");

    // 3) No encontrado
    if (!equipo) {
      return res.status(404).json({
        status: "error",
        message: "Equipo no encontrado",
      });
    }

    // 4) OK
    return res.status(200).json({
      status: "success",
      message: "Equipo encontrado correctamente",
      data: equipo,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener equipo",
      error: err.message,
    });
  }
};

/** Eliminar equipo */
const eliminarEquipo = async (req, res) => {
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
    const eliminado = await Equipo().findByIdAndDelete(id).lean();

    // 3) No encontrado
    if (!eliminado) {
      return res.status(404).json({
        status: "error",
        message: "Equipo no encontrado",
      });
    }

    // 4) OK
    return res.status(200).json({
      status: "success",
      message: "Equipo eliminado correctamente",
      data: eliminado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar equipo",
      error: err.message,
    });
  }
};

/** Actualizar equipo */
const actualizarEquipo = async (req, res) => {
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
    const { nombre, pais, integrantes, eventos, descripcion } = req.body;

    // 3) Validar al menos un campo
    if (!nombre && !pais && !integrantes && !eventos && !descripcion) {
      return res.status(400).json({
        status: "error",
        message: "Debe proporcionar al menos un campo para actualizar",
      });
    }

    // 4) Armar objeto
    const datosActualizar = {};
    if (nombre) datosActualizar.nombre = nombre;
    if (pais) datosActualizar.pais = pais;
    if (integrantes) datosActualizar.integrantes = integrantes;
    if (eventos) datosActualizar.eventos = eventos;
    if (descripcion) datosActualizar.descripcion = descripcion;

    // 5) Actualizar
    const actualizado = await Equipo().findByIdAndUpdate(id, datosActualizar, {
      new: true,
      runValidators: true,
      context: "query",
    });

    // 6) No encontrado
    if (!actualizado) {
      return res.status(404).json({
        status: "error",
        message: "Equipo no encontrado",
      });
    }

    // 7) OK
    return res.status(200).json({
      status: "success",
      message: "Equipo actualizado correctamente",
      data: actualizado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar equipo",
      error: err.message,
    });
  }
};

module.exports = {
  crearEquipo,
  listarEquipos,
  obtenerEquipo,
  eliminarEquipo,
  actualizarEquipo,
};
