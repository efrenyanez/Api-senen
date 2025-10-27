const mongoose = require("mongoose");
const GrupoModel = require("../models/grupo.model");

// Register related models for populate
try { require('../models/participantes.model').getModel(); } catch(e) { /* ignore */ }
try { require('../models/evento.model').getModel(); } catch(e) { /* ignore */ }

const Grupo = () => GrupoModel.getModel();

/** Crear grupo */
const crearGrupo = async (req, res) => {
  try {
    // 1) Recibir datos (soporta 'miembros' pero lo normaliza a 'integrantes')
    let { nombre, genero, integrantes, miembros, eventos } = req.body;

    // Normalizar 'miembros' -> 'integrantes' si viene
    if (!integrantes && Array.isArray(miembros)) integrantes = miembros;

    // 2) Validar obligatorios
    if (!nombre) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios: nombre",
      });
    }

    // 3) Crear y guardar
    const nuevo = new (Grupo())({
      nombre,
      genero,
      integrantes,
      eventos,
    });

    const guardado = await nuevo.save();

    // 4) Responder
    return res.status(201).json({
      status: "success",
      message: "Grupo guardado correctamente",
      data: guardado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al crear grupo",
      error: err.message,
    });
  }
};

/** Listar grupos */
const listarGrupos = async (req, res) => {
  try {
    const items = await Grupo()
      .find()
      .populate("integrantes")
      .populate("eventos");

    return res.status(200).json({
      status: "success",
      message: "Grupos obtenidos correctamente",
      data: items,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al listar grupos",
      error: err.message,
    });
  }
};

/** Obtener grupo por ID */
const obtenerGrupo = async (req, res) => {
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
    const doc = await Grupo()
      .findById(id)
      .populate("integrantes")
      .populate("eventos");

    // 3) No encontrado
    if (!doc) {
      return res.status(404).json({
        status: "error",
        message: "Grupo no encontrado",
      });
    }

    // 4) OK
    return res.status(200).json({
      status: "success",
      message: "Grupo encontrado",
      data: doc,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener grupo",
      error: err.message,
    });
  }
};

/** Eliminar grupo por ID */
const eliminarGrupo = async (req, res) => {
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
    const eliminado = await Grupo().findByIdAndDelete(id).lean();

    // 3) No encontrado
    if (!eliminado) {
      return res.status(404).json({
        status: "error",
        message: "Grupo no encontrado",
      });
    }

    // 4) OK
    return res.status(200).json({
      status: "success",
      message: "Grupo eliminado correctamente",
      data: eliminado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar grupo",
      error: err.message,
    });
  }
};

/** Actualizar grupo por ID (parcial) */
const actualizarGrupo = async (req, res) => {
  try {
    const { id } = req.params;

    // 1) Validar ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID inválido",
      });
    }

    // 2) Recibir datos (normalizar 'miembros' -> 'integrantes')
    let { nombre, genero, integrantes, miembros, eventos } = req.body;
    if (!integrantes && Array.isArray(miembros)) integrantes = miembros;

    // 3) Validar al menos un campo
    if (!nombre && !genero && !integrantes && !eventos) {
      return res.status(400).json({
        status: "error",
        message: "Debe proporcionar al menos un campo para actualizar",
      });
    }

    // 4) Armar objeto de actualización
    const datosActualizar = {};
    if (nombre) datosActualizar.nombre = nombre;
    if (genero) datosActualizar.genero = genero;
    if (integrantes) datosActualizar.integrantes = integrantes;
    if (eventos) datosActualizar.eventos = eventos;

    // 5) Actualizar
    const actualizado = await Grupo().findByIdAndUpdate(id, datosActualizar, {
      new: true,
      runValidators: true,
      context: "query",
    });

    // 6) No encontrado
    if (!actualizado) {
      return res.status(404).json({
        status: "error",
        message: "Grupo no encontrado",
      });
    }

    // 7) OK
    return res.status(200).json({
      status: "success",
      message: "Grupo actualizado correctamente",
      data: actualizado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar grupo",
      error: err.message,
    });
  }
};

module.exports = {
  crearGrupo,
  listarGrupos,
  obtenerGrupo,
  eliminarGrupo,
  actualizarGrupo,
};
