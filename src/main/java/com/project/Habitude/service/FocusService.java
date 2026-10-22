package com.project.Habitude.service;

import com.project.Habitude.dto.FocusRequestDTO;
import com.project.Habitude.dto.FocusResponseDTO;
import com.project.Habitude.dto.UpdateFocusRequestDTO;
import com.project.Habitude.model.Focus;
import com.project.Habitude.model.User;
import com.project.Habitude.repository.FocusRepository;
import com.project.Habitude.repository.UserRepository;
import jakarta.transaction.Transactional;
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
@CacheConfig(cacheNames = "focuses")
public class FocusService {

    private final FocusRepository focusRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    @CacheEvict(key = "#authentication.name")
    public FocusResponseDTO addFocus(FocusRequestDTO focusRequestDTO, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        Focus focus = new Focus();
        String name = focusRequestDTO.getName().trim().toLowerCase();
        focus.setName(name);
        focus.setUser(user);
        Focus saved = focusRepository.save(focus);
        return modelMapper.map(saved, FocusResponseDTO.class);
    }

    @Cacheable(key = "#authentication.name")
    public List<FocusResponseDTO> findFocus(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        List<Focus> focusList = focusRepository.findByUserId(user.getId());

        return focusList.stream().map(focus -> modelMapper.map(focus, FocusResponseDTO.class)).toList();
    }

    @Transactional
    @CacheEvict(key = "#authentication.name")
    public void delete(Authentication authentication, String name) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        String normalizedName = name.trim().toLowerCase();


        Focus focus = focusRepository.findByNameAndUserId(normalizedName, user.getId());
        if (focus == null) {
            throw new RuntimeException("No focus present with name: " + name);
        }

        focusRepository.delete(focus);
    }

    @Transactional
    @CacheEvict(key = "#authentication.name")
    public FocusResponseDTO update(UpdateFocusRequestDTO requestDTO, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        String oldName = requestDTO.getName().trim().toLowerCase();
        String targetNewName = requestDTO.getNewName().trim().toLowerCase();


        Focus focus = focusRepository.findByNameAndUserId(oldName, user.getId());
        if (focus == null) {
            throw new RuntimeException("No focus present with name: " + requestDTO.getName());
        }


        focus.setName(targetNewName);
        Focus saved = focusRepository.save(focus);
        return modelMapper.map(saved, FocusResponseDTO.class);
    }
}