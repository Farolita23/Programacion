package com.clubnautico.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clubnautico.entity.Barco;
import com.clubnautico.service.BarcoService;
import com.clubnautico.service.exceptions.BarcoException;
import com.clubnautico.service.exceptions.BarcoNotFoundException;

@RestController
@RequestMapping("/barcos")
public class BarcoController {

    @Autowired
    private BarcoService barcoService;

    // Crear barco
    @PostMapping
    public Barco crear(@RequestBody Barco barco) {
        return barcoService.create(barco);
    }

    // Obtener todos los barcos
    @GetMapping
    public ResponseEntity<List<Barco>> list() {
		return ResponseEntity.status(HttpStatus.OK).body(this.barcoService.findAll());
	}
    
 // Buscar barco por matrícula
    @GetMapping("/matricula/{matricula}")
    public List<Barco> findByMatricula(@PathVariable String matricula) {
        return this.barcoService.findMat(matricula);
    }

    // Obtener barcos de un socio
    @GetMapping("/socio/{idSocio}")
    public List<Barco> findBarcosPorSocio(@PathVariable int idSocio) {
        return this.barcoService.findBarcosPorSocio(idSocio);
    }

    // Contar barcos registrados
    @GetMapping("/contar")
    public int contarBarcos() {
        return this.barcoService.contarBarcosRegistrados();
    }

    // Obtener barcos conducidos por un patrón
    @GetMapping("/patron/{idPatron}/conducidos")
    public List<Barco> barcosConducidosPorPatron(@PathVariable int idPatron) {
        return this.barcoService.findBarcosConducidosPorPatron(idPatron);
    }

    // Obtener barco por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable int id) {
		try {
			return ResponseEntity.ok(this.barcoService.findById(id));
		} catch (BarcoNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		}
	}

    // Actualizar barco
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody Barco barco) {
		try {
			return ResponseEntity.ok(this.barcoService.update(id, barco));
		} catch (BarcoNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		} catch (BarcoException ex) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
		}
	}

    // Eliminar barco
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable int id) {
		try {
			this.barcoService.deleteById(id);
			return ResponseEntity.ok("El barco con ID("+ id +") ha sido borrado correctamente. " );
		} catch (BarcoNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		}

	}
}