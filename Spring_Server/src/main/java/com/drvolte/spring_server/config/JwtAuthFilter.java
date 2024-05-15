package com.drvolte.spring_server.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Configuration
public class JwtAuthFilter extends OncePerRequestFilter {


    private static final Logger logger = LoggerFactory.getLogger(JwtAuthFilter.class);
    private final UserAuthenticationProvider userAuthProvider;


    public JwtAuthFilter(UserAuthenticationProvider userAuthProvider) {
        this.userAuthProvider = userAuthProvider;
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        logger.info(request.getRequestURL().toString() + " from " + request.getRemoteAddr());
        String remoteAddr = request.getRemoteAddr();
        Integer remotePort = request.getRemotePort();
        if (header != null) {
            String[] authELements = header.split(" ");
            if (authELements.length == 2 && authELements[0].equals("Bearer")) {
                try {
                    SecurityContextHolder.getContext().setAuthentication(this.userAuthProvider.validateToken(authELements[1], remoteAddr, remotePort));

                } catch (RuntimeException e) {
                    SecurityContextHolder.clearContext();
                    throw e;
                }
            }
        }
        filterChain.doFilter(request, response);
    }
}