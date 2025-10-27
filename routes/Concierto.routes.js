// routes/conciertos.routes.js
const express = require("express");
const router = express.Router();

// Importar controlador
const ConciertoController = require("../controller/Concierto.controller");

// Rutas RESTful
router.post("/", ConciertoController.crearConcierto);
router.get("/", ConciertoController.listarConciertos);
router.get("/:id", ConciertoController.obtenerConcierto);
router.patch("/:id", ConciertoController.actualizarConcierto);
router.delete("/:id", ConciertoController.eliminarConcierto);

module.exports = router;
