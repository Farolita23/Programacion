package com.clubnautico.service.exceptions;

public class SalidaNotFoundException extends SocioException {
    public SalidaNotFoundException(String string) {
        super("Salida con ID " + string + " no encontrado");
    }
}
