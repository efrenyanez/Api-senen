// routes/equipos.routes.js
const express = require("express");
const router = express.Router();

// Importar controlador
const EquiposController = require("../controller/Equipos.controller");

// Rutas RESTful 
router.post("/", EquiposController.crearEquipo);
router.get("/", EquiposController.listarEquipos);
router.get("/:id", EquiposController.obtenerEquipo);
router.patch("/:id", EquiposController.actualizarEquipo);
router.delete("/:id", EquiposController.eliminarEquipo);

module.exports = router;
