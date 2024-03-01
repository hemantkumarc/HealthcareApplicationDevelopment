package com.drvolte.spring_server.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.drvolte.spring_server.dtos.PatientResponseDto;
import com.drvolte.spring_server.dtos.UserDto;
import jakarta.annotation.PostConstruct;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Component
public class UserAuthenticationProvider {

    private String secretKey = "SECRET";
    private Algorithm algorithm;

    private JWTVerifier verifier;

    @PostConstruct
    public void init() {
        this.secretKey = Base64.getEncoder().encodeToString(this.secretKey.getBytes());
        this.algorithm = Algorithm.HMAC256(secretKey);
        this.verifier = JWT.require(algorithm)
                .build();
    }

    public String createToken(UserDto user) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + 3600000); // 1 hour


        return JWT.create()
                .withSubject(user.getUsername())
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .withClaim("firstName", user.getFirstName())
                .withClaim("lastName", user.getLastName())
                .withClaim("role", user.getRole())
                .sign(algorithm);
    }

    public Authentication validateToken(String token) throws JWTVerificationException {


        DecodedJWT decoded = verifier.verify(token);
        Set<String> roles = new HashSet<String>();
        roles.add(decoded.getClaim("role").asString());
        if (roles.contains("ROLE_PATIENT")) {
            PatientResponseDto patientResponseDto = PatientResponseDto.builder()
                    .id(decoded.getKeyId())
                    .token(token)
                    .phnumber(decoded.getSubject())
                    .role(decoded.getClaim("role").asString())
                    .build();
            return new UsernamePasswordAuthenticationToken(patientResponseDto, null, AuthorityUtils.createAuthorityList(roles.toArray(new String[0])));
        }
        UserDto user = UserDto.builder()
                .username(decoded.getSubject())
                .firstName(decoded.getClaim("firstName").asString())
                .lastName(decoded.getClaim("lastName").asString())
                .role(decoded.getClaim("role").asString())
                .build();
        System.out.println("roles::" + roles);
        return new UsernamePasswordAuthenticationToken(user, null, AuthorityUtils.createAuthorityList(roles.toArray(new String[0])));
    }

    public DecodedJWT getDecoded(String token) throws JWTVerificationException {
        return verifier.verify(token);
    }


    public String createTokenForPatient(PatientResponseDto patientResponseDto) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + 3600000); // 1 hour


        return JWT.create()
                .withSubject(patientResponseDto.getPhnumber())
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .withKeyId(patientResponseDto.getId())
                .withClaim("role", "ROLE_PATIENT")
                .sign(algorithm);
    }

}