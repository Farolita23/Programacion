package com.clubnautico.controller;

import java.time.LocalDateTime;
import java.util.List;

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

import com.clubnautico.entity.Salida;
import com.clubnautico.service.SalidaService;
import com.clubnautico.service.exceptions.SalidaException;
import com.clubnautico.service.exceptions.SalidaNotFoundException;

@RestController
@RequestMapping("/salidas")
public class SalidaController {

    @Autowired
    private SalidaService salidaService;

    // Crear salida
    @PostMapping
    public Salida crear(@RequestBody Salida salida) {
        return salidaService.create(salida);
    }

    // Obtener todos las salidas
    @GetMapping
    public ResponseEntity<List<Salida>> list() {
		return ResponseEntity.status(HttpStatus.OK).body(this.salidaService.findAll());
	}
    
    //contar numero de salidas por barco
    @GetMapping("/contar/barco/{idBarco}")
    public ResponseEntity<Integer> contarPorBarco(@PathVariable int idBarco) {
        return ResponseEntity.ok(salidaService.contarSalidas(idBarco));
    }
    
   	//obtener salidas de un patron por fecha descendente
    @GetMapping("/patron/{idPatron}/ordenadas")
    public ResponseEntity<List<Salida>> salidasPatronFecha(@PathVariable int idPatron) {
        return ResponseEntity.ok(salidaService.findSalidasPatronFecha(idPatron));
    }
   	
   	//contar total de salidas realizadas por un patron
    @GetMapping("/contar/patron/{idPatron}")
    public ResponseEntity<Integer> contarPorPatron(@PathVariable int idPatron) {
        return ResponseEntity.ok(salidaService.countSalidaByPatron(idPatron));
    }
   	
   	//Obtener salida entre dos fechas
    @GetMapping("/entre-fechas")
    public ResponseEntity<?> salidasEntreFechas(
            @RequestParam("inicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam("fin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        try {
            List<Salida> salidas = salidaService.findSalidasEntreFechas(inicio, fin);
            return ResponseEntity.ok(salidas);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al procesar las fechas: " + ex.getMessage());
        }
    }
   	
   	//Total salidas realizadas
    @GetMapping("/contar/total")
    public ResponseEntity<Integer> contarTotalSalidas() {
        return ResponseEntity.ok(salidaService.countSalidasRealizadas());
    }
    

    // Obtener salida por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable int id) {
		try {
			return ResponseEntity.ok(this.salidaService.findById(id));
		} catch (SalidaNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		}
	}

    // Actualizar salida
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody Salida salida) {
		try {
			return ResponseEntity.ok(this.salidaService.update(id, salida));
		} catch (SalidaNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		} catch (SalidaException ex) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
		}
	}

    // Eliminar salida
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable int id) {
		try {
			this.salidaService.deleteById(id);
			return ResponseEntity.ok("La salida con ID("+ id +") ha sido borrado correctamente. " );
		} catch (SalidaNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
		}

	}
}