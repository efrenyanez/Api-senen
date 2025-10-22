// 1.- importar express

const express = require("express");

// 2.- Crear router

const router = express.Router();

// 3.- Cargar el controlador

const ConferenciaController = require("../controller/Conferencias.controller");

// 4.- Definir rutas

router.post("/guardarConferencia", ConferenciaController.guardarConferencia);
router.get("/listarConferencia", ConferenciaController.listarConferencias);
router.get("/buscarConferencia/:id", ConferenciaController.obtenerConferenciaPorId);
router.delete("/eliminarConferencia/:id", ConferenciaController.eliminarConferencia);
router.patch("/actualizarConferencia/:id", ConferenciaController.actualizarConferencia);

// 5.- Exportar rutas

module.exports = router;