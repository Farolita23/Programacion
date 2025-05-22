package com.clubnautico.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clubnautico.entity.Socio;
import com.clubnautico.repository.SocioRepository;
import com.clubnautico.service.exceptions.SocioException;
import com.clubnautico.service.exceptions.SocioNotFoundException;

@Service
public class SocioService {
	@Autowired
    private SocioRepository socioRepository;

	// 1 obtener todos los socios
 	public List<Socio> findAll(){
 		return this.socioRepository.findAll();
 	}
 	
 	// 2 Obtener un socio por su ID
 	public Socio findById(int id) {
 	    return this.socioRepository.findById(id)
 	        .orElseThrow(() -> new SocioNotFoundException("No existe el socio con ID: " + id));
 	}

 	//Buscar por nombre y apellido
 	public List<Socio> findByNombreApellido(String nombre, String apellidos){
		return this.socioRepository.findByNombreYApellidos(nombre, apellidos);
	}
 	
 	//Buscar por DNI
 	public Optional<Socio> findByDni(String dni){
 		return this.socioRepository.findByDni(dni);
 	}
 	
 	//Buscar por email
 	public Optional<Socio> findByEmail(String email){
 		return this.socioRepository.findByEmail(email);
 	}
 	
 	//busca por telefono
 	public List<Socio> findByTelefono(String telefono){
 		return this.socioRepository.findByTelefono(telefono);
 	}
 	
 	//Buscar socio nacido antes de una fecha
 	public List<Socio> nacidoAntesDe(LocalDate fecha){
 		return this.socioRepository.nacidosAntesDe(fecha);
 	}
 	
 	//Buscar nacido entre dos fechas
 	public List<Socio> nacidoEntre(LocalDate inicio, LocalDate fin){
 		return this.socioRepository.nacidosEntre(inicio, fin);
 	}
 	
 	//Socios sin barco
 	public List<Socio> sociosSinBarco(){
 		return this.socioRepository.sociosSinBarcos();
 	}
 	
 	//ordenar socios por orden alfabetico
 	public List<Socio> ordenarAlfabetico(){
 		return this.socioRepository.ordenarAlfabetico();
 	}
 	
 	// 3 Crear un socio
 	
 	public Socio create(Socio socio) {	
 	    socio.setId(0);

		if (socio.getFechaNacimiento() == null) {
			throw new SocioNotFoundException("La fecha de nacimiento del socio no puede ser nula");
		}
		if (socio.getNombre() == null) {
			throw new SocioNotFoundException("El nombre del socio no puede ser nulo");
		}
		if (socio.getApellidos() == null) {
			throw new SocioNotFoundException("Los apellidos del socio no puede ser nulos");
		}
		if (socio.getEmail() == null) {
			throw new SocioNotFoundException("El email del socio no puede ser nulo");
		}
		if (socio.getDni() == null) {
			throw new SocioNotFoundException("El DNI del socio no puede ser nulo");
		}
		if (socio.getTelefono() == null) {
			throw new SocioNotFoundException("El Telefono del socio no puede ser nulo");
		}
 	
 	    return this.socioRepository.save(socio);
 	}
 	
 	
 	// 4 Modificar un socio
 	 	public Socio update(int id, Socio socio) {
 	 	    if(id != socio.getId()) {
 	 	        throw new SocioException("El ID del path ("+ id +") y el id del body ("+ socio.getId() +") no coinciden");
 	 	    }

 	 	    if(!this.socioRepository.existsById(id)) {
 	 	        throw new SocioNotFoundException("No existe el socio con ID: " + id);
 	 	    }

 	 	    Socio socioBD = this.findById(socio.getId());

 	 	    

			// OK para modificar nombre/apellidos / email / dni / telefono
			socioBD.setNombre(socio.getNombre());
			socioBD.setApellidos(socio.getApellidos());
			socioBD.setEmail(socio.getEmail());
			socioBD.setDni(socio.getDni());
			socioBD.setTelefono(socio.getTelefono());

 	 	    return this.socioRepository.save(socio);
 	 	}

 	
 	

//    public Socio update(int id, Socio socioActualizado) {
//    	Socio socio = findById(id);
//    	socio.setNombre(socioActualizado.getNombre());
//    	socio.setApellidos(socioActualizado.getApellidos());
//        socio.setEmail(socioActualizado.getEmail());
//        socio.setDni(socioActualizado.getDni());
//        socio.setTelefono(socioActualizado.getTelefono());
//        socio.setFechaNacimiento(socioActualizado.getFechaNacimiento());
//        return socioRepository.save(socio);
//    }

 	 	public void deleteById(int id) {
	 		if(!this.socioRepository.existsById(id)) {
	 			throw new SocioNotFoundException("No existe el socio con ID: " + id);
	 		}
	 
	 		this.socioRepository.deleteById(id);
	 	}
}
