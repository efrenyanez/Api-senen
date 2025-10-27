// routes/grupos.routes.js
const express = require("express");
const router = express.Router();

// Importar controlador
const GruposController = require("../controller/Grupo.controller");

// Rutas RESTful 
router.post("/", GruposController.crearGrupo);
router.get("/", GruposController.listarGrupos);
router.get("/:id", GruposController.obtenerGrupo);
router.patch("/:id", GruposController.actualizarGrupo);
router.delete("/:id", GruposController.eliminarGrupo);

module.exports = router;
