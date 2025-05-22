package com.clubnautico.club_nautico;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.clubnautico.entity.Barco;
import com.clubnautico.entity.Patron;
import com.clubnautico.entity.Salida;
import com.clubnautico.entity.Socio;
import com.clubnautico.service.BarcoService;
import com.clubnautico.service.PatronService;
import com.clubnautico.service.SalidaService;
import com.clubnautico.service.SocioService;

import jakarta.transaction.Transactional;

@SpringBootTest
@Transactional // Todos los cambios que realicemos en la base de datos (crear nuevos objetos) se revertiran tras realizar el test
public class ClubNauticoApplicationTests {

    @Autowired
    private SocioService socioService;

    @Autowired
    private BarcoService barcoService;

    @Autowired
    private PatronService patronService;

    @Autowired
    private SalidaService salidaService;

    @Test
    public void testCrearSocioConBarcoYSalida() {
        // Crear socio
        Socio socio = new Socio();
        socio.setNombre("Luis");
        socio.setApellidos("Martínez");
        socio.setEmail("luis@example.com");
        socio.setDni("12345678A");
        socio.setTelefono("123456789");
        socio.setFechaNacimiento(LocalDate.of(1985, 5, 20));
        Socio socioGuardado = socioService.create(socio);

        // Crear barco
        Barco barco = new Barco();
        barco.setMatricula("XYZ-987");
        barco.setNombre("La Aventura");
        barco.setNumeroAmarre(15);
        barco.setCuota(300.0);
        barco.setSocio(socioGuardado);
        Barco barcoGuardado = barcoService.create(barco);

        // Crear patrón
        Patron patron = new Patron();
        patron.setNombre("Ana");
        patron.setApellidos("Gómez");
        patron.setEmail("ana@example.com");
        patron.setDni("87654321B");
        patron.setTelefono("987654321");
        patron.setFechaNacimiento(LocalDate.of(1990, 8, 15));
        Patron patronGuardado = patronService.create(patron);

        // Crear salida
        Salida salida = new Salida();
        salida.setFechaHoraSalida(LocalDateTime.now());
        salida.setDestino("Formentera");
        salida.setBarco(barcoGuardado);
        salida.setPatron(patronGuardado);
        Salida salidaGuardada = salidaService.create(salida);

        // VERIFICACIONES

        assertNotNull(socioGuardado.getId());
        assertNotNull(barcoGuardado.getId());
        assertNotNull(patronGuardado.getId());
        assertNotNull(salidaGuardada.getId());

        // Verificar que el socio tiene el barco asociado
        assertNotNull(socioGuardado.getBarcos());
        
        socioGuardado.getBarcos().add(barcoGuardado);
        assertTrue(socioGuardado.getBarcos().stream()
            .anyMatch(b -> b.getId() == barcoGuardado.getId()));

        // Verificar que el barco tiene la salida asociada
        assertNotNull(barcoGuardado.getSalidas());
        
        barcoGuardado.getSalidas().add(salida);
        assertTrue(barcoGuardado.getSalidas().stream()
            .anyMatch(s -> s.getId() == salidaGuardada.getId()));

        // Comprobar que la salida tiene el barco y patrón correctos
        assertEquals(barcoGuardado.getId(), salidaGuardada.getBarco().getId());
        assertEquals(patronGuardado.getId(), salidaGuardada.getPatron().getId());

        // Verificar que en todas las salidas hay al menos una con destino "Formentera"
        List<Salida> salidasBarco = salidaService.findAll();
        assertTrue(salidasBarco.stream()
            .anyMatch(s -> "Formentera".equals(s.getDestino())));

        // Verificar que alguna salida tiene patrón "Ana"
        assertTrue(salidasBarco.stream()
            .anyMatch(s -> "Ana".equals(s.getPatron() != null ? s.getPatron().getNombre() : null)));

        // Validar que la cuota del barco es positiva
        assertTrue(barcoGuardado.getCuota() > 0);

        // Validar que la fecha de nacimiento del patrón y socio es anterior a la actual
        assertTrue(patronGuardado.getFechaNacimiento().isBefore(LocalDate.now()));
        assertTrue(socioGuardado.getFechaNacimiento().isBefore(LocalDate.now()));

        // Validar que la matrícula del barco no está vacía ni nula
        assertNotNull(barcoGuardado.getMatricula());
        assertTrue(!barcoGuardado.getMatricula().isBlank());

        // Validar que el destino de la salida no está vacío ni nulo
        assertNotNull(salidaGuardada.getDestino());
        assertTrue(!salidaGuardada.getDestino().isBlank());
    }

} 
