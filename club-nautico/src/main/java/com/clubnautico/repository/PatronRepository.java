package com.clubnautico.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.clubnautico.entity.Patron;

@Repository
public interface PatronRepository extends JpaRepository<Patron, Integer> {
	// Buscar patron por DNI
	@Query("select p from Patron p where p.dni = ?1")
	List<Patron> findByDni(String dni);
	
	//Buscar patron por email
	@Query("select p from Patron p where p.email = ?1")
	List<Patron> findByEmail(String email);
	
	//Buscar patron por nombre y apellidos
	@Query("select p from Patron p where p.nombre = ?1 and p.apellidos = ?2")
	List<Patron> findByNombreApellido(String nombre, String apellidos);
	
	//Ordenar a los Patrones por edad de menor a mayor
	@Query("select p from Patron p order by p.fechaNacimiento DESC")
	List<Patron> OrderByEdad();
	
	//Contar los patrones registrados
	@Query("select count(p) from Patron p")
	int ContarPatrones();
	
	// Obtener los partones que tienen alguna salida asignada
	@Query("select distinct p from Patron p JOIN p.salidas s")
	List<Patron> tienenSalidas();
	
	//Obtener patrones sin salidas
	@Query("select p from Patron p where p.salidas is empty")
	List<Patron> sinSalidas();
	
	//cuantos patrones han conducido un barco concreto
	@Query("select count(distinct s.patron) from Salida s where s.barco.id = ?1")
	int findNumPatronesConducenBarco(int idBarco);
	
	//info de patrones que han conducido cada barco
	@Query("select distinct s.patron from Salida s where s.barco.id = ?1")
	List<Patron> findInfoPatronesBarco(int idBarco);
	
}
