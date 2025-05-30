package com.dragonball.models;

public class Saga {
    
    private Long id;
    private String nombre;
    private String descripcion;
    private Integer anoLanzamiento;
    
    public Saga() {
    }
    
    public Saga(Long id, String nombre, String descripcion, Integer anoLanzamiento) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.anoLanzamiento = anoLanzamiento;
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

    public Integer getAnoLanzamiento() {
        return anoLanzamiento;
    }

    public void setAnoLanzamiento(Integer anoLanzamiento) {
        this.anoLanzamiento = anoLanzamiento;
    }
}