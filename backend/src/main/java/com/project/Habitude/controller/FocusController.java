package com.project.Habitude.controller;

import com.project.Habitude.dto.UpdateFocusRequestDTO;
import com.project.Habitude.dto.FocusRequestDTO;
import com.project.Habitude.dto.FocusResponseDTO;
import com.project.Habitude.dto.UpdateFocusRequestDTO;
import com.project.Habitude.service.FocusService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/focus")
@Slf4j
public class FocusController {
    private final FocusService focusService;

    @PostMapping("/add")
    public ResponseEntity<FocusResponseDTO> postFocus(@RequestBody FocusRequestDTO focusRequestDTO, Authentication authentication){
        return ResponseEntity.ok(focusService.addFocus(focusRequestDTO,authentication));
    }

    @GetMapping("/my-focus")
    public ResponseEntity<List<FocusResponseDTO>> getFocus(Authentication authentication){
        return ResponseEntity.ok(focusService.findFocus(authentication));
    }

    @DeleteMapping("/delete/{name}")
    public ResponseEntity<Void> deleteFocus(Authentication authentication,@PathVariable String name){
         focusService.delete(authentication,name);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update")
    public ResponseEntity<FocusResponseDTO> updateFocus(@RequestBody UpdateFocusRequestDTO requestDTO, Authentication authentication){
        return ResponseEntity.ok(focusService.update(requestDTO,authentication));

    }
}
