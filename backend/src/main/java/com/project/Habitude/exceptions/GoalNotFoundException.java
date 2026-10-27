package com.project.Habitude.exceptions;

public class GoalNotFoundException extends RuntimeException {
    public GoalNotFoundException(String message) {
        super(message);
    }
    public GoalNotFoundException(String message, Long id){
        super(message+id);
    }
}
