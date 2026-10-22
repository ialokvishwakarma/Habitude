package com.project.Habitude.service;

import com.project.Habitude.dto.GoalRequestDTO;
import com.project.Habitude.dto.GoalResponseDTO;
import com.project.Habitude.dto.GoalStatusRequest;
import com.project.Habitude.dto.UpdateGoalRequest;
import com.project.Habitude.exceptions.AccessDeniedExceptionUser;
import com.project.Habitude.exceptions.GoalNotFoundException;
import com.project.Habitude.model.Focus;
import com.project.Habitude.model.Goal;
import com.project.Habitude.model.User;
import com.project.Habitude.repository.FocusRepository;
import com.project.Habitude.repository.GoalRepository;
import com.project.Habitude.repository.UserRepository;
import jakarta.transaction.Transactional;
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
@CacheConfig(cacheNames = "goals")
public class GoalService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final GoalRepository goalRepository;
    private final FocusRepository focusRepository;


    @CacheEvict(key = "#authentication.name")
    public GoalResponseDTO createGoal(Authentication authentication, GoalRequestDTO requestDTO) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);



        String customUnit = requestDTO.getCustomUnit();
        customUnit = customUnit.trim().toLowerCase();

        Goal goal = modelMapper.map(requestDTO, Goal.class);
        Focus focus = focusRepository.findById(requestDTO.getFocusId()).orElse(null);
        String focusName = "";
        if(focus!=null){
            focusName = focus.getName();
        }
        goal.setId(null);
        goal.setUser(user);
        goal.setCustomUnit(customUnit);
        goal.setFocus(focus);
        goal.setTotalProgress(0.0);

        Goal savedGoal = goalRepository.save(goal);

        log.info("Goal created successfully");
        GoalResponseDTO response = modelMapper.map(savedGoal,GoalResponseDTO.class);
        response.setFocusName(focusName);

        return response;
    }

    @Cacheable(key = "#authentication.name")
    public List<GoalResponseDTO> getAllGoals(@Valid Authentication authentication)  {
        log.info("Loading data from Database");
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        Long userId = user.getId();


        log.info("Fetching Goals");
        List<Goal> goals = goalRepository.findByUserId(user.getId());
        if(goals.isEmpty()){
            throw new GoalNotFoundException("User do not have any goals");
        }

        return goals.stream()
                .map(goal -> modelMapper.map(goal, GoalResponseDTO.class))
                .toList();

    }

    @Transactional
    @CacheEvict(key = "#authentication.name")
    public void delete(@Valid Authentication authentication, Long id) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        Goal goal = goalRepository.findById(id).orElseThrow(
                () -> new GoalNotFoundException("Goal not found with Id : " + id)
        );

        if (!goal.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedExceptionUser("Access Denied");
        }

        goalRepository.deleteById(id);
        log.info("Goal Deleted");
    }

    @Transactional
    @CacheEvict(key = "#authentication.name")
    public GoalResponseDTO update(Long id, UpdateGoalRequest request, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        Goal goal = goalRepository.findById(id).orElseThrow(
                ()-> new GoalNotFoundException("Goal not found with Id : "+id)
        );
        if(!goal.getUser().getId().equals(user.getId())){
            throw new AccessDeniedExceptionUser("Access Denied");
        }
        Focus focus = focusRepository.findById(request.getFocusId()).orElse(null);

        if(focus!=null){
            goal.setFocus(focus);
        }
        System.out.println(request.getTitle());
        goal.setTitle(request.getTitle());
        goal.setDescription(request.getDescription());

        goal.setTargetValue(request.getTargetValue());
        goal.setStartDate(request.getStartDate());
        goal.setEndDate(request.getEndDate());
        System.out.println(request.getDescription());
        Goal updated = goalRepository.save(goal);
        log.info("Goal Updated");
        return modelMapper.map(updated,GoalResponseDTO.class);
    }

    @Transactional
    @CacheEvict(key = "#authentication.name")
    public GoalResponseDTO updateStatus(@Valid Long id, GoalStatusRequest statusRequest, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        Goal goal = goalRepository.findById(id).orElseThrow(
                ()-> new GoalNotFoundException("Goal not found with Id : ",id)
        );
        if(!goal.getUser().getId().equals(user.getId())){
            throw new AccessDeniedExceptionUser("Access Denied");
        }
        goal.setStatus(statusRequest.getStatus());

        Goal updated = goalRepository.save(goal);
        return modelMapper.map(updated,GoalResponseDTO.class);
    }
}
