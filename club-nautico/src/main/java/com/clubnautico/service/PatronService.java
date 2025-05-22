package com.clubnautico.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clubnautico.entity.Patron;
import com.clubnautico.repository.PatronRepository;
import com.clubnautico.service.exceptions.PatronNotFoundException;
import com.clubnautico.service.exceptions.SocioException;
import com.clubnautico.service.exceptions.SocioNotFoundException;

@Service
public class PatronService {

	@Autowired
	private PatronRepository patronRepository;

	// 1 obtener todos los patrones
	public List<Patron> findAll() {
		return this.patronRepository.findAll();
	}
	
	//buscar por dni
	public List<Patron> findByDni(String dni){
		return this.patronRepository.findByDni(dni);
	}
	
	//Buscar por email
	public List<Patron> findByEmail(String email){
		return this.patronRepository.findByEmail(email);
	}
	
	//Encontrar por nombre y apellidos
	public List<Patron> findByNombreApellidos(String nombre, String apellidos){
		return this.patronRepository.findByNombreApellido(nombre, apellidos);
	}
	
	//Ordenar por edad
	public List<Patron> orderByEdad(){
		return this.patronRepository.OrderByEdad();
	}
	
	//Contar patrones
	public int contarPatrones(){
		return this.patronRepository.ContarPatrones();
	}
	
	//Obtener patrones con salidas
	public List<Patron> tienenSalidas(){
		return this.patronRepository.tienenSalidas();
	}
	
	//sin salidas
	public List<Patron> sinSalidas(){
		return this.patronRepository.sinSalidas();
	}
	
	//num patrones que han conducido un barco
	public int findNumPatronesConducenBarco(int idBarco){
		return this.patronRepository.findNumPatronesConducenBarco(idBarco);
	}
	
	//info patrones quen han conducido un barco concreto
	public List<Patron> findInfoPatronesBarco(int idBarco){
		return this.patronRepository.findInfoPatronesBarco(idBarco);
	}
	
	// 2 Obtener un patron por su ID
	public Patron findById(int id) {
	    return this.patronRepository.findById(id)
	        .orElseThrow(() -> new PatronNotFoundException("No existe el patrón con ID: " + id));
	}


	// 3 Crear un patron

	public Patron create(Patron patron) {
		patron.setId(0);

		if (patron.getFechaNacimiento() == null) {
			throw new PatronNotFoundException("La fecha de nacimiento del patron no puede ser nula");
		}
		if (patron.getNombre() == null) {
			throw new PatronNotFoundException("El nombre del patron no puede ser nulo");
		}
		if (patron.getApellidos() == null) {
			throw new PatronNotFoundException("Los apellidos del patron no puede ser nulos");
		}
		if (patron.getEmail() == null) {
			throw new PatronNotFoundException("El email del patron no puede ser nulo");
		}
		if (patron.getDni() == null) {
			throw new PatronNotFoundException("El DNI del patron no puede ser nulo");
		}
		if (patron.getTelefono() == null) {
			throw new PatronNotFoundException("El Telefono del patron no puede ser nulo");
		}

		return this.patronRepository.save(patron);
	}

	// 4 Modificar un patron
	public Patron update(int id, Patron patron) {
		if (id != patron.getId()) {
			throw new SocioException(
					"El ID del path (" + id + ") y el id del body (" + patron.getId() + ") no coinciden");
		}

		if (!this.patronRepository.existsById(id)) {
			throw new SocioNotFoundException("No existe el patron con ID: " + id);
		}

		Patron patronBD = this.findById(patron.getId());

		// OK para modificar nombre/apellidos / email / dni / telefono
		patronBD.setNombre(patron.getNombre());
		patronBD.setApellidos(patron.getApellidos());
		patronBD.setEmail(patron.getEmail());
		patronBD.setDni(patron.getDni());
		patronBD.setTelefono(patron.getTelefono());

		return this.patronRepository.save(patron);
	}

	public void deleteById(int id) {
		if (!this.patronRepository.existsById(id)) {
			throw new SocioNotFoundException("No existe el socio con ID: " + id);
		}

		this.patronRepository.deleteById(id);
	}
}
