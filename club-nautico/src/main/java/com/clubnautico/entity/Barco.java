package com.clubnautico.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Barco {
//número de matrícula, nombre, número del amarre y cuota que paga por el mismo.  
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // autogenerar
    private int id;

    @NotBlank(message = "La matrícula es obligatoria")
    @Column(unique = true)
    private String matricula;

    @NotBlank(message = "El nombre del barco es obligatorio")
    private String nombre;

    @NotNull(message = "El número de amarre es obligatorio")
    private Integer numeroAmarre;

    @NotNull(message = "La cuota es obligatoria")
    @DecimalMin(value = "0.0", inclusive = false, message = "La cuota debe ser positiva")
    private Double cuota;

    @ManyToOne
    @JoinColumn(name = "socio_id")
    private Socio socio;

    @JsonIgnore
    @OneToMany(mappedBy = "barco", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Salida> salidas = new ArrayList<>();

    // Getters y Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getNumeroAmarre() {
        return numeroAmarre;
    }

    public void setNumeroAmarre(Integer numeroAmarre) {
        this.numeroAmarre = numeroAmarre;
    }

    public Double getCuota() {
        return cuota;
    }

    public void setCuota(Double cuota) {
        this.cuota = cuota;
    }

    public Socio getSocio() {
        return socio;
    }

    public void setSocio(Socio socio) {
        this.socio = socio;
    }

    public List<Salida> getSalidas() {
        return salidas;
    }

    public void setSalidas(List<Salida> salidas) {
        this.salidas = salidas;
    }
}
