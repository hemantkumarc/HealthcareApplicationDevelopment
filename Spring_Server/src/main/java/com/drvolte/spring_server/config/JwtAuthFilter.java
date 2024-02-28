package com.drvolte.spring_server.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Configuration
public class JwtAuthFilter extends OncePerRequestFilter {


    private final UserAuthenticationProvider userAuthProvider;


    public JwtAuthFilter(UserAuthenticationProvider userAuthProvider) {
        this.userAuthProvider = userAuthProvider;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header != null) {
            String[] authELements = header.split(" ");
            if (authELements.length == 2 && authELements[0].equals("Bearer")) {
                System.out.println("Bearer " + authELements[1]);
                System.out.println("this is userauthProvider" + this.userAuthProvider);
                try {
                    SecurityContextHolder.getContext().setAuthentication(this.userAuthProvider.validateToken(authELements[1]));
                } catch (RuntimeException e) {
                    SecurityContextHolder.clearContext();
                    throw e;
                }
            }
        }
        filterChain.doFilter(request, response);
    }
}
