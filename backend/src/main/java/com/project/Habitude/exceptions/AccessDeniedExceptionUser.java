package com.project.Habitude.exceptions;

public class AccessDeniedExceptionUser extends RuntimeException {
    public AccessDeniedExceptionUser(String message) {
        super(message);
    }
}
