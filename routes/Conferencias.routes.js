// routes/conferencias.routes.js
const express = require("express");
const router = express.Router();

// Importar controlador
const ConferenciaController = require("../controller/Conferencias.controller");

// Rutas RESTful
router.post("/", ConferenciaController.crearConferencia);
router.get("/", ConferenciaController.listarConferencias);
router.get("/:id", ConferenciaController.obtenerConferencia);
router.patch("/:id", ConferenciaController.actualizarConferencia);
router.delete("/:id", ConferenciaController.eliminarConferencia);

module.exports = router;
