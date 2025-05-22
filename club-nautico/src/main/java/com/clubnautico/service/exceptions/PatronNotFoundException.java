package com.clubnautico.service.exceptions;

public class PatronNotFoundException extends PatronException {
    public PatronNotFoundException(String string) {
        super("Patron con ID " + string + " no encontrado");
    }
}
