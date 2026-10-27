package com.project.Habitude.controller;


import com.project.Habitude.dto.HabitRequestDTO;
import com.project.Habitude.dto.HabitResponseDTO;
import com.project.Habitude.service.HabitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/habit")
@Slf4j
public class HabitController {

    private final HabitService habitService;

    @PostMapping("/add")
    public ResponseEntity<HabitResponseDTO> addHabit(@Valid
                                                     @RequestBody HabitRequestDTO habitRequestDTO,
                                                     Authentication authentication){
        log.info("Habit add request");
        return ResponseEntity.ok(habitService.addHabit(habitRequestDTO,authentication));
    }

    @GetMapping("/my-habits")
    public ResponseEntity<List<HabitResponseDTO>> getHabits(Authentication authentication){
        log.info("Habit request");
        return ResponseEntity.ok(habitService.getAllHabit(authentication));
    }
}
