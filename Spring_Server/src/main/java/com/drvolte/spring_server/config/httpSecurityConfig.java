package com.drvolte.spring_server.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class httpSecurityConfig {

    @Autowired
    private UserAuthenticationProvider userAuthProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)
                .addFilterBefore(new JwtAuthFilter(userAuthProvider), BasicAuthenticationFilter.class)
                .sessionManagement(customizer -> customizer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers(HttpMethod.POST, "/login").permitAll()
                        .requestMatchers("/socket").permitAll()
                        .requestMatchers("/counsellor/**").hasRole("COUNSELLOR")
                        .requestMatchers("/seniordr/**").hasRole("SENIORDR")
                        .requestMatchers("/patient/**").hasRole("PATIENT")
                        .requestMatchers("/patienthistory/**").hasRole("PATIENT")
                        .requestMatchers("/patient/**").hasRole("PATIENT")
                        .anyRequest().authenticated());
        return http.build();
    }
}