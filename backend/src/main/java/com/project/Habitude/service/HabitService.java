package com.project.Habitude.service;

import com.project.Habitude.dto.HabitRequestDTO;
import com.project.Habitude.dto.HabitResponseDTO;
import com.project.Habitude.model.Focus;
import com.project.Habitude.model.Habit;
import com.project.Habitude.model.HabitStatus;
import com.project.Habitude.model.User;
import com.project.Habitude.repository.FocusRepository;
import com.project.Habitude.repository.HabitRepository;
import com.project.Habitude.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@CacheConfig(cacheNames = "habits")
public class HabitService {
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final HabitRepository habitRepository;
    private final FocusRepository focusRepository;

    @CacheEvict(key = "#authentication.name")
    public HabitResponseDTO addHabit(@Valid HabitRequestDTO habitRequestDTO, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        String customUnit = habitRequestDTO.getCustomUnit();
        customUnit = customUnit.trim().toLowerCase();
        log.info("entry");
        Focus focus = focusRepository.findById(habitRequestDTO.getFocusId()).orElse(null);
        log.info("focusname {}",focus.getName());
        Habit habit = new Habit();
        String focusName = "";
        if(focus!=null){
            focusName = focus.getName();
        }
        log.info("focus setted");
        log.info("name focus {}",focus.getName());
        habit.setTitle(habitRequestDTO.getTitle());
        habit.setHabitType(habitRequestDTO.getHabitType());
        habit.setDescription(habitRequestDTO.getDescription());
        habit.setFocus(focus);
        habit.setUser(user);
        habit.setTargetValue(habitRequestDTO.getTargetValue());
        habit.setFrequency(habitRequestDTO.getFrequency());
        habit.setCustomUnit(customUnit);
        habit.setStatus(HabitStatus.ACTIVE);
        habit.setCurrentStreak(0);
        habit.setLongestStreak(0);
        Habit savedHabit = habitRepository.save(habit);
        log.info("Habit added successfully for user : {}",authentication.getName());
        HabitResponseDTO response = modelMapper.map(savedHabit,HabitResponseDTO.class);
        response.setFocusName(focusName);
        return response;
    }

    @Cacheable(key = "#authentication.name")
    public List<HabitResponseDTO> getAllHabit(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        List<Habit> habits = habitRepository.findByUserId(user.getId());
        return habits.stream().map(
                habit -> modelMapper.map(habit,HabitResponseDTO.class)).toList();
    }
}
