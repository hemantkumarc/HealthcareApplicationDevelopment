package com.drvolte.spring_server.service;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.drvolte.spring_server.config.UserAuthenticationProvider;
import com.drvolte.spring_server.models.Roles;
import com.drvolte.spring_server.models.WebSocketConnection;
import com.drvolte.spring_server.models.WebSocketMessage;
import jakarta.annotation.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Component
public class SocketHandler extends TextWebSocketHandler {
    private static final String SET_TOKEN_EVENT = "settoken";
    private final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());
    private final WebSocketConnection webSocketConnections;
    private final UserAuthenticationProvider jwtAuthProvider;


    public SocketHandler(WebSocketConnection webSocketConnections, UserAuthenticationProvider jwtAuthProvider) {
        System.out.println("Creating a new SocketHandler");
        this.webSocketConnections = webSocketConnections;
        this.jwtAuthProvider = jwtAuthProvider;
    }


    @Override
    public void handleTextMessage(@Nullable WebSocketSession session, @Nullable TextMessage message) throws IOException, NullPointerException {
        assert message != null;
        System.out.println("Got the message: " + message.getPayload());
        WebSocketMessage socketMessage = new WebSocketMessage(message);
        System.out.println("socketmessage " + socketMessage);
        if (SET_TOKEN_EVENT.equals(socketMessage.getEvent())) {
            handleSetTokenEvent(session, socketMessage);
            assert session != null;
            session.sendMessage(new TextMessage("CreatedToken"));
        } else {
            broadcastMessage(session, message);
        }
    }

    private void handleSetTokenEvent(WebSocketSession session, WebSocketMessage socketMessage) {
        webSocketConnections.getTokenToConnection().put(socketMessage.getToken(), session);
        webSocketConnections.getTokenToState().put(socketMessage.getToken(), "Connected");

        DecodedJWT decoder = jwtAuthProvider.getDecoded(socketMessage.getToken());
        Roles role = Roles.valueOf(decoder.getClaim("role").asString());

        webSocketConnections.getRoleToToken().computeIfAbsent(role, k -> new HashSet<>()).add(socketMessage.getToken());
    }

    private void broadcastMessage(WebSocketSession senderSession, TextMessage message) throws IOException {


        sessions.removeIf(webSocketSession -> !webSocketSession.isOpen());

        for (WebSocketSession webSocketSession : sessions) {
            if (!senderSession.getId().equals(webSocketSession.getId()) && webSocketSession.isOpen()) {
                webSocketSession.sendMessage(message);
            }
        }
    }

    @Override
    public void afterConnectionEstablished(@Nullable WebSocketSession session) throws UnsupportedOperationException {
        sessions.add(session);
    }
}