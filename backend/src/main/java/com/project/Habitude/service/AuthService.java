package com.project.Habitude.service;

import com.project.Habitude.dto.LoginRequest;
import com.project.Habitude.dto.LoginResponse;
import com.project.Habitude.dto.UserRequest;
import com.project.Habitude.dto.UserResponse;
import com.project.Habitude.exceptions.UserAlreadyExistsException;
import com.project.Habitude.exceptions.UserNotFoundException;
import com.project.Habitude.exceptions.WrongPasswordException;
import com.project.Habitude.model.AuthProviderType;
import com.project.Habitude.model.RefreshToken;
import com.project.Habitude.model.User;
import com.project.Habitude.model.UserRole;
import com.project.Habitude.repository.RefreshTokenRepository;
import com.project.Habitude.repository.UserRepository;
import com.project.Habitude.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService
{

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepository;

    public UserResponse register(UserRequest userRequest) {
        UserRole role = userRequest.getRole() !=null ? userRequest.getRole() : UserRole.USER;
        User userCheck = userRepository.findByEmail(userRequest.getEmail());
        if(userCheck!=null){
            log.warn("Duplicate user registration attempt for email: {}",userCheck.getEmail());
        throw new UserAlreadyExistsException("User already exists with  this email : ");
        }
        User user = modelMapper.map(userRequest, User.class);
        user.setRole(role);
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        userRepository.save(user);
        log.info("User '{}' register successfully",user.getEmail());
        return modelMapper.map(user, UserResponse.class);
    }


    public LoginResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail());
        if(user == null){
            log.error("User not exists with email: {}",loginRequest.getEmail());
            throw new UserNotFoundException("User not found with email : ",loginRequest.getEmail() );
        }
        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())){
            log.warn("Password not match for user: {}",loginRequest.getEmail());
            throw new WrongPasswordException("Password is not matched");
        }
        RefreshToken refreshToken = refreshTokenRepository.findByUserId(user.getId());
        if(refreshToken==null) refreshToken = refreshTokenService.createRefreshToken(user.getEmail());
        refreshTokenRepository.delete(refreshToken);
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getEmail());
        String token = jwtUtils.generateTokenFromEmail(user.getEmail(),user.getRole().toString());
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(token);
        loginResponse.setRefreshToken(newRefreshToken.getToken());
        modelMapper.map(user,loginResponse);
        log.info("User {} logged in successfully",loginRequest.getEmail());
        return loginResponse;
    }

    public LoginResponse handleOauth2LoginRequest(OAuth2User oAuth2User, String registrationId){
//        AuthProviderType providerType = jwtUtils.getProviderTypeFromRegistrationId(registrationId);
//        String providerId = jwtUtils.getProviderIdFromOAuth2User(oAuth2User, registrationId);

//        User user = userRepository.fingByProviderIdAndProviderType(providerId,providerType).orElse(null);

        String email = oAuth2User.getAttribute("email");
        User existingUser = userRepository.findByEmail(email);
        if(existingUser == null){
            existingUser = new User();
            existingUser.setEmail(email);
            existingUser.setRole(UserRole.USER);
            existingUser.setFirstName(oAuth2User.getAttribute("name"));
            existingUser.setProviderType(AuthProviderType.GOOGLE);
            userRepository.save(existingUser);
        }
        log.info("OAuth authentication successful for user {}",existingUser.getEmail());
        return createLoginResponse(existingUser);
    }

    private LoginResponse createLoginResponse(User user){
        String accessToken = jwtUtils.generateTokenFromEmail(user.getEmail(), String.valueOf(user.getRole()));
        RefreshToken refreshObject = refreshTokenService.createRefreshToken(user.getEmail());
        String refreshToken = refreshObject.getToken();
        LoginResponse response = new LoginResponse();
        response.setToken(accessToken);
        response.setRefreshToken(refreshToken);
        return response;

    }
}
