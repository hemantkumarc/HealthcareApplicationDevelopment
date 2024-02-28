package com.drvolte.spring_server.controller;

import com.drvolte.spring_server.config.UserAuthenticationProvider;
import com.drvolte.spring_server.dtos.CredentialsDto;
import com.drvolte.spring_server.models.UserDto;
import com.drvolte.spring_server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GeneralControllers {

    @Autowired
    private final UserService userService;
    @Autowired
    private final UserAuthenticationProvider userAuthProvider;

    public GeneralControllers(UserService userService, UserAuthenticationProvider userAuthProvider) {
        this.userService = userService;
        this.userAuthProvider = userAuthProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody CredentialsDto credentialsdto) {
        System.out.println(credentialsdto);
        UserDto user = userService.login(credentialsdto);
        System.out.println("userdto from login" + user);
        user.setToken(userAuthProvider.createToken(user));
        System.out.println(user);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/hello")
    public ResponseEntity<String> sayHello() {
        return ResponseEntity.ok("Hello brother");
    }


    @GetMapping("/counsellor")
    public ResponseEntity<String> sayHelloconsellor() {
        return ResponseEntity.ok("Hello brother counsellor");
    }


    @GetMapping("/patient")
    public ResponseEntity<String> sayHellopatient() {
        return ResponseEntity.ok("Hello brother patient");
    }
}
