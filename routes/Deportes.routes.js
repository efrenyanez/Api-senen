// 1.- importar express

const express = require("express");

// 2.- Crear router

const router = express.Router();

// 3.- Cargar el controlador

const DeportesController = require("../controller/Deportes.controller");

// 4.- Definir rutas

router.post("/guardarDeportes", DeportesController.guardarDeporte);
router.get("/listarDeportes", DeportesController.listarDeportes);
router.get("/buscarDeportes/:id", DeportesController.obtenerDeportePorId);
router.delete("/eliminarDeportes/:id", DeportesController.eliminarDeporte);
router.patch("/actualizarDeportes/:id", DeportesController.actualizarDeporte);

// 5.- Exportar rutas

module.exports = router;