package com.drvolte.spring_server.service;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.drvolte.spring_server.config.UserAuthenticationProvider;
import com.drvolte.spring_server.models.Roles;
import com.drvolte.spring_server.models.WebSocketConnection;
import com.drvolte.spring_server.models.WebSocketMessage;
import jakarta.annotation.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Component
public class WebSocketHandler extends TextWebSocketHandler {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketHandler.class);
    private static final String SET_TOKEN_EVENT = "settoken";
    private static final String SET_CONNECT_EVENT = "connect";

    private final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());
    private final WebSocketConnection webSocketConnections;
    private final UserAuthenticationProvider jwtAuthProvider;

    public WebSocketHandler(WebSocketConnection webSocketConnections, UserAuthenticationProvider jwtAuthProvider) {
        logger.info("Creating a new SocketHandler");
        this.webSocketConnections = webSocketConnections;
        this.jwtAuthProvider = jwtAuthProvider;
    }

    @Override
    public void handleTextMessage(@Nullable WebSocketSession sourceSession, @Nullable TextMessage message) {
        try {
            if (message == null) {
                logger.warn("Received a null message");
                return;
            }

            logger.info("Got the message: {}", message.getPayload());
            WebSocketMessage socketMessage = new WebSocketMessage(message);
            logger.info("socketmessage {}", socketMessage);

            if (SET_TOKEN_EVENT.equals(socketMessage.getEvent())) {
                handleSetTokenEvent(sourceSession, socketMessage);
                assert sourceSession != null;
                sendTextMessage(sourceSession, "CreatedToken");
            } else if (SET_CONNECT_EVENT.equals(socketMessage.getEvent())) {
                assert sourceSession != null;
                handleSetConnectEvent(sourceSession, socketMessage);
            } else {
                assert sourceSession != null;
                broadcastMessage(sourceSession, socketMessage);
            }
        } catch (IOException | NullPointerException e) {
            logger.error("Error handling WebSocket message", e);
        }
    }

    private void handleSetTokenEvent(WebSocketSession session, WebSocketMessage socketMessage) throws IOException {
        webSocketConnections.getTokenToConnection().put(socketMessage.getToken(), session);
        webSocketConnections.getTokenToState().put(socketMessage.getToken(), "Connected");
        webSocketConnections.getSessionIdToToken().put(session.getId(), socketMessage.getToken());

        DecodedJWT decoder = jwtAuthProvider.getDecoded(socketMessage.getToken());
        Roles role = Roles.valueOf(decoder.getClaim("role").asString());

        webSocketConnections.getRoleToToken().computeIfAbsent(role, k -> new HashSet<>()).add(socketMessage.getToken());
        
    }

    private void handleSetConnectEvent(WebSocketSession sourceSession, WebSocketMessage socketMessage) throws IOException {
        String sourceToken = webSocketConnections.getSessionIdToToken().get(sourceSession.getId());

        if (webSocketConnections.getTokenToTokenSet().containsKey(sourceToken)) {
            for (String destToken : webSocketConnections.getTokenToTokenSet().get(sourceToken)) {
                if (webSocketConnections.getTokenToConnection().containsKey(destToken)) {
                    WebSocketSession destSession = webSocketConnections.getTokenToConnection().get(destToken);
                    destSession.sendMessage(new TextMessage(socketMessage.getData()));
                } else {
                    sendTextMessage(sourceSession, "ConnectionError");
                }
            }
        } else if (webSocketConnections.getRoleToToken().containsKey(Roles.ROLE_COUNSELLOR)
                && !webSocketConnections.getRoleToToken().get(Roles.ROLE_COUNSELLOR).isEmpty()) {
            handleConnectForCounsellor(sourceSession, sourceToken);
        } else {
            handleNoCounsellorAvailable(sourceSession);
        }
    }

    private void handleConnectForCounsellor(WebSocketSession sourceSession, String sourceToken) throws IOException {
        for (String counsellorToken : webSocketConnections.getRoleToToken().get(Roles.ROLE_COUNSELLOR)) {
            if ("connected".equals(webSocketConnections.getTokenToState().get(counsellorToken))) {
                HashSet<String> temp = new HashSet<>();
                temp.add(counsellorToken);
                webSocketConnections.getTokenToTokenSet().put(sourceToken, temp);
                sourceSession.sendMessage(new TextMessage("ConnectedToCounsellor"));
                temp.clear();
                temp.add(sourceToken);
                webSocketConnections.getTokenToTokenSet().put(counsellorToken, temp);
                webSocketConnections.getTokenToConnection().get(counsellorToken).sendMessage(new TextMessage("newConnection"));
                return;
            }
        }
    }

    private void handleNoCounsellorAvailable(WebSocketSession sourceSession) throws IOException {
        if (sourceSession.isOpen()) {
            sendTextMessage(sourceSession, "NoCounsellorAvailable");
        } else {
            sourceSession.close();
        }
    }

    private void broadcastMessage(WebSocketSession sourceSession, WebSocketMessage socketMessage) throws IOException {
        String sourceToken = webSocketConnections.getSessionIdToToken().get(sourceSession.getId());
        if (webSocketConnections.getTokenToTokenSet().containsKey(sourceToken)) {
            for (String destToken : webSocketConnections.getTokenToTokenSet().get(sourceToken)) {
                if (webSocketConnections.getTokenToConnection().containsKey(destToken)) {
                    WebSocketSession destSession = webSocketConnections.getTokenToConnection().get(destToken);
                    destSession.sendMessage(new TextMessage(socketMessage.getData()));
                } else {
                    sendTextMessage(sourceSession, "ConnectionError");
                }
            }
        } else {
            sourceSession.sendMessage(new TextMessage("CreateAConnectionFirst"));
        }
    }

    private void sendTextMessage(WebSocketSession session, String payload) throws IOException {
        if (session.isOpen()) {
            session.sendMessage(new TextMessage(payload));
        } else {
            logger.warn("Attempted to send message to a closed session: {}", payload);
        }
    }

    @Override
    public void afterConnectionEstablished(@Nullable WebSocketSession session) {
        if (session != null) {
            sessions.add(session);
        }
    }
}