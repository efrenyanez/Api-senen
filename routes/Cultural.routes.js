// routes/culturales.routes.js
const express = require("express");
const router = express.Router();

// Importar controlador
const CulturalController = require("../controller/Cultural.controller");

// Rutas RESTful 
router.post("/", CulturalController.crearCultural);
router.get("/", CulturalController.listarCulturales);
router.get("/:id", CulturalController.obtenerCultural);
router.patch("/:id", CulturalController.actualizarCultural);
router.delete("/:id", CulturalController.eliminarCultural);

module.exports = router;
