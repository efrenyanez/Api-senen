// 1.- importar express

const express = require("express");

// 2.- Crear router

const router = express.Router();

// 3.- Cargar el controlador

const ConciertoController = require("../controller/Concierto.controller");

// 4.- Definir rutas

router.post("/guardarConcierto", ConciertoController.guardarConcierto);
router.get("/listarConcierto", ConciertoController.listarConciertos);
router.get("/buscarConcierto/:id", ConciertoController.obtenerConciertoPorId);
router.delete("/eliminarConcierto/:id", ConciertoController.eliminarConcierto);
router.patch("/actualizarConcierto/:id", ConciertoController.actualizarConcierto);
// 5.- Exportar rutas

module.exports = router;