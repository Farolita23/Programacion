package com.clubnautico.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clubnautico.entity.Socio;
import com.clubnautico.service.SocioService;
import com.clubnautico.service.exceptions.SocioException;
import com.clubnautico.service.exceptions.SocioNotFoundException;

@RestController
@RequestMapping("/socios")
public class SocioController {

    @Autowired
    private SocioService socioService;

    // Crear socio
    @PostMapping
    public Socio crear(@RequestBody Socio socio) {
        return socioService.create(socio);
    }

    // Obtener todos los socios
    @GetMapping
    public ResponseEntity<List<Socio>> list() {
		return ResponseEntity.status(HttpStatus.OK).body(this.socioService.findAll());
	}
    
 // Buscar por nombre y apellidos
    @GetMapping("/buscar")
    public ResponseEntity<List<Socio>> buscarPorNombreApellido(
            @RequestParam String nombre,
            @RequestParam String apellidos) {
        List<Socio> socios = socioService.findByNombreApellido(nombre, apellidos);
        return ResponseEntity.ok(socios);
    }

    // Buscar por DNI
    @GetMapping("/dni/{dni}")
    public ResponseEntity<?> buscarPorDni(@PathVariable String dni) {
        Optional<Socio> socioOpt = socioService.findByDni(dni);
        if (socioOpt.isPresent()) {
            return ResponseEntity.ok(socioOpt.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se encontró socio con DNI: " + dni);
        }
    }

    // Buscar por email
    @GetMapping("/email/{email}")
    public ResponseEntity<?> buscarPorEmail(@PathVariable String email) {
        Optional<Socio> socioOpt = socioService.findByEmail(email);
        if (socioOpt.isPresent()) {
            return ResponseEntity.ok(socioOpt.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se encontró socio con email: " + email);
        }
    }

    // Buscar por teléfono
    @GetMapping("/telefono/{telefono}")
    public ResponseEntity<List<Socio>> buscarPorTelefono(@PathVariable String telefono) {
        List<Socio> socios = socioService.findByTelefono(telefono);
        return ResponseEntity.ok(socios);
    }

    // Buscar socios nacidos antes de una fecha
    @GetMapping("/nacidos-antes")
    public ResponseEntity<List<Socio>> nacidosAntesDe(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        List<Socio> socios = socioService.nacidoAntesDe(fecha);
        return ResponseEntity.ok(socios);
    }

    // Buscar socios nacidos entre dos fechas
    @GetMapping("/nacidos-entre")
    public ResponseEntity<List<Socio>> nacidosEntre(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        List<Socio> socios = socioService.nacidoEntre(inicio, fin);
        return ResponseEntity.ok(socios);
    }

    // Obtener socios sin barco
    @GetMapping("/sin-barco")
    public ResponseEntity<List<Socio>> sociosSinBarco() {
        List<Socio> socios = socioService.sociosSinBarco();
        return ResponseEntity.ok(socios);
    }

    // Obtener socios ordenados alfabéticamente
    @GetMapping("/ordenados")
    public ResponseEntity<List<Socio>> ordenarAlfabetico() {
        List<Socio> socios = socioService.ordenarAlfabetico();
        return ResponseEntity.ok(socios);
    }

    // Obtener socio por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable int id) {
		try {
			return ResponseEntity.ok(this.socioService.findById(id));
		} catch (SocioNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		}
	}

    // Actualizar socio
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody Socio socio) {
		try {
			return ResponseEntity.ok(this.socioService.update(id, socio));
		} catch (SocioNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		} catch (SocioException ex) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
		}
	}

    // Eliminar socio
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable int id) {
		try {
			this.socioService.deleteById(id);
			return ResponseEntity.ok("El socio con ID("+ id +") ha sido borrado correctamente. " );
		} catch (SocioNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		}

	}
}