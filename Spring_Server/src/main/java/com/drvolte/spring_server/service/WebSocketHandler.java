package com.drvolte.spring_server.service;

import com.auth0.jwt.exceptions.JWTVerificationException;
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
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

@Component
public class WebSocketHandler extends TextWebSocketHandler {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketHandler.class);
    private static final String SET_TOKEN_EVENT = "settoken";
    private static final String SET_CONNECT_EVENT = "connect";
    private static final String STATE_CONNECTED = "connected";
    private static final String STATE_DISCONNECT = "disconnect";
    private static final String STATE_INCALL = "incall";
    private final Map<String, WebSocketSession> sessions = Collections.synchronizedMap(new HashMap<>());
    private final WebSocketConnection webSocketConnections;
    private final UserAuthenticationProvider jwtAuthProvider;
    private final WebSocketMessage tempWebsocketMessage;

    public WebSocketHandler(WebSocketConnection webSocketConnections, UserAuthenticationProvider jwtAuthProvider) {
        logger.info("Creating a new SocketHandler");
        this.webSocketConnections = webSocketConnections;
        this.jwtAuthProvider = jwtAuthProvider;
        this.tempWebsocketMessage = new WebSocketMessage();
    }

    @Override
    public void handleTextMessage(@Nullable WebSocketSession sourceSession, @Nullable TextMessage message)
            throws IOException {
        try {
            if (message == null) {
                logger.warn("Received a null message");
                return;
            }

            logger.info("Got the message: {}", message.getPayload());
            WebSocketMessage socketMessage = new WebSocketMessage(message);
            logger.info("socketmessage {}", socketMessage);

            if (SET_TOKEN_EVENT.equals(socketMessage.getEvent())) {
                logger.info("its an setToken event");
                assert sourceSession != null;
                handleSetTokenEvent(sourceSession, socketMessage);
            } else if (SET_CONNECT_EVENT.equals(socketMessage.getEvent())) {
                logger.info("its an connect event");
                assert sourceSession != null;
                handleSetConnectEvent(sourceSession, socketMessage);
            } else {
                logger.info("broadcasting");
                assert sourceSession != null;
                forwardMessage(sourceSession, socketMessage);
            }
        } catch (JWTVerificationException e) {
            logger.error("JWTVerificationException occuered");
            assert sourceSession != null;
            sendTextMessage(sourceSession, tempWebsocketMessage.setItems("Invalid JWT token", "reply", "").toString());
        } catch (IOException | NullPointerException e) {
            logger.error("Error handling WebSocket message", e);
        }
    }

    private void handleSetTokenEvent(WebSocketSession session, WebSocketMessage socketMessage) throws IOException {
        System.out.println(webSocketConnections);
        /*
         * - when any client sends the set token request
         * - set the session to token and vice versa
         * - set the role to state to token for every one
         */
        this.webSocketConnections.getSessionIdToToken().put(session.getId(), socketMessage.getToken());
        this.webSocketConnections.getTokenToSessionId().put(socketMessage.getToken(), session.getId());
        try {
            DecodedJWT decodedJWT = jwtAuthProvider.getDecoded(socketMessage.getToken());
            Roles role = Roles.valueOf(decodedJWT.getClaim("role").asString());
            if (webSocketConnections.getRoleToStateToToken().containsKey(role)) {
                if (webSocketConnections.getRoleToStateToToken().get(role).containsKey(STATE_CONNECTED)) {
                    webSocketConnections.getRoleToStateToToken().get(role).get(STATE_CONNECTED)
                            .add(socketMessage.getToken());
                } else {
                    HashSet<String> set = new HashSet<>();
                    set.add(socketMessage.getToken());
                    webSocketConnections.getRoleToStateToToken().get(role).put(STATE_CONNECTED, set);
                }
            } else {
                HashSet<String> set = new HashSet<>();
                set.add(socketMessage.getToken());
                Map<String, HashSet<String>> map = new HashMap<>();
                map.put(STATE_CONNECTED, set);
                webSocketConnections.getRoleToStateToToken().put(role, map);
            }
            logger.info("added the token " + webSocketConnections.getSessionIdToToken());
            logger.info("added the session " + webSocketConnections.getTokenToSessionId());
            logger.info("added the state map" + webSocketConnections.getRoleToStateToToken());
            sendTextMessage(session, tempWebsocketMessage.setItems("addedToken", "reply", "").toString());
        } catch (JWTVerificationException e) {
            logger.error("JWTVerificationException occuered");
            sendTextMessage(session, tempWebsocketMessage.setItems("Invalid JWT token", "reply", "").toString());
        } catch (Exception e) {
            logger.error("Some errror occured" + e);
            sendTextMessage(session, tempWebsocketMessage.setItems("Some ERROR", "reply", "").toString());
        }
    }

    private void handleSetConnectEvent(WebSocketSession sourceSession, WebSocketMessage socketMessage)
            throws IOException {
        /*
         * - when patient sends to connect (initiates the call) token to token set must
         * be updated or set accordingly
         * - check for available counsellor and update the token to token set
         * - based on the result reply the patient and counsellor
         */
        String destToken = getAvailableCounsellorToken();

        if (destToken != null) {
            updateTheSate(destToken, STATE_CONNECTED, STATE_INCALL);
            addTokenToTokenSet(
                    webSocketConnections.getSessionIdToToken().get(sourceSession.getId()), destToken);
            addTokenToTokenSet(
                    destToken,
                    webSocketConnections.getSessionIdToToken().get(sourceSession.getId())

            );
            sendTextMessage(sourceSession,
                    tempWebsocketMessage.setItems("CounsellorConnected", "reply", "").toString());
            sendTextMessage(sessions.get(
                            webSocketConnections.getTokenToSessionId().get(destToken)),
                    tempWebsocketMessage.setItems("NewPatientConnect", "reply", "").toString());
        } else {
            sendTextMessage(sourceSession,
                    tempWebsocketMessage.setItems("NoCounsellorAvailable", "reply", "").toString());
        }
    }

    private void addTokenToTokenSet(String sourceToken, String destToken) {
        webSocketConnections.getTokenToTokenSet().computeIfAbsent(
                sourceToken, k -> new HashSet<>()).add(destToken);
    }

    private void updateTheSate(String token, String FromSTATE, String ToSTATE) {

        DecodedJWT decodedJWT = jwtAuthProvider.getDecoded(token);
        Roles role = Roles.valueOf(decodedJWT.getClaim("role").asString());
        webSocketConnections.getRoleToStateToToken().get(role).get(FromSTATE).remove(token);
        webSocketConnections.getRoleToStateToToken().get(role).computeIfAbsent(
                ToSTATE,
                k -> new HashSet<>()).add(token);
    }

    private String getAvailableCounsellorToken() {
        if (webSocketConnections.getRoleToStateToToken().containsKey(Roles.ROLE_COUNSELLOR)
                && webSocketConnections.getRoleToStateToToken().get(Roles.ROLE_COUNSELLOR).containsKey(STATE_CONNECTED)
                && !webSocketConnections.getRoleToStateToToken().get(Roles.ROLE_COUNSELLOR).get(STATE_CONNECTED)
                .isEmpty()) {
            return webSocketConnections.getRoleToStateToToken().get(Roles.ROLE_COUNSELLOR).get(STATE_CONNECTED)
                    .iterator().next();
        } else {
            return null;
        }
    }

    private void forwardMessage(WebSocketSession sourceSession, WebSocketMessage socketMessage) throws IOException {
        System.out.println(webSocketConnections.getTokenToTokenSet());
        /*
         * - when the message needs to be forwarded
         * - check for the token to token set and send accordingly
         */
        String sourceToken = webSocketConnections.getSessionIdToToken().get(sourceSession.getId());
        if (!webSocketConnections.getTokenToTokenSet().containsKey(sourceToken)
                || webSocketConnections.getTokenToTokenSet().get(sourceToken).isEmpty()) {
            sendTextMessage(sourceSession,
                    tempWebsocketMessage.setItems("NoCounsellorConnected", "reply", "").toString());
        }
        for (String destToken : webSocketConnections.getTokenToTokenSet().get(sourceToken)) {
            String destSessionId = webSocketConnections.getTokenToSessionId().get(destToken);
            sendTextMessage(sessions.get(destSessionId), socketMessage.toString());
        }
        sendTextMessage(sourceSession, tempWebsocketMessage.setItems("forwardSuccess", "reply", "").toString());
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
            sessions.put(session.getId(), session);
        }
    }
}