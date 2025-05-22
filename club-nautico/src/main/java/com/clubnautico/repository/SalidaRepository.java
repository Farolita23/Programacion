package com.clubnautico.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.clubnautico.entity.Salida;

@Repository
public interface SalidaRepository extends JpaRepository<Salida, Integer> {
	//Obtener el numero de salidas que ha  realizado un barco
	@Query("select count(s) from Salida s where s.barco.id = ?1")
	int contarSalidasPorBarco(int idBarco);
	
	//Obtener todas las salidas de un patron por fecha descendente
	@Query("select s from Salida s where s.patron.id = ?1 ORDER BY s.fechaHoraSalida DESC")
	List<Salida> findSalidasPatronFecha(int idPatron);
	
	// contar total de salidas realizadas por un patron
	@Query("select count(s) from Salida s where s.patron.id = ?1")
	int countSalidaByPatron(int idPatron);
	
	//seleccionar salidas entre dos fechas
	@Query("SELECT s FROM Salida s WHERE s.fechaHoraSalida BETWEEN :inicio AND :fin")
	List<Salida> findSalidasEntreFechas(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);
	
	//Total de salidas realizadas
	@Query("select count(s) from Salida s")
	int countSalidasRealizadas();
}
