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
import org.springframework.http.MediaType;
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

    @PostMapping("/logoutuser")
    public ResponseEntity<String> logout(@RequestBody String token) {
        System.out.println("this is the token to invalidate " + token);
        token = token.substring(1, token.length() - 1);
        String sessionId = webSocketConnections.getTokenToSessionId().get(token);
        webSocketConnections.getTokenToSessionId().remove(token);
        webSocketConnections.getSessionIdToToken().remove(sessionId);
        try {
            DecodedJWT decodedJWT = jwtAuthProvider.getDecoded(token);
            Roles role = Roles.valueOf(decodedJWT.getClaim("role").asString());
            Long id = decodedJWT.getClaim("id").asLong();
            System.out.println(("this is the role and id for the token " + role + " " + id));
            for (String state : webSocketConnections.getRoleToStateToToken().get(role).keySet()) {
                webSocketConnections.getRoleToStateToToken().get(role).get(state).remove(token);
            }

            String counsellorToken, srDrToken, patientToken;
            if (webSocketConnections.getTokenToRoleToToken().containsKey(token)) {
                counsellorToken = webSocketConnections.getTokenToRoleToToken().get(token).getOrDefault(Roles.ROLE_COUNSELLOR, null);
                srDrToken = webSocketConnections.getTokenToRoleToToken().get(token).getOrDefault(Roles.ROLE_SENIORDR, null);
                patientToken = webSocketConnections.getTokenToRoleToToken().get(token).getOrDefault(Roles.ROLE_PATIENT, null);
                webSocketConnections.getTokenToRoleToToken().remove(token);
                System.out.println("removing the token from tokentoroletotoken for logout:" + patientToken + " \n" + counsellorToken + "\n" + srDrToken);
                if (patientToken != null)
                    webSocketConnections.getTokenToRoleToToken().remove(patientToken);
                if (counsellorToken != null)
                    webSocketConnections.getTokenToRoleToToken().remove(counsellorToken);
                if (srDrToken != null)
                    webSocketConnections.getTokenToRoleToToken().remove(srDrToken);
            }
            webSocketConnections.getRoleToIdToToken().get(role).remove(id);

        } catch (JWTVerificationException ignored) {
            System.out.println("Token validation erro");
        }

        jwtAuthProvider.getInvalidTokens().add(token);
        return ResponseEntity.ok("Done");
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
                .put(Roles.ROLE_SENIORDR + "_incall", new JSONArray())
                .put(Roles.ROLE_COUNSELLOR + "_busy", new JSONArray())
                .put(Roles.ROLE_SENIORDR + "_busy", new JSONArray())
                .put(Roles.ROLE_PATIENT + "_online", new JSONArray())
                .put(Roles.ROLE_PATIENT + "_incall", new JSONArray())
                .put("inCallWaiting", new JSONArray())
                .put("missedCalls", new JSONArray())
                .put("counsellorCalls", new JSONObject());

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

        if (webSocketConnections.getRoleToStateToToken().containsKey(Roles.ROLE_SENIORDR)
                && webSocketConnections.getRoleToStateToToken().get(Roles.ROLE_SENIORDR).containsKey("busy")
        ) {
            for (String token : webSocketConnections.getRoleToStateToToken().get(Roles.ROLE_SENIORDR).get("busy")) {
                System.out.println(token);
                try {

                    DecodedJWT decodedJWT = jwtAuthProvider.getDecoded(token);
                    Long id = decodedJWT.getClaim("id").asLong();
                    retJson.getJSONArray(Roles.ROLE_SENIORDR + "_busy").put(id);
                } catch (JWTVerificationException e) {
                    System.out.println("token is expired" + e);
                }
            }
        } else {
            System.out.println("No SE_DR in busy state" + webSocketConnections.getRoleToStateToToken());
        }

        if (webSocketConnections.getRoleToStateToToken().containsKey(Roles.ROLE_PATIENT)
                && webSocketConnections.getRoleToStateToToken().get(Roles.ROLE_PATIENT).containsKey("connected")
        ) {
            for (String token : webSocketConnections.getRoleToStateToToken().get(Roles.ROLE_PATIENT).get("connected")) {
                System.out.println(token);
                try {
                    DecodedJWT decodedJWT = jwtAuthProvider.getDecoded(token);
                    Long id = decodedJWT.getClaim("id").asLong();
                    retJson.getJSONArray(Roles.ROLE_PATIENT + "_online").put(id);
                } catch (JWTVerificationException e) {
                    System.out.println("token is expired" + e);
                }
            }
        } else {
            System.out.println("No patient in online state" + webSocketConnections.getRoleToStateToToken());
        }

        if (webSocketConnections.getRoleToStateToToken().containsKey(Roles.ROLE_PATIENT)
                && webSocketConnections.getRoleToStateToToken().get(Roles.ROLE_PATIENT).containsKey("incall")
        ) {
            for (String token : webSocketConnections.getRoleToStateToToken().get(Roles.ROLE_PATIENT).get("incall")) {
                System.out.println(token);
                try {

                    DecodedJWT decodedJWT = jwtAuthProvider.getDecoded(token);
                    Long id = decodedJWT.getClaim("id").asLong();
                    retJson.getJSONArray(Roles.ROLE_PATIENT + "_incall").put(id);
                } catch (JWTVerificationException e) {
                    System.out.println("token is expired" + e);
                }
            }
        } else {
            System.out.println("No patient in incall state" + webSocketConnections.getRoleToStateToToken());
        }

        if (webSocketConnections.getRoleToStateToToken().containsKey(Roles.ROLE_COUNSELLOR)
                && webSocketConnections.getRoleToStateToToken().get(Roles.ROLE_COUNSELLOR).containsKey("busy")
        ) {
            for (String token : webSocketConnections.getRoleToStateToToken().get(Roles.ROLE_COUNSELLOR).get("busy")) {
                System.out.println(token);
                try {

                    DecodedJWT decodedJWT = jwtAuthProvider.getDecoded(token);
                    Long id = decodedJWT.getClaim("id").asLong();
                    retJson.getJSONArray(Roles.ROLE_COUNSELLOR + "_busy").put(id);
                } catch (JWTVerificationException e) {
                    System.out.println("token is expired" + e);
                }
            }
        } else {
            System.out.println("No counsellor in busy state" + webSocketConnections.getRoleToStateToToken());
        }


        for (String sourceToken : webSocketConnections.getTokenToRoleToToken().keySet()) {
            try {

                DecodedJWT decodedJWT = jwtAuthProvider.getDecoded(sourceToken);
                if (decodedJWT.getClaim("role").asString().equals(Roles.ROLE_COUNSELLOR.toString())) {
                    Long counsellorId = decodedJWT.getClaim("id").asLong();
                    if (webSocketConnections.getTokenToRoleToToken().get(sourceToken).containsKey(Roles.ROLE_PATIENT)) {
                        String patientToken = webSocketConnections.getTokenToRoleToToken().get(sourceToken).get(Roles.ROLE_PATIENT);
                        DecodedJWT patientDecodedJWT = jwtAuthProvider.getDecoded(patientToken);
                        Long patientId = patientDecodedJWT.getClaim("id").asLong();
                        retJson.getJSONObject("counsellorCalls").put(String.valueOf(counsellorId), patientId);
                    }
                }
            } catch (JWTVerificationException e) {
                System.out.println("token is expired" + e);
            }
        }

        for (Long patientId : webSocketConnections.getWaitQueue()) {
            retJson.getJSONArray("inCallWaiting").put(patientId);
        }
        for (Long patientId : webSocketConnections.getMissedCalls()) {
            retJson.getJSONArray("missedCalls").put(patientId);
        }
        System.out.println("this is retjson:" + retJson);
        // retJson.put("webSocketConnection", webSocketConnections);
        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(retJson.toString());
    }

    @GetMapping("/webSocketConnections")
    public ResponseEntity<String> getWebSocketConnections() {
        JSONObject retJson = new JSONObject()
                .put("tokenToSessionId", new JSONObject(webSocketConnections.getTokenToSessionId()))
                .put("sessionIdToToken", new JSONObject(webSocketConnections.getSessionIdToToken()))
                .put("roleToStateToToken", new JSONObject(webSocketConnections.getRoleToStateToToken()))
                .put("tokenToRoleToToken", new JSONObject(webSocketConnections.getTokenToRoleToToken()))
                .put("roleToIdToToken", new JSONObject(webSocketConnections.getRoleToIdToToken()))
                .put("waitQueue", new JSONObject(webSocketConnections.getWaitQueue()))
                .put("missedCalls", new JSONObject(webSocketConnections.getMissedCalls()));
        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(retJson.toString());
    }
}