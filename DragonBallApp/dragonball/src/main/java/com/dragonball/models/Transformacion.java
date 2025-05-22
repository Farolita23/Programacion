package com.dragonball.models;

public class Transformacion {
    
    private Long id;
    private String nombre;
    private String descripcion;
    private Double multiplicadorPoder;
    private Long personajeId;
    
    public Transformacion() {
    }
    
    public Transformacion(Long id, String nombre, String descripcion, Double multiplicadorPoder, Long personajeId) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.multiplicadorPoder = multiplicadorPoder;
        this.personajeId = personajeId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Double getMultiplicadorPoder() {
        return multiplicadorPoder;
    }

    public void setMultiplicadorPoder(Double multiplicadorPoder) {
        this.multiplicadorPoder = multiplicadorPoder;
    }

    public Long getPersonajeId() {
        return personajeId;
    }

    public void setPersonajeId(Long personajeId) {
        this.personajeId = personajeId;
    }
}