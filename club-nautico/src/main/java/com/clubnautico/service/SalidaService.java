package com.clubnautico.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clubnautico.entity.Salida;
import com.clubnautico.repository.SalidaRepository;
import com.clubnautico.service.exceptions.SalidaException;
import com.clubnautico.service.exceptions.SalidaNotFoundException;

@Service
public class SalidaService {
	@Autowired
    private SalidaRepository salidaRepository;

	// 1 obtener todos las salidas
 	public List<Salida> findAll(){
 		return this.salidaRepository.findAll();
 	}
 	
 	//contar numero de salidas por barco
 	public int contarSalidas(int idBarco){
 		return this.salidaRepository.contarSalidasPorBarco(idBarco);
 	}
 	
 	//obtener salidas de un patron por fecha descendente
 	public List<Salida> findSalidasPatronFecha(int idPatron){
 		return this.salidaRepository.findSalidasPatronFecha(idPatron);
 	}
 	
 	//contar total de salidas realizadas
 	public int countSalidaByPatron(int idPatron) {
 		return this.salidaRepository.countSalidaByPatron(idPatron);
 	}
 	
 	//Obtener salida entre dos fechas
 	public List<Salida> findSalidasEntreFechas(LocalDateTime inicio, LocalDateTime fin) {
        return this.salidaRepository.findSalidasEntreFechas(inicio, fin);
    }
 	
 	//Total salidas realizadas
 	public int countSalidasRealizadas() {
 		return this.salidaRepository.countSalidasRealizadas();
 	}
 	
 	// 2 Obtener una salida por su ID
 	public Salida findById(int id) {
 	    return this.salidaRepository.findById(id)
 	        .orElseThrow(() -> new SalidaNotFoundException("No existe la salida con ID: " + id));
 	}

 	// 3 Crear un salida
 	
 	public Salida create(Salida salida) {	
 		salida.setId(0);

		if (salida.getFechaHoraSalida() == null) {
			throw new SalidaNotFoundException("La fecha y hora de la salida no puede ser nula");
		}
		if (salida.getDestino() == null) {
			throw new SalidaNotFoundException("El nombre del destino no puede ser nulo");
		}
		if (salida.getBarco() == null) {
			throw new SalidaNotFoundException("El id del barco no puede ser nulo");
		}
		if (salida.getPatron() == null) {
			throw new SalidaNotFoundException("El id del patron no puede ser nulo");
		}
		
 	
 	    return this.salidaRepository.save(salida);
 	}
 	
 	
 	// 4 Modificar una salida
 	 	public Salida update(int id, Salida salida) {
 	 	    if(id != salida.getId()) {
 	 	        throw new SalidaException("El ID del path ("+ id +") y el id del body ("+ salida.getId() +") no coinciden");
 	 	    }

 	 	    if(!this.salidaRepository.existsById(id)) {
 	 	        throw new SalidaNotFoundException("No existe la salida con ID: " + id);
 	 	    }

 	 	    Salida salidaBD = this.findById(salida.getId());

 	 	    // OK para modificar
			salidaBD.setFechaHoraSalida(salida.getFechaHoraSalida());
			salidaBD.setDestino(salida.getDestino());
			salidaBD.setBarco(salida.getBarco());
			salidaBD.setPatron(salida.getPatron());

 	 	    return this.salidaRepository.save(salida);
 	 	}


 	 	public void deleteById(int id) {
	 		if(!this.salidaRepository.existsById(id)) {
	 			throw new SalidaNotFoundException("No existe el salida con ID: " + id);
	 		}
	 
	 		this.salidaRepository.deleteById(id);
	 	}
}
