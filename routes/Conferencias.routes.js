// 1.- importar express

const express = require("express");

// 2.- Crear router

const router = express.Router();

// 3.- Cargar el controlador

const ConferenciaController = require("../controller/Conferencias.controller");

// 4.- Definir rutas

router.post("/guardarConferencia", ConferenciaController.guardar);
router.get("/listarConferencia", ConferenciaController.ListarTodos);
router.get("/buscarConferencia/:id", ConferenciaController.PlatillosPorId);
router.delete("/eliminarConferencia/:id", ConferenciaController.eliminarPlatillos);
router.patch("/actualizarConferencia/:id", ConferenciaController.actualizarPlatillos);

// 5.- Exportar rutas

module.exports = router;