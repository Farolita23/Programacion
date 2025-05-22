package com.clubnautico.service.exceptions;

public class SocioNotFoundException extends SocioException {
    public SocioNotFoundException(String string) {
        super("Socio con ID " + string + " no encontrado");
    }
}
