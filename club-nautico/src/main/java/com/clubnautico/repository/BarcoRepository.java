package com.clubnautico.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.clubnautico.entity.Barco;

@Repository
public interface BarcoRepository extends JpaRepository<Barco, Integer> {
	
	//Encontrar un barco por su matricula
	@Query("select b from Barco b where b.matricula = ?1")
	List<Barco> findByMatricula(String matricula);
	
	//Encontrar todos los barcos de un socio en concreto
	@Query("select b from Barco b where b.socio.id = ?1")
	List<Barco> findBarcosPorSocio(int idSocio);
	
	//Contar numero de barcos registrados
	@Query("select count(b) from Barco b")
	int contarBarcosRegistrados();

	// Obtener barcos conducidos por un patron en concreto
	@Query("select distinct s.barco from Salida s where s.patron.id = ?1")
	List<Barco> findBarcosConducidosPorPatron(int idPatron);

}
