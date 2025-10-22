// 1.- importar express

const express = require("express");

// 2.- Crear router

const router = express.Router();

// 3.- Cargar el controlador

const ParticipantesController = require("../controller/Participantes.controller");

// 4.- Definir rutas

router.post("/guardarParticipantes", ParticipantesController.guardarParticipante);
router.get("/listarParticipantes", ParticipantesController.listarParticipantes);
router.get("/buscarParticipantes/:id", ParticipantesController.obtenerParticipantePorId);
router.delete("/eliminarParticipantes/:id", ParticipantesController.eliminarParticipante);
router.patch("/actualizarParticipantes/:id", ParticipantesController.actualizarParticipante);

// 5.- Exportar rutas

module.exports = router;