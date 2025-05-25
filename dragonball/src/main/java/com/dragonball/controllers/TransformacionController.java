package com.dragonball.controllers;

import com.dragonball.models.Transformacion;
import com.dragonball.services.DragonBallService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/transformaciones")
public class TransformacionController {

    @Autowired
    private DragonBallService service;

    @GetMapping
    public ResponseEntity<?> buscarTransformaciones(
            @RequestParam(required = false, defaultValue = "") String nombre) {
        try {
            List<Transformacion> transformaciones = service.buscarTransformaciones(nombre);
            return ResponseEntity.ok(transformaciones);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al buscar transformaciones: " + e.getMessage());
        }
    }

    @GetMapping("/todas")
    public ResponseEntity<?> obtenerTodasTransformaciones() {
        try {
            List<Transformacion> transformaciones = service.obtenerTodasTransformaciones();
            return ResponseEntity.ok(transformaciones);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener todas las transformaciones: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerTransformacionPorId(@PathVariable Long id) {
        try {
            Transformacion transformacion = service.obtenerTransformacionPorId(id);
            if (transformacion != null) {
                return ResponseEntity.ok(transformacion);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No se encontró la transformación con ID: " + id);
            }
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener la transformación: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> crearTransformacion(@RequestBody Transformacion transformacion) {
        try {
            Transformacion nuevaTransformacion = service.crearTransformacion(transformacion);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaTransformacion);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear la transformación: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarTransformacion(@PathVariable Long id, @RequestBody Transformacion transformacion) {
        try {
            transformacion.setId(id);
            Transformacion transformacionActualizada = service.actualizarTransformacion(transformacion);
            return ResponseEntity.ok(transformacionActualizada);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar la transformación: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarTransformacion(@PathVariable Long id) {
        try {
            service.eliminarTransformacion(id);
            return ResponseEntity.ok("Transformación eliminada correctamente");
        } catch (SQLException e) {
            System.err.println("Error al eliminar transformación con ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar la transformación: " + e.getMessage());
        }
    }
}