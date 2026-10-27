package com.project.Habitude.controller;

import com.project.Habitude.dto.ActivityRequest;
import com.project.Habitude.dto.ActivityResponse;
import com.project.Habitude.dto.ActivityUpdateRequestDTO;
import com.project.Habitude.service.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/activities")
@Slf4j
public class ActivityController {


    private final ActivityService activityService;

    @PostMapping("/track")
    public ResponseEntity<ActivityResponse> addActivity(@Valid
                                                            @RequestBody ActivityRequest activityRequest,
                                                            Authentication authentication
                                                        ){
        log.info("Track Activities Request");
        log.info("Entry Controller");
        return ResponseEntity.ok(activityService.add(activityRequest,authentication));
    }

    @GetMapping("/my-activities")
    public ResponseEntity<List<ActivityResponse>> getActivities(@Valid
                                                                Authentication authentication,
                                                                @RequestParam(defaultValue = "0") int page,
                                                                @RequestParam(defaultValue = "10") int size){
        log.info("My Activity List Request");
        return ResponseEntity.ok(activityService.findByUser(authentication));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteActivity(@Valid @PathVariable Long id, Authentication authentication){
        log.info("Delete Activity Request");
        activityService.deleteActivityById(id,authentication);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ActivityResponse> updateActivity(@Valid
                                                               @PathVariable Long id,
                                                               @RequestBody ActivityUpdateRequestDTO updateRequestDTO,
                                                           Authentication authentication){
        log.info("Update Activity Request");
        return ResponseEntity.ok(activityService.updateActivity(id,updateRequestDTO, authentication));
    }
}
