package com.clubnautico.service.exceptions;

public class BarcoNotFoundException extends BarcoException {
    public BarcoNotFoundException(String string) {
        super("Barco con ID " + string + " no encontrado");
    }
}
