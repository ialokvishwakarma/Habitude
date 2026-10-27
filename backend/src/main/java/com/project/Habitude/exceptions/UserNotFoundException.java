package com.project.Habitude.exceptions;

public class UserNotFoundException extends  RuntimeException{

    public UserNotFoundException(String message){
        super(message);
    }
    public UserNotFoundException(String message, Long userId){
        super(message+userId);
    }

    public UserNotFoundException(String message, String email){
        super(message+email);
    }
}
