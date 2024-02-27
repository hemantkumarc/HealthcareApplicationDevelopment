package com.drvolte.spring_server.controller;

import com.drvolte.spring_server.dtos.CredentialsDto;
import com.drvolte.spring_server.models.UserDto;
import com.drvolte.spring_server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class GeneralControllers {


    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody CredentialsDto credentialsdto) {

        UserDto user = userService.login(credentialsdto);
        return ResponseEntity.ok(user);
    }
}
