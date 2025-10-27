// routes/deportes.routes.js
const express = require("express");
const router = express.Router();

// Importar controlador
const DeportesController = require("../controller/Deportes.controller");

// Rutas RESTful estándar
router.post("/", DeportesController.crearDeporte);
router.get("/", DeportesController.listarDeportes);
router.get("/:id", DeportesController.obtenerDeporte);
router.patch("/:id", DeportesController.actualizarDeporte);
router.delete("/:id", DeportesController.eliminarDeporte);

module.exports = router;
