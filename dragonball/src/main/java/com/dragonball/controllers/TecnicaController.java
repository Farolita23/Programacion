package com.dragonball.controllers;

import com.dragonball.models.Tecnica;
import com.dragonball.services.DragonBallService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/tecnicas")
public class TecnicaController {

    @Autowired
    private DragonBallService service;

    @GetMapping
    public ResponseEntity<?> buscarTecnicas(
            @RequestParam(required = false, defaultValue = "") String nombre) {
        try {
            List<Tecnica> tecnicas = service.buscarTecnicas(nombre);
            return ResponseEntity.ok(tecnicas);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al buscar técnicas: " + e.getMessage());
        }
    }

    @GetMapping("/todas")
    public ResponseEntity<?> obtenerTodasTecnicas() {
        try {
            List<Tecnica> tecnicas = service.obtenerTodasTecnicas();
            return ResponseEntity.ok(tecnicas);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener todas las técnicas: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerTecnicaPorId(@PathVariable Long id) {
        try {
            Tecnica tecnica = service.obtenerTecnicaPorId(id);
            if (tecnica != null) {
                return ResponseEntity.ok(tecnica);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No se encontró la técnica con ID: " + id);
            }
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener la técnica: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> crearTecnica(@RequestBody Tecnica tecnica) {
        try {
            Tecnica nuevaTecnica = service.crearTecnica(tecnica);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaTecnica);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear la técnica: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarTecnica(@PathVariable Long id, @RequestBody Tecnica tecnica) {
        try {
            tecnica.setId(id);
            Tecnica tecnicaActualizada = service.actualizarTecnica(tecnica);
            return ResponseEntity.ok(tecnicaActualizada);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar la técnica: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarTecnica(@PathVariable Long id) {
        try {
            service.eliminarTecnica(id);
            return ResponseEntity.ok("Técnica eliminada correctamente");
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar la técnica: " + e.getMessage());
        }
    }
}