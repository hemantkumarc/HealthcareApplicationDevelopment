package com.drvolte.spring_server.config;

import com.drvolte.spring_server.models.Roles;
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
                .addFilterBefore(new JwtAuthFilter(userAuthProvider), BasicAuthenticationFilter.class)
                .sessionManagement(customizer -> customizer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers(HttpMethod.POST, "/login", "/patients_register", "/mail/changePassword", "/mail/send/*").permitAll()
                        .requestMatchers("/socket").permitAll()
                        .requestMatchers("/hello").hasAnyRole(
                                Roles.PATIENT.toString(),
                                Roles.COUNSELLOR.toString(),
                                Roles.ADMIN.toString(),
                                Roles.SENIORDR.toString()
                        )
                        //.requestMatchers("").hasRole(Roles.ADMIN.toString())
                        .requestMatchers("/counsellor/**").hasRole(Roles.COUNSELLOR.toString())
                        .requestMatchers("/seniordr/**").hasRole(Roles.SENIORDR.toString())
                        .requestMatchers("/patient/**").hasRole(Roles.PATIENT.toString())
                        .requestMatchers("/patienthistory/**").hasRole(Roles.PATIENT.toString())
                        .anyRequest().authenticated());
        return http.build();
    }
}