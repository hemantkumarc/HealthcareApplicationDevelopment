package com.drvolte.spring_server.controller;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.drvolte.spring_server.config.UserAuthenticationProvider;
import com.drvolte.spring_server.dtos.CredentialsDto;
import com.drvolte.spring_server.dtos.UserDto;
import com.drvolte.spring_server.models.Roles;
import com.drvolte.spring_server.models.WebSocketConnection;
import com.drvolte.spring_server.service.FileStorageService;
import com.drvolte.spring_server.service.UserService;
import org.json.JSONArray;
import org.json.JSONObject;
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
    private final WebSocketConnection webSocketConnections;
    private final UserAuthenticationProvider jwtAuthProvider;

    public GeneralControllers(UserService userService, UserAuthenticationProvider userAuthProvider, WebSocketConnection webSocketConnections, UserAuthenticationProvider jwtAuthProvider, FileStorageService storageService) {
        this.userService = userService;
        this.userAuthProvider = userAuthProvider;
        this.webSocketConnections = webSocketConnections;
        this.jwtAuthProvider = jwtAuthProvider;
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

    @GetMapping("/onlinestatus")
    public ResponseEntity<String> getOnlineUsers() {
        JSONObject retJson = new JSONObject()
                .put(Roles.ROLE_COUNSELLOR + "_online", new JSONArray())
                .put(Roles.ROLE_SENIORDR + "_online", new JSONArray())
                .put(Roles.ROLE_COUNSELLOR + "_incall", new JSONArray())
                .put(Roles.ROLE_SENIORDR + "_incall", new JSONArray());

        System.out.println("this the webscoketconenction setRoletostatetotoken value: "
                + webSocketConnections.getRoleToStateToToken());
        if (webSocketConnections.getRoleToStateToToken().containsKey(Roles.ROLE_COUNSELLOR)
                && webSocketConnections.getRoleToStateToToken().get(Roles.ROLE_COUNSELLOR).containsKey("connected")
        ) {
            for (String token : webSocketConnections.getRoleToStateToToken().get(Roles.ROLE_COUNSELLOR).get("connected")) {
                System.out.println(token);
                try {
                    DecodedJWT decodedJWT = jwtAuthProvider.getDecoded(token);
                    Long id = decodedJWT.getClaim("id").asLong();
                    retJson.getJSONArray(Roles.ROLE_COUNSELLOR + "_online").put(id);
                } catch (JWTVerificationException e) {
                    System.out.println("token is expired" + e);
                }
            }
        } else {
            System.out.println("No counsellor in online state" + webSocketConnections.getRoleToStateToToken());
        }

        if (webSocketConnections.getRoleToStateToToken().containsKey(Roles.ROLE_COUNSELLOR)
                && webSocketConnections.getRoleToStateToToken().get(Roles.ROLE_COUNSELLOR).containsKey("incall")
        ) {
            for (String token : webSocketConnections.getRoleToStateToToken().get(Roles.ROLE_COUNSELLOR).get("incall")) {
                System.out.println(token);
                try {

                    DecodedJWT decodedJWT = jwtAuthProvider.getDecoded(token);
                    Long id = decodedJWT.getClaim("id").asLong();
                    retJson.getJSONArray(Roles.ROLE_COUNSELLOR + "_incall").put(id);
                } catch (JWTVerificationException e) {
                    System.out.println("token is expired" + e);
                }
            }
        } else {
            System.out.println("No counsellor in incall state" + webSocketConnections.getRoleToStateToToken());
        }

        if (webSocketConnections.getRoleToStateToToken().containsKey(Roles.ROLE_SENIORDR)
                && webSocketConnections.getRoleToStateToToken().get(Roles.ROLE_SENIORDR).containsKey("connected")
        ) {
            for (String token : webSocketConnections.getRoleToStateToToken().get(Roles.ROLE_SENIORDR).get("connected")) {
                System.out.println(token);
                try {

                    DecodedJWT decodedJWT = jwtAuthProvider.getDecoded(token);
                    Long id = decodedJWT.getClaim("id").asLong();
                    System.out.println("this is the id from token " + id);
                    System.out.println(decodedJWT);
                    System.out.println(token);
                    retJson.getJSONArray(Roles.ROLE_SENIORDR + "_online").put(id);
                } catch (JWTVerificationException e) {
                    System.out.println("token is expired" + e);
                }
            }
        } else {
            System.out.println("No SR_DR in online state" + webSocketConnections.getRoleToStateToToken());
        }

        if (webSocketConnections.getRoleToStateToToken().containsKey(Roles.ROLE_SENIORDR)
                && webSocketConnections.getRoleToStateToToken().get(Roles.ROLE_SENIORDR).containsKey("incall")
        ) {
            for (String token : webSocketConnections.getRoleToStateToToken().get(Roles.ROLE_SENIORDR).get("incall")) {
                System.out.println(token);
                try {

                    DecodedJWT decodedJWT = jwtAuthProvider.getDecoded(token);
                    Long id = decodedJWT.getClaim("id").asLong();
                    retJson.getJSONArray(Roles.ROLE_SENIORDR + "_incall").put(id);
                } catch (JWTVerificationException e) {
                    System.out.println("token is expired" + e);
                }
            }
        } else {
            System.out.println("No SE_DR in incall state" + webSocketConnections.getRoleToStateToToken());
        }
        System.out.println("this is retjson:" + retJson);
        return ResponseEntity.ok(retJson.toString());
    }
}