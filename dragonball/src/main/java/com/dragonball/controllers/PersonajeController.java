package com.dragonball.controllers;

import com.dragonball.models.Personaje;
import com.dragonball.models.Tecnica;
import com.dragonball.models.Transformacion;
import com.dragonball.services.DragonBallService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/personajes")
public class PersonajeController {

    @Autowired
    private DragonBallService service;

    @GetMapping
    public ResponseEntity<?> buscarPersonajes(
            @RequestParam(required = false, defaultValue = "") String nombre,
            @RequestParam(required = false, defaultValue = "") String raza,
            @RequestParam(required = false) Boolean esHeroe) {
        try {
            List<Personaje> personajes = service.buscarPersonajes(nombre, raza, esHeroe);
            return ResponseEntity.ok(personajes);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al buscar personajes: " + e.getMessage());
        }
    }

    @GetMapping("/todos")
    public ResponseEntity<?> obtenerTodosPersonajes() {
        try {
            List<Personaje> personajes = service.obtenerTodosPersonajes();
            return ResponseEntity.ok(personajes);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener todos los personajes: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPersonajePorId(@PathVariable Long id) {
        try {
            Personaje personaje = service.obtenerPersonajePorId(id);
            if (personaje != null) {
                return ResponseEntity.ok(personaje);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No se encontró el personaje con ID: " + id);
            }
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener el personaje: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> crearPersonaje(@RequestBody Personaje personaje) {
        try {
            Personaje nuevoPersonaje = service.crearPersonaje(personaje);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPersonaje);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear el personaje: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarPersonaje(@PathVariable Long id, @RequestBody Personaje personaje) {
        try {
            personaje.setId(id);
            Personaje personajeActualizado = service.actualizarPersonaje(personaje);
            return ResponseEntity.ok(personajeActualizado);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el personaje: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPersonaje(@PathVariable Long id) {
        try {
            service.eliminarPersonaje(id);
            return ResponseEntity.ok("Personaje eliminado correctamente");
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar el personaje: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/transformaciones")
    public ResponseEntity<?> obtenerTransformacionesPorPersonaje(@PathVariable Long id) {
        try {
            List<Transformacion> transformaciones = service.obtenerTransformacionesPorPersonaje(id);
            return ResponseEntity.ok(transformaciones);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener las transformaciones: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/tecnicas")
    public ResponseEntity<?> obtenerTecnicasPorPersonaje(@PathVariable Long id) {
        try {
            List<Tecnica> tecnicas = service.obtenerTecnicasPorPersonaje(id);
            return ResponseEntity.ok(tecnicas);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener las técnicas: " + e.getMessage());
        }
    }
}