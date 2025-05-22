package com.clubnautico.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.clubnautico.entity.Socio;

@Repository
public interface SocioRepository extends JpaRepository<Socio, Integer> {
	//Buscar por nombre y apellidos
	@Query("SELECT s FROM Socio s WHERE s.nombre = ?1 AND s.apellidos = ?2")
	List<Socio> findByNombreYApellidos(String nombre, String apellidos);

	//Buscar por DNI
	@Query("SELECT s FROM Socio s WHERE s.dni = ?1")
	Optional<Socio> findByDni(@Param("dni") String dni); //optional es para que solo pueda aparecer 1 o 0 valores coincidentes, se usa aquí porque el DNI es unico y no va haber más.

	// Buscar por email
	@Query("SELECT s FROM Socio s WHERE s.email = ?1")
	Optional<Socio> findByEmail(@Param("email") String email);
	
	//Buscar por telefono
	@Query("SELECT s FROM Socio s WHERE s.telefono = ?1")
	List<Socio> findByTelefono(@Param("telefono") String telefono);
	
	//buscar socios nacidos antes de una fecha concreta
	@Query("SELECT s FROM Socio s WHERE s.fechaNacimiento < ?1")
	List<Socio> nacidosAntesDe(@Param("fecha") LocalDate fecha);
	
	//Buscar nacidos entre dos fechas
	@Query("SELECT s FROM Socio s WHERE s.fechaNacimiento BETWEEN ?1 AND ?2")
	List<Socio> nacidosEntre(@Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);
	
	//socios sin barco
	@Query("SELECT s FROM Socio s WHERE s.barcos IS EMPTY")
	List<Socio> sociosSinBarcos();
	
	//Ordenar socios por orden alfabetico
	@Query("SELECT s FROM Socio s ORDER BY s.apellidos ASC, s.nombre ASC")
	List<Socio> ordenarAlfabetico();

}
