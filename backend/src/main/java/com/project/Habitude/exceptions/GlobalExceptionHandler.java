package com.project.Habitude.exceptions;


import com.project.Habitude.dto.ErrorResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleException(Exception ex){
        ErrorResponseDTO responseDTO = ErrorResponseDTO.builder()
                .message(ex.getMessage())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("INTERNAL_SERVER_ERROR")
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(
                responseDTO,
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidErrors(MethodArgumentNotValidException err){
        Map<String, String> errors = new HashMap<>();
        err.getBindingResult().getFieldErrors()
                .forEach(error->
                        errors.put(error.getField(), error.getDefaultMessage()));

        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleUserNotFound(UserNotFoundException u){
        ErrorResponseDTO response = ErrorResponseDTO.builder()
                .timeStamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND.value())
                .message(u.getMessage())
                .error("USER_NOT_FOUND")
                .build();
        return new ResponseEntity<>(
                response,
                HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ActivityNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleActivityNotFound(ActivityNotFoundException a){
        ErrorResponseDTO response = ErrorResponseDTO.builder()
                .timeStamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND.value())
                .message(a.getMessage())
                .error("ACTIVITY_NOT_FOUND")
                .build();
        return new ResponseEntity<>(
                response,
                HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(GoalNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleGoalNotFound(GoalNotFoundException ex){
        ErrorResponseDTO response = ErrorResponseDTO.builder()
                .timeStamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .error("GOAL_NOT_FOUND")
                .build();
        return new ResponseEntity<>(
                response,
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(AccessDeniedExceptionUser.class)
    public ResponseEntity<ErrorResponseDTO> handleAccess(AccessDeniedExceptionUser ex){
        ErrorResponseDTO response = ErrorResponseDTO.builder()
                .timeStamp(LocalDateTime.now())
                .status(HttpStatus.FORBIDDEN.value())
                .message(ex.getMessage())
                .error("Access Denied")
                .build();
        return new ResponseEntity<>(
                response,
                HttpStatus.FORBIDDEN
        );
    }

    @ExceptionHandler(WrongPasswordException.class)
    public ResponseEntity<ErrorResponseDTO> wrongPassword(WrongPasswordException ex){
        ErrorResponseDTO response = ErrorResponseDTO.builder()
                .timeStamp(LocalDateTime.now())
                .status(HttpStatus.UNAUTHORIZED.value())
                .message(ex.getMessage())
                .error("WRONG_PASSWORD")
                .build();
        return new ResponseEntity<>(
                response,
                HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDTO> userAlreadyExists(UserAlreadyExistsException ex){
        ErrorResponseDTO response = ErrorResponseDTO.builder()
                .timeStamp(LocalDateTime.now())
                .status(HttpStatus.CONFLICT.value())
                .message(ex.getMessage())
                .error("USER_ALREADY_EXIST")
                .build();
        return new ResponseEntity<>(
                response,
                HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(RefreshNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> refreshTokenNotFound(RefreshNotFoundException ex){
        ErrorResponseDTO response = ErrorResponseDTO.builder()
                .timeStamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .error("REFRESH_TOKEN_NOT_FOUND")
                .build();
        return new ResponseEntity<>(
                response,
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(UnSupportedOAuthProvideException.class)
    public ResponseEntity<ErrorResponseDTO> unSupportedOAuth2Provider(UnSupportedOAuthProvideException ex){
        ErrorResponseDTO response = ErrorResponseDTO.builder()
                .timeStamp(LocalDateTime.now())
                .status(HttpStatus.FORBIDDEN.value())
                .message(ex.getMessage())
                .error("UNSUPPORTED_OAUTH2_PROVIDER")
                .build();
        return new ResponseEntity<>(
                response,
                HttpStatus.NOT_FOUND
        );
    }



}
