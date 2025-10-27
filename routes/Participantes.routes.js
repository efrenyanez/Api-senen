// routes/participantes.routes.js
const express = require("express");
const router = express.Router();

// Importar controlador
const ParticipantesController = require("../controller/Participantes.controller");

// Rutas RESTful 
router.post("/", ParticipantesController.crearParticipante);
router.get("/", ParticipantesController.listarParticipantes);
router.get("/:id", ParticipantesController.obtenerParticipante);
router.patch("/:id", ParticipantesController.actualizarParticipante);
router.delete("/:id", ParticipantesController.eliminarParticipante);

module.exports = router;
