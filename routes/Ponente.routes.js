// 1.- importar express

const express = require("express");

// 2.- Crear router

const router = express.Router();

// 3.- Cargar el controlador

const PonentesController = require("../controller/Ponentes.controller");

// 4.- Definir rutas

router.post("/guardarPonentes", PonentesController.guardarPonente);
router.get("/listarPonentes", PonentesController.listarPonentes);
router.get("/buscarPonentes/:id", PonentesController.obtenerPonentePorId);
router.delete("/eliminarPonentes/:id", PonentesController.eliminarPonente);
router.patch("/actualizarPonentes/:id", PonentesController.actualizarPonente);

// 5.- Exportar rutas

module.exports = router;