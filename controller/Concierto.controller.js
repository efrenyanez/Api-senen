const mongoose = require("mongoose");
const ConciertosModel = require("../models/conciertos.model");

// Registrar modelos relacionados para que populate los encuentre en la conexión
try { require('../models/grupo.model').getModel(); } catch(e) { /* ignore */ }
try { require('../models/participantes.model').getModel(); } catch(e) { /* ignore */ }

const Concierto = () => ConciertosModel.getModel();
//Crear Concierto
const crearConcierto = async (req, res) => {
  try {
    // 1) Recibir datos
    const {
      nombre,
      artistaPrincipal,
      artistasInvitados,
      descripcion,
      generoMusical,
      fecha,
      horaInicio,
      horaFin,
      lugar,
      direccion,
      ciudad,
      estado,
      pais,
      precioMinimo,
      precioMaximo,
      moneda,
      boletosDisponibles,
      enlaceDeCompra,
      imagenPrincipal,
      galeriaDeImagenes,
      videoPromocional,
      organizador,
      contactoOrganizador,
      patrocinadores,
      redesSociales,
      grupos,
      participantes,
    } = req.body;

    // 2) Validar obligatorios (como en productos)
    if (
      !nombre ||
      !artistaPrincipal ||
      !generoMusical ||
      !fecha ||
      !horaInicio ||
      !horaFin ||
      !lugar ||
      !direccion ||
      !ciudad ||
      !pais ||
      precioMinimo === undefined ||
      precioMaximo === undefined ||
      !moneda ||
      boletosDisponibles === undefined ||
      !organizador
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Faltan campos obligatorios: nombre, artistaPrincipal, generoMusical, fecha, horaInicio, horaFin, lugar, direccion, ciudad, pais, precioMinimo, precioMaximo, moneda, boletosDisponibles, organizador",
      });
    }

    // 3) Crear objeto y guardar
    const nuevo = new (Concierto())({
      nombre,
      artistaPrincipal,
      artistasInvitados,
      descripcion,
      generoMusical,
      fecha,
      horaInicio,
      horaFin,
      lugar,
      direccion,
      ciudad,
      estado,
      pais,
      precioMinimo,
      precioMaximo,
      moneda,
      boletosDisponibles,
      enlaceDeCompra,
      imagenPrincipal,
      galeriaDeImagenes,
      videoPromocional,
      organizador,
      contactoOrganizador,
      patrocinadores,
      redesSociales,
      grupos,
      participantes,
    });

    const guardado = await nuevo.save();

    // 4) Responder
    return res.status(201).json({
      status: "success",
      message: "Concierto guardado correctamente",
      data: guardado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
      error: err.message,
    });
  }
};

//Listar Conciertos
const listarConciertos = async (req, res) => {
  try {
    // activa populate si tus refs están en la misma conexión
    const conciertos = await Concierto().find().populate("grupos");
    return res.status(200).json({
      status: "success",
      message: "Conciertos obtenidos",
      data: conciertos,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al listar conciertos",
      error: err.message,
    });
  }
};

// Obtener por ID
const obtenerConcierto = async (req, res) => {
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
    const concierto = await Concierto().findById(id).populate("grupos");

    // 3) Si no existe
    if (!concierto) {
      return res.status(404).json({
        status: "error",
        message: "Concierto no encontrado",
      });
    }

    // 4) Ok
    return res.status(200).json({
      status: "success",
      message: "Concierto encontrado",
      data: concierto,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener concierto",
      error: err.message,
    });
  }
};

// Eliminar
const eliminarConcierto = async (req, res) => {
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
    const eliminado = await Concierto().findByIdAndDelete(id).lean();

    // 3) Si no existe
    if (!eliminado) {
      return res.status(404).json({
        status: "error",
        message: "Concierto no encontrado",
      });
    }

    // 4) Ok
    return res.status(200).json({
      status: "success",
      message: "Concierto eliminado correctamente",
      data: eliminado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar concierto",
      error: err.message,
    });
  }
};

// Actualizar
const actualizarConcierto = async (req, res) => {
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
    const {
      nombre,
      artistaPrincipal,
      artistasInvitados,
      descripcion,
      generoMusical,
      fecha,
      horaInicio,
      horaFin,
      lugar,
      direccion,
      ciudad,
      estado,
      pais,
      precioMinimo,
      precioMaximo,
      moneda,
      boletosDisponibles,
      enlaceDeCompra,
      imagenPrincipal,
      galeriaDeImagenes,
      videoPromocional,
      organizador,
      contactoOrganizador,
      patrocinadores,
      redesSociales,
      grupos,
      participantes,
    } = req.body;

    // 3) Validar que venga al menos un campo
    if (
      !nombre &&
      !artistaPrincipal &&
      !artistasInvitados &&
      !descripcion &&
      !generoMusical &&
      !fecha &&
      !horaInicio &&
      !horaFin &&
      !lugar &&
      !direccion &&
      !ciudad &&
      !estado &&
      !pais &&
      precioMinimo === undefined &&
      precioMaximo === undefined &&
      !moneda &&
      boletosDisponibles === undefined &&
      !enlaceDeCompra &&
      !imagenPrincipal &&
      !galeriaDeImagenes &&
      !videoPromocional &&
      !organizador &&
      !contactoOrganizador &&
      !patrocinadores &&
      !redesSociales &&
      !grupos &&
      !participantes
    ) {
      return res.status(400).json({
        status: "error",
        message: "Debe proporcionar al menos un campo para actualizar",
      });
    }

    // 4) Armar objeto solo con lo que viene
    const datosActualizar = {};
    if (nombre) datosActualizar.nombre = nombre;
    if (artistaPrincipal) datosActualizar.artistaPrincipal = artistaPrincipal;
    if (artistasInvitados) datosActualizar.artistasInvitados = artistasInvitados;
    if (descripcion) datosActualizar.descripcion = descripcion;
    if (generoMusical) datosActualizar.generoMusical = generoMusical;
    if (fecha) datosActualizar.fecha = fecha;
    if (horaInicio) datosActualizar.horaInicio = horaInicio;
    if (horaFin) datosActualizar.horaFin = horaFin;
    if (lugar) datosActualizar.lugar = lugar;
    if (direccion) datosActualizar.direccion = direccion;
    if (ciudad) datosActualizar.ciudad = ciudad;
    if (estado) datosActualizar.estado = estado;
    if (pais) datosActualizar.pais = pais;
    if (precioMinimo !== undefined) datosActualizar.precioMinimo = precioMinimo;
    if (precioMaximo !== undefined) datosActualizar.precioMaximo = precioMaximo;
    if (moneda) datosActualizar.moneda = moneda;
    if (boletosDisponibles !== undefined) datosActualizar.boletosDisponibles = boletosDisponibles;
    if (enlaceDeCompra) datosActualizar.enlaceDeCompra = enlaceDeCompra;
    if (imagenPrincipal) datosActualizar.imagenPrincipal = imagenPrincipal;
    if (galeriaDeImagenes) datosActualizar.galeriaDeImagenes = galeriaDeImagenes;
    if (videoPromocional) datosActualizar.videoPromocional = videoPromocional;
    if (organizador) datosActualizar.organizador = organizador;
    if (contactoOrganizador) datosActualizar.contactoOrganizador = contactoOrganizador;
    if (patrocinadores) datosActualizar.patrocinadores = patrocinadores;
    if (redesSociales) datosActualizar.redesSociales = redesSociales;
    if (grupos) datosActualizar.grupos = grupos;
    if (participantes) datosActualizar.participantes = participantes;

    // 5) Actualizar
    const actualizado = await Concierto().findByIdAndUpdate(id, datosActualizar, {
      new: true,
      runValidators: true,
      context: "query",
    });

    // 6) Si no existe
    if (!actualizado) {
      return res.status(404).json({
        status: "error",
        message: "Concierto no encontrado",
      });
    }

    // 7) Ok
    return res.status(200).json({
      status: "success",
      message: "Concierto actualizado correctamente",
      data: actualizado,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error al actualizar concierto",
      error: err.message,
    });
  }
};

module.exports = {
  crearConcierto,
  listarConciertos,
  obtenerConcierto,
  eliminarConcierto,
  actualizarConcierto,
};
