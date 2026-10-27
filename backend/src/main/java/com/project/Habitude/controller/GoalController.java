package com.project.Habitude.controller;

import com.project.Habitude.dto.GoalRequestDTO;
import com.project.Habitude.dto.GoalResponseDTO;
import com.project.Habitude.dto.GoalStatusRequest;
import com.project.Habitude.dto.UpdateGoalRequest;
import com.project.Habitude.service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/goals")
@Slf4j
public class GoalController {
    private final GoalService goalService;

    @PostMapping("/add")
    public ResponseEntity<GoalResponseDTO> addGoal(@Valid
                                                       Authentication authentication,
                                                       @RequestBody GoalRequestDTO requestDTO) {
        log.info("Add Goal Request");
        return ResponseEntity.ok(goalService.createGoal(authentication,requestDTO));
    }

    @GetMapping("/my-goals")
    public ResponseEntity<List<GoalResponseDTO>> getAllGoals(
            @Valid
            Authentication authentication
    ){
        log.info("My Goal List Request");
        return ResponseEntity.ok(goalService.getAllGoals(authentication));
    }

   @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteGoal(@Valid
                                           Authentication authentication,
                                           @PathVariable Long id){
        log.info("Delete Goal Request");
        goalService.delete(authentication,id);
        return ResponseEntity.noContent().build();
   }

   @PutMapping("/update/{id}")
    public ResponseEntity<GoalResponseDTO> updateGoal(@Valid
                                                         @PathVariable  Long id,
                                                      @RequestBody UpdateGoalRequest request,
                                                      Authentication authentication){
        log.info("Update Goal Request");
        return ResponseEntity.ok(goalService.update(id,request,authentication));
   }

   @PatchMapping("/status/{id}")
    public ResponseEntity<GoalResponseDTO> updateStatus(
            @Valid
            @PathVariable Long id,
            Authentication authentication,
            @RequestBody GoalStatusRequest statusRequest
   ){
        log.info("Update Status Request");
        return ResponseEntity.ok(goalService.updateStatus(id,statusRequest,authentication));
   }

}
