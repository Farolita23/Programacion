package com.dragonball.controllers;

import com.dragonball.models.Personaje;
import com.dragonball.models.Saga;
import com.dragonball.services.DragonBallService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/sagas")
public class SagaController {

    @Autowired
    private DragonBallService service;

    @GetMapping
    public ResponseEntity<?> buscarSagas(
            @RequestParam(required = false, defaultValue = "") String nombre) {
        try {
            List<Saga> sagas = service.buscarSagas(nombre);
            return ResponseEntity.ok(sagas);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al buscar sagas: " + e.getMessage());
        }
    }

    @GetMapping("/todas")
    public ResponseEntity<?> obtenerTodasSagas() {
        try {
            List<Saga> sagas = service.obtenerTodasSagas();
            return ResponseEntity.ok(sagas);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener todas las sagas: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerSagaPorId(@PathVariable Long id) {
        try {
            Saga saga = service.obtenerSagaPorId(id);
            if (saga != null) {
                return ResponseEntity.ok(saga);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No se encontró la saga con ID: " + id);
            }
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener la saga: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> crearSaga(@RequestBody Saga saga) {
        try {
            Saga nuevaSaga = service.crearSaga(saga);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaSaga);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear la saga: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarSaga(@PathVariable Long id, @RequestBody Saga saga) {
        try {
            saga.setId(id);
            Saga sagaActualizada = service.actualizarSaga(saga);
            return ResponseEntity.ok(sagaActualizada);
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar la saga: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarSaga(@PathVariable Long id) {
        try {
            service.eliminarSaga(id);
            return ResponseEntity.ok("Saga eliminada correctamente");
        } catch (SQLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar la saga: " + e.getMessage());
        }
    }
    @GetMapping("/{id}/personajes")
public ResponseEntity<?> obtenerPersonajesPorSaga(@PathVariable Long id) {
    try {
        List<Personaje> personajes = service.obtenerPersonajesPorSaga(id);
        return ResponseEntity.ok(personajes);
    } catch (SQLException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al obtener los personajes: " + e.getMessage());
    }
}

@PostMapping("/{id}/personajes")
public ResponseEntity<?> asignarPersonajesASaga(@PathVariable Long id, @RequestBody List<Long> personajeIds) {
    try {
        service.asignarPersonajesASaga(id, personajeIds);
        return ResponseEntity.ok("Personajes asignados correctamente");
    } catch (SQLException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al asignar personajes: " + e.getMessage());
    }
}
}