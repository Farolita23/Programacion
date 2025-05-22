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

import com.clubnautico.entity.Patron;
import com.clubnautico.service.PatronService;
import com.clubnautico.service.exceptions.PatronException;
import com.clubnautico.service.exceptions.PatronNotFoundException;
import com.clubnautico.service.exceptions.SocioNotFoundException;

@RestController
@RequestMapping("/patrones")
public class PatronController {

    @Autowired
    private PatronService patronService;

    // Crear patron
    @PostMapping
    public Patron crear(@RequestBody Patron patron) {
        return patronService.create(patron);
    }

    // Obtener todos los patrones
    @GetMapping
    public ResponseEntity<List<Patron>> list() {
		return ResponseEntity.status(HttpStatus.OK).body(this.patronService.findAll());
	}
    
    // Buscar por DNI
    @GetMapping("/dni/{dni}")
    public List<Patron> findByDni(@PathVariable String dni) {
        return this.patronService.findByDni(dni);
    }

    // Buscar por email
    @GetMapping("/email/{email}")
    public List<Patron> findByEmail(@PathVariable String email) {
        return this.patronService.findByEmail(email);
    }

    // Buscar por nombre y apellidos
    @GetMapping("/nombre-apellidos/{nombre}/{apellidos}")
    public List<Patron> findByNombreApellidos(@PathVariable String nombre, @PathVariable String apellidos) {
        return this.patronService.findByNombreApellidos(nombre, apellidos);
    }

    // Ordenar por edad
    @GetMapping("/ordenar-por-edad")
    public List<Patron> orderByEdad() {
        return this.patronService.orderByEdad();
    }
    
    //contar patrones
    @GetMapping("/contar")
    public int contarPatrones() {
        return this.patronService.contarPatrones();
    }

    // Obtener patrones que tienen salidas
    @GetMapping("/con-salidas")
    public List<Patron> conSalidas() {
        return this.patronService.tienenSalidas();
    }

    // Obtener patrones sin salidas
    @GetMapping("/sin-salidas")
    public List<Patron> sinSalidas() {
        return this.patronService.sinSalidas();
    }

    // Obtener la lista de patrones que han conducido un barco concreto
    @GetMapping("/barco/{idBarco}/patrones")
    public List<Patron> findPatronesPorBarco(@PathVariable int idBarco) {
        return this.patronService.findInfoPatronesBarco(idBarco);
    }

    // Contar patrones que han conducido un barco concreto 
    @GetMapping("/barco/{idBarco}/num-patrones")
    public int contarPatronesBarco(@PathVariable int idBarco) {
        return this.patronService.findNumPatronesConducenBarco(idBarco);
    }

    // Obtener patron por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable int id) {
		try {
			return ResponseEntity.ok(this.patronService.findById(id));
		} catch (PatronNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		}
	}

    // Actualizar patron
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody Patron patron) {
		try {
			return ResponseEntity.ok(this.patronService.update(id, patron));
		} catch (PatronNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		} catch (PatronException ex) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
		}
	}

    // Eliminar patron
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable int id) {
		try {
			this.patronService.deleteById(id);
			return ResponseEntity.ok("El patron con ID("+ id +") ha sido borrado correctamente. " );
		} catch (PatronNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		}

	}
}