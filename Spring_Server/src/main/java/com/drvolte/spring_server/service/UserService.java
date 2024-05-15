package com.drvolte.spring_server.service;

import com.drvolte.spring_server.dao.UserRepository;
import com.drvolte.spring_server.dtos.CredentialsDto;
import com.drvolte.spring_server.dtos.UserDto;
import com.drvolte.spring_server.entity.User;
import com.drvolte.spring_server.exceptions.AppException;
import com.drvolte.spring_server.mappers.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passowrdEncoderConfig;
    private final UserMapper userMapper;

    public UserDto login(CredentialsDto credentialsDto) {
        System.out.println("This is the username logging");
        User user = userRepository.findByUsername(credentialsDto.username())
                .orElseThrow(() -> new AppException("Username Not Found", HttpStatus.NOT_FOUND));
        System.out.println("inside the userservices" + user);
        if (passowrdEncoderConfig.matches(credentialsDto.password(), user.getPassword())) {
            return userMapper.touserDto(user);
        }
        throw new AppException("Invalid Password", HttpStatus.BAD_REQUEST);
    }
}