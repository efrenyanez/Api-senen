// routes/ponentes.routes.js
const express = require("express");
const router = express.Router();

// Importar controlador
const PonentesController = require("../controller/Ponentes.controller");

// Rutas RESTful 
router.post("/", PonentesController.crearPonente);
router.get("/", PonentesController.listarPonentes);
router.get("/:id", PonentesController.obtenerPonente);
router.patch("/:id", PonentesController.actualizarPonente);
router.delete("/:id", PonentesController.eliminarPonente);

module.exports = router;
