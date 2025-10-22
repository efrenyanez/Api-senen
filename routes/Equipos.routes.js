// 1.- importar express

const express = require('express');

// 2.- Crear router

const router = express.Router();

// 3.- Cargar el controlador

const EquiposController = require('../controller/Equipos.controller');

// 4.- Definir rutas

router.post('/guardarEquipos', EquiposController.guardarEquipo);
router.get('/listarEquipos', EquiposController.listarEquipos);
router.get('/buscarEquipos/:id', EquiposController.obtenerEquipoPorId);
router.delete('/eliminarEquipos/:id', EquiposController.eliminarEquipo);
router.patch('/actualizarEquipos/:id', EquiposController.actualizarEquipo);

// 5.- Exportar rutas

module.exports = router;
