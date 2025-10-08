// 1.- importar express

const express = require("express");

// 2.- Crear router

const router = express.Router();

// 3.- Cargar el controlador

const ParticipantesController = require("../controller/Participantes.controller");

// 4.- Definir rutas

router.post("/guardarParticipantes", ParticipantesController.guardar);
router.get("/listarParticipantes", ParticipantesController.ListarTodos);
router.get("/buscarParticipantes/:id", ParticipantesController.PlatillosPorId);
router.delete("/eliminarParticipantes/:id", ParticipantesController.eliminarPlatillos);
router.patch("/actualizarParticipantes/:id", ParticipantesController.actualizarPlatillos);

// 5.- Exportar rutas

module.exports = router;