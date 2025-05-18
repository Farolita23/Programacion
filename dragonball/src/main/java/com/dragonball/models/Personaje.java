package com.dragonball.models;

import java.util.Date;

public class Personaje {
    
    private Long id;
    private String nombre;
    private String raza;
    private Double nivelPoder;
    private Boolean esHeroe;
    private Date fechaNacimiento;
    private String biografia;
    private String imagenUrl;
    
    public Personaje() {
    }
    
    public Personaje(Long id, String nombre, String raza, Double nivelPoder, Boolean esHeroe, 
                  Date fechaNacimiento, String biografia, String imagenUrl) {
        this.id = id;
        this.nombre = nombre;
        this.raza = raza;
        this.nivelPoder = nivelPoder;
        this.esHeroe = esHeroe;
        this.fechaNacimiento = fechaNacimiento;
        this.biografia = biografia;
        this.imagenUrl = imagenUrl;
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

    public String getRaza() {
        return raza;
    }

    public void setRaza(String raza) {
        this.raza = raza;
    }

    public Double getNivelPoder() {
        return nivelPoder;
    }

    public void setNivelPoder(Double nivelPoder) {
        this.nivelPoder = nivelPoder;
    }

    public Boolean getEsHeroe() {
        return esHeroe;
    }

    public void setEsHeroe(Boolean esHeroe) {
        this.esHeroe = esHeroe;
    }

    public Date getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(Date fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getBiografia() {
        return biografia;
    }

    public void setBiografia(String biografia) {
        this.biografia = biografia;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }
}