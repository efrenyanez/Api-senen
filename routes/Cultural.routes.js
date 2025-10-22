// 1.- importar express

const express = require("express");

// 2.- Crear router

const router = express.Router();

// 3.- Cargar el controlador

const CulturalController = require("../controller/Cultural.controller");

// 4.- Definir rutas

router.post("/guardarCultural", CulturalController.guardarCultural);
router.get("/listarCultural", CulturalController.listarCulturales);
router.get("/buscarCultural/:id", CulturalController.obtenerCulturalPorId);
router.delete("/eliminarCultural/:id", CulturalController.eliminarCultural);
router.patch("/actualizarCultural/:id", CulturalController.actualizarCultural);

// 5.- Exportar rutas

module.exports = router;