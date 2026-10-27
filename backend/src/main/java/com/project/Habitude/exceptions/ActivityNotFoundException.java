package com.project.Habitude.exceptions;

public class ActivityNotFoundException extends RuntimeException{
    public ActivityNotFoundException(String meassage, Long id){
        super(meassage +id);
    }
}
