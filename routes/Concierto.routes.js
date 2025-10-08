// 1.- importar express

const express = require("express");

// 2.- Crear router

const router = express.Router();

// 3.- Cargar el controlador

const ConciertoController = require("../controller/Concierto.controller");

// 4.- Definir rutas

router.post("/guardarConcierto", ConciertoController.guardar);
router.get("/listarConcierto", ConciertoController.ListarTodos);
router.get("/buscarConcierto/:id", ConciertoController.PlatillosPorId);
router.delete("/eliminarConcierto/:id", ConciertoController.eliminarPlatillos);
router.patch("/actualizarConcierto/:id", ConciertoController.actualizarPlatillos);
// 5.- Exportar rutas

module.exports = router;