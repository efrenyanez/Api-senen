// 1.- importar express

const express = require("express");

// 2.- Crear router

const router = express.Router();

// 3.- Cargar el controlador

const CulturalController = require("../controller/Cultural.controller");

// 4.- Definir rutas

router.post("/guardarCultural", CulturalController.guardar);
router.get("/listarCultural", CulturalController.ListarTodos);
router.get("/buscarCultural/:id", CulturalController.PlatillosPorId);
router.delete("/eliminarCultural/:id", CulturalController.eliminarPlatillos);
router.patch("/actualizarCultural/:id", CulturalController.actualizarPlatillos);

// 5.- Exportar rutas

module.exports = router;