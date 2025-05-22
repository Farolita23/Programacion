package com.clubnautico.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clubnautico.entity.Barco;
import com.clubnautico.repository.BarcoRepository;
import com.clubnautico.service.exceptions.BarcoException;
import com.clubnautico.service.exceptions.BarcoNotFoundException;
import com.clubnautico.service.exceptions.SocioNotFoundException;

@Service
public class BarcoService {

	@Autowired
    private BarcoRepository barcoRepository;

	// 1 obtener todos los barcos
 	public List<Barco> findAll(){
 		return this.barcoRepository.findAll();
 	}
 	
 	//encontrar un barco por su ID
	public List<Barco> findMat(String matricula){
 		return this.barcoRepository.findByMatricula(matricula);
 	}
	
	//encontar todos los barcos de un socio
	public List<Barco> findBarcosPorSocio(int idSocio){
		return this.barcoRepository.findBarcosPorSocio(idSocio);
	}
	
	//Contar numero de barcos registrados
	public int contarBarcosRegistrados(){
		return this.barcoRepository.contarBarcosRegistrados();
	}
	
	//obtener barcos conducidos por un patron en concreto
	public List<Barco> findBarcosConducidosPorPatron(int idPatron){
		return this.barcoRepository.findBarcosConducidosPorPatron(idPatron);
	}
 	
 	// 2 Obtener un barco por su ID
 	public Barco findById(int id) {
 	    return this.barcoRepository.findById(id)
 	        .orElseThrow(() -> new BarcoNotFoundException("No existe el barco con ID: " + id));
 	}

 	

 	// 3 Crear un barco
 	
 	public Barco create(Barco barco) {	
 		barco.setId(0);

		if (barco.getMatricula() == null) {
			throw new BarcoNotFoundException("La matricula del barco no puede ser nula");
		}
		if (barco.getNombre() == null) {
			throw new BarcoNotFoundException("El nombre del barco no puede ser nulo");
		}
		if (barco.getNumeroAmarre() == null) {
			throw new BarcoNotFoundException("El numero de amarre no puede ser nulos");
		}
		if (barco.getCuota() == null) {
			throw new BarcoNotFoundException("La cuota del barco no puede ser nulo");
		}
		if (barco.getSocio() == null) {
			throw new BarcoNotFoundException("El socio no puede ser nulo");
		}
		
 	
 	    return this.barcoRepository.save(barco);
 	}
 	
 	
 	// 4 Modificar un barco
 	 	public Barco update(int id, Barco barco) {
 	 	    if(id != barco.getId()) {
 	 	        throw new BarcoException("El ID del path ("+ id +") y el id del body ("+ barco.getId() +") no coinciden");
 	 	    }

 	 	    if(!this.barcoRepository.existsById(id)) {
 	 	        throw new BarcoNotFoundException("No existe el barco con ID: " + id);
 	 	    }

 	 	  if (!barco.getMatricula().equals(barco.getMatricula())) {
 	 	    throw new BarcoException("No se permite modificar la matrícula del barco");
 	 	}


 	 	  Barco barcoBD = this.findById(barco.getId());

 	 	    

			// OK para modificar nombre/apellidos / email / dni / telefono
	 	 	barcoBD.setNombre(barco.getNombre());
	 	 	barcoBD.setMatricula(barco.getMatricula());
	 	 	barcoBD.setNumeroAmarre(barco.getNumeroAmarre());
	 	 	barcoBD.setCuota(barco.getCuota());
	 	 	barcoBD.setSocio(barco.getSocio());

 	 	    return this.barcoRepository.save(barco);
 	 	}


 	 	public void deleteById(int id) {
	 		if(!this.barcoRepository.existsById(id)) {
	 			throw new SocioNotFoundException("No existe el barco con ID: " + id);
	 		}
	 
	 		this.barcoRepository.deleteById(id);
	 	}
}
