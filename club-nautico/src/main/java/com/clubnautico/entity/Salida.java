package com.clubnautico.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

@Entity
public class Salida {
// fecha y hora de salida, el destino y los datos personales del patrón
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    
    @NotNull(message = "La fecha de salida es obligatoria")
    private LocalDateTime fechaHoraSalida;

    @NotBlank(message = "El destino es obligatorio")
    private String destino;

    @ManyToOne
    @JoinColumn(name = "barco_id")
    private Barco barco;

    @ManyToOne
    @JoinColumn(name = "patron_id")
    private Patron patron;

    // Getters y Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public LocalDateTime getFechaHoraSalida() {
        return fechaHoraSalida;
    }

    public void setFechaHoraSalida(LocalDateTime fechaHoraSalida) {
        this.fechaHoraSalida = fechaHoraSalida;
    }

    public String getDestino() {
        return destino;
    }

    public void setDestino(String destino) {
        this.destino = destino;
    }

    public Barco getBarco() {
        return barco;
    }

    public void setBarco(Barco barco) {
        this.barco = barco;
    }

    public Patron getPatron() {
        return patron;
    }

    public void setPatron(Patron patron) {
        this.patron = patron;
    }
}
