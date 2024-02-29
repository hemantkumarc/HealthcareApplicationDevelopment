package com.drvolte.spring_server.config;

import com.drvolte.spring_server.models.WebSocketConnection;
import com.drvolte.spring_server.service.SocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final WebSocketConnection webSocketConnections;
    private final UserAuthenticationProvider jwtAuthProvider;

    @Autowired
    public WebSocketConfig(WebSocketConnection webSocketConnections, UserAuthenticationProvider jwtAuthProvider) {
        this.webSocketConnections = webSocketConnections;
        this.jwtAuthProvider = jwtAuthProvider;
    }


    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        System.out.println("Adding a Websocket Handler");
        registry.addHandler(new SocketHandler(this.webSocketConnections, this.jwtAuthProvider), "/socket").setAllowedOrigins("*");
    }
}