package com.dragonball.models;

public class Tecnica {
    
    private Long id;
    private String nombre;
    private String descripcion;
    private Integer nivelDano;
    
    public Tecnica() {
    }
    
    public Tecnica(Long id, String nombre, String descripcion, Integer nivelDano) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.nivelDano = nivelDano;
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

    public Integer getNivelDano() {
        return nivelDano;
    }

    public void setNivelDano(Integer nivelDano) {
        this.nivelDano = nivelDano;
    }
}