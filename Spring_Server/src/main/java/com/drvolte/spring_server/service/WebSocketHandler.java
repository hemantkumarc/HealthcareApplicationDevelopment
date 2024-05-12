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
    private static final String SET_TOKEN_EVENT = "settoken",
            CONNECT_EVENT = "connect",
            DECLINE_EVENT = "decline",
            STATECHANGE_EVENT = "changestate",
            ADDTOQUEUE_EVENT = "addtoqueue",
            ADDTOMISSED_EVENT = "addtomissed",
            REMOVEQUEUE_EVENT = "removequeue",
            REMOVEMISSED_EVENT = "removemissed",
            CONNECT_PATIENT = "connectpatient",
            CONNECT_COUNSELLOR = "connectcounsellor",
            CONNECT_QUEUE = "connectqueue",
            CONNECT_MISSED = "connectmissed",
            STATE_CONNECTED = "connected",
            STATE_INCALL = "incall",
            STATE_BUSY = "busy";
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
        WebSocketMessage socketMessage = new WebSocketMessage();
        try {
            if (message == null) {
                logger.warn("Received a null message");
                return;
            }

            logger.info("Got the message: {}", message.getPayload());
            socketMessage.setItems(message);
            logger.info("socketmessage {}", socketMessage);

            switch (socketMessage.getEvent()) {
                case SET_TOKEN_EVENT -> {
                    logger.info("its an setToken event");
                    assert sourceSession != null;
                    handleSetTokenEvent(sourceSession, socketMessage);
                }
                case CONNECT_EVENT -> {
                    logger.info("its an connect event");
                    assert sourceSession != null;
                    handleConnectEvent(sourceSession, socketMessage);
                }
                case DECLINE_EVENT -> {
                    logger.info("its an decline event");
                    assert sourceSession != null;
                    forwardMessage(sourceSession, socketMessage);
                    handleDeclineEvent(sourceSession, socketMessage);
                }
                case CONNECT_PATIENT -> {
                    logger.info("Senior Dr connecting Patient");
                    handleConnectPatientEvent(sourceSession, socketMessage);
                }
                case CONNECT_COUNSELLOR -> {
                    logger.info("Senior Dr connecting counsellot");
                    handleConnectCounsellorEvent(sourceSession, socketMessage);
                }
                case STATECHANGE_EVENT -> {
                    logger.info("Sett event occured");
                    assert sourceSession != null;
                    handleChangeStateEvent(sourceSession, socketMessage);
                }
                case ADDTOQUEUE_EVENT -> {
                    logger.info("Add to Queue event occured");
                    assert sourceSession != null;
                    handleAddToQueueEvent(sourceSession, socketMessage);
                }
                case ADDTOMISSED_EVENT -> {
                    logger.info("Add to missed event occured");
                    assert sourceSession != null;
                    handleAddToMissedEvent(sourceSession, socketMessage);
                }
                case REMOVEQUEUE_EVENT -> {
                    logger.info("remove from queue event occured");
                    assert sourceSession != null;
                    handleRemoveQueueEvent(sourceSession, socketMessage);
                }
                case REMOVEMISSED_EVENT -> {
                    logger.info("remove from missed event occured");
                    assert sourceSession != null;
                    handleRemoveMissedEvent(sourceSession, socketMessage);
                }
                case CONNECT_QUEUE -> {
                    logger.info("Connect from queue event occured");
                    assert sourceSession != null;
                    handleConnectQueueEvent(sourceSession, socketMessage);
                }
                case CONNECT_MISSED -> {
                    logger.info("Connect from missed event occured");
                    assert sourceSession != null;
                    handleConnectMissedEvent(sourceSession, socketMessage);
                }
                case null, default -> {
                    logger.info("forwarding");
                    assert sourceSession != null;
                    forwardMessage(sourceSession, socketMessage);
                }
            }
        } catch (JWTVerificationException e) {
            logger.error("JWTVerificationException occuered");
            assert sourceSession != null;
            sendTextMessage(sourceSession, tempWebsocketMessage.setItems("Invalid JWT token", "reply", "", socketMessage.getSource(), socketMessage.getDestination()).toString());
        } catch (Exception e) {
            logger.error("Error handling WebSocket message", e);
        }
    }

    private void handleConnectMissedEvent(WebSocketSession sourceSession, WebSocketMessage socketMessage) throws IOException {
        Long patientId = webSocketConnections.getMissedCalls().poll();
        String sourceToken = socketMessage.getToken();


        assert patientId != null;
        WebSocketMessage newSocketMsg = new WebSocketMessage(
                patientId.toString(),
                "connect",
                sourceToken,
                socketMessage.getSource(),
                socketMessage.getDestination()
        );
        handleConnectEvent(sourceSession, newSocketMsg);
    }

    private void handleConnectQueueEvent(WebSocketSession sourceSession, WebSocketMessage socketMessage) throws IOException {
        Long patientId = webSocketConnections.getWaitQueue().poll();
        String sourceToken = socketMessage.getToken();


        assert patientId != null;
        WebSocketMessage newSocketMsg = new WebSocketMessage(
                patientId.toString(),
                "connect",
                sourceToken,
                socketMessage.getSource(),
                socketMessage.getDestination()
        );
        handleConnectEvent(sourceSession, newSocketMsg);
    }

    private void handleRemoveQueueEvent(WebSocketSession sourceSession, WebSocketMessage socketMessage) {
        String sourceToken = webSocketConnections.getSessionIdToToken().get(sourceSession.getId());
        Long source_Id = getIdFromToken(sourceToken);
        webSocketConnections.getWaitQueue().remove(source_Id);

    }

    private void handleRemoveMissedEvent(WebSocketSession sourceSession, WebSocketMessage socketMessage) {
        String sourceToken = webSocketConnections.getSessionIdToToken().get(sourceSession.getId());
        Long source_Id = getIdFromToken(sourceToken);
        webSocketConnections.getMissedCalls().remove(source_Id);

    }

    private void handleAddToMissedEvent(WebSocketSession sourceSession, WebSocketMessage socketMessage) {
        String sourceToken = webSocketConnections.getSessionIdToToken().get(sourceSession.getId());
        Long source_Id = getIdFromToken(sourceToken);
        if (!webSocketConnections.getMissedCalls().contains(source_Id))
            webSocketConnections.getMissedCalls().add(source_Id);
    }

    private void handleAddToQueueEvent(WebSocketSession sourceSession, WebSocketMessage socketMessage) {

        String sourceToken = webSocketConnections.getSessionIdToToken().get(sourceSession.getId());
        Long source_Id = getIdFromToken(sourceToken);
        if (!webSocketConnections.getWaitQueue().contains(source_Id))
            webSocketConnections.getWaitQueue().add(source_Id);
    }

    private void handleChangeStateEvent(WebSocketSession sourceSession, WebSocketMessage socketMessage) throws IOException {
        String token = webSocketConnections.getSessionIdToToken().get(sourceSession.getId());
        String presentState = socketMessage.getData().split(":")[0];
        String toState = socketMessage.getData().split(":")[1];
        System.out.println("CHanging state from " + presentState + " to " + toState);
        updateTheSate(token, presentState, toState);
        sendTextMessage(sourceSession,
                tempWebsocketMessage.setItems("changeStateSuccessfully", "reply", "", socketMessage.getSource(), socketMessage.getDestination()).toString());
    }

    private void handleConnectCounsellorEvent(WebSocketSession sourceSession, WebSocketMessage socketMessage) throws IOException {
        String destToken = webSocketConnections.getRoleToIdToToken()
                .get(Roles.valueOf(socketMessage.getDestination()))
                .get(Long.parseLong(socketMessage.getData()));
        if (destToken != null) {
            addTokenToTokenSet(
                    webSocketConnections.getSessionIdToToken().get(sourceSession.getId()),
                    destToken,
                    getRoleFromToken(destToken));
            addTokenToTokenSet(
                    destToken,
                    webSocketConnections.getSessionIdToToken().get(sourceSession.getId()),
                    getRoleFromToken(webSocketConnections.getSessionIdToToken().get(sourceSession.getId()))
            );
            sendTextMessage(sourceSession,
                    tempWebsocketMessage.setItems("counsellorConnected", "reply", "", socketMessage.getSource(), socketMessage.getDestination()).toString());
            sendTextMessage(sessions.get(
                            webSocketConnections.getTokenToSessionId().get(destToken)),
                    tempWebsocketMessage.setItems("srDrConnect", "reply", "", socketMessage.getSource(), socketMessage.getDestination()).toString());
        } else {
            sendTextMessage(sourceSession,
                    tempWebsocketMessage.setItems("counsellorNotAvailable", "reply", "", socketMessage.getSource(), socketMessage.getDestination()).toString());
        }
    }

    private void handleConnectPatientEvent(WebSocketSession sourceSession, WebSocketMessage socketMessage) throws IOException {
        String destToken = webSocketConnections.getRoleToIdToToken()
                .get(Roles.valueOf(socketMessage.getDestination()))
                .get(Long.parseLong(socketMessage.getData()));

        if (destToken != null) {
            addTokenToTokenSet(
                    webSocketConnections.getSessionIdToToken().get(sourceSession.getId()),
                    destToken,
                    getRoleFromToken(destToken));
            addTokenToTokenSet(
                    destToken,
                    webSocketConnections.getSessionIdToToken().get(sourceSession.getId()),
                    getRoleFromToken(webSocketConnections.getSessionIdToToken().get(sourceSession.getId()))
            );
            sendTextMessage(sourceSession,
                    tempWebsocketMessage.setItems("patientConnected", "reply", "", socketMessage.getSource(), socketMessage.getDestination()).toString());
            sendTextMessage(sessions.get(
                            webSocketConnections.getTokenToSessionId().get(destToken)),
                    tempWebsocketMessage.setItems("seniorDoctorConnecting", "reply", "", socketMessage.getSource(), socketMessage.getDestination()).toString());
        } else {
            sendTextMessage(sourceSession,
                    tempWebsocketMessage.setItems("patientNotAvailable", "reply", "", socketMessage.getSource(), socketMessage.getDestination()).toString());
        }
    }

    private void handleDeclineEvent(WebSocketSession sourceSession, WebSocketMessage socketMessage) {
        String token = webSocketConnections.getSessionIdToToken().get(sourceSession.getId());
        updateTheSate(token, STATE_INCALL, STATE_CONNECTED);
        System.out.println("this is the Token to ROle to Token  " + webSocketConnections.getTokenToRoleToToken());
        System.out.println("removing the " + Roles.valueOf(socketMessage.getDestination()) + " from this token: " + token);

        if (socketMessage.getData().equals("disconnect")) {
            String counsellorToken, srDrToken, patientToken;
            counsellorToken = webSocketConnections.getTokenToRoleToToken().get(token).getOrDefault(Roles.ROLE_COUNSELLOR, null);
            srDrToken = webSocketConnections.getTokenToRoleToToken().get(token).getOrDefault(Roles.ROLE_SENIORDR, null);
            patientToken = webSocketConnections.getTokenToRoleToToken().get(token).getOrDefault(Roles.ROLE_PATIENT, null);
            webSocketConnections.getTokenToRoleToToken().remove(token);
            System.out.println("Disconnect call:" + patientToken + " \n" + counsellorToken + "\n" + srDrToken);
            if (patientToken != null)
                webSocketConnections.getTokenToRoleToToken().remove(patientToken);
            if (counsellorToken != null)
                webSocketConnections.getTokenToRoleToToken().remove(counsellorToken);
            if (srDrToken != null)
                webSocketConnections.getTokenToRoleToToken().remove(srDrToken);
        } else {
            webSocketConnections.getTokenToRoleToToken()
                    .getOrDefault(token, new HashMap<>())
                    .remove(
                            Roles.valueOf(socketMessage.getDestination())
                    );
        }

        logger.info("User connection declined" + token);
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
            Long id = decodedJWT.getClaim("id").asLong();
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

            if (webSocketConnections.getRoleToIdToToken().containsKey(role)) {
                webSocketConnections.getRoleToIdToToken().get(role).
                        put(id, socketMessage.getToken());

            } else {
                webSocketConnections.getRoleToIdToToken().computeIfAbsent(
                        role,
                        t -> new HashMap<>()
                ).put(id, socketMessage.getToken());
            }
            logger.info("added the token " + webSocketConnections.getSessionIdToToken());
            logger.info("added the session " + webSocketConnections.getTokenToSessionId());
            logger.info("added the state map" + webSocketConnections.getRoleToStateToToken());
            logger.info("this is the role to id to token: " + webSocketConnections.getRoleToIdToToken());
            sendTextMessage(session, tempWebsocketMessage.setItems("addedToken", "reply", "", socketMessage.getSource(), socketMessage.getDestination()).toString());
        } catch (JWTVerificationException e) {
            logger.error("JWTVerificationException occuered");
            sendTextMessage(session, tempWebsocketMessage.setItems("Invalid JWT token", "reply", "", socketMessage.getSource(), socketMessage.getDestination()).toString());
        } catch (Exception e) {
            logger.error("Some errror occured" + e);
            sendTextMessage(session, tempWebsocketMessage.setItems("Some ERROR", "reply", "", socketMessage.getSource(), socketMessage.getDestination()).toString());
        }

    }

    private void handleConnectEvent(WebSocketSession sourceSession, WebSocketMessage socketMessage)
            throws IOException {
        /*
         * - when patient sends to connect (initiates the call) token to token set must
         * be updated or set accordingly
         * - check for available counsellor and update the token to token set
         * - based on the result reply the patient and counsellor
         */
        String destToken = webSocketConnections.getRoleToIdToToken()
                .get(Roles.valueOf(socketMessage.getDestination()))
                .get(Long.parseLong(socketMessage.getData()));
        String sourceToken = webSocketConnections.getSessionIdToToken().get(sourceSession.getId());
        Long id = getIdFromToken(sourceToken);
        if (destToken != null) {
            updateTheSate(destToken, STATE_CONNECTED, STATE_INCALL);
            updateTheSate(webSocketConnections.getSessionIdToToken().get(sourceSession.getId()),
                    STATE_CONNECTED,
                    STATE_INCALL);

            addTokenToTokenSet(
                    webSocketConnections.getSessionIdToToken().get(sourceSession.getId()),
                    destToken,
                    getRoleFromToken(destToken));
            addTokenToTokenSet(
                    destToken,
                    webSocketConnections.getSessionIdToToken().get(sourceSession.getId()),
                    getRoleFromToken(webSocketConnections.getSessionIdToToken().get(sourceSession.getId()))
            );
            sendTextMessage(sourceSession,
                    tempWebsocketMessage.setItems("Connected", "reply", "", socketMessage.getSource(), socketMessage.getDestination()).toString());
            sendTextMessage(sessions.get(
                            webSocketConnections.getTokenToSessionId().get(destToken)),
                    tempWebsocketMessage.setItems("NewConnection:" + id, "reply", "", socketMessage.getSource(), socketMessage.getDestination()).toString());
        } else {
            sendTextMessage(sourceSession,
                    tempWebsocketMessage.setItems("NotAvailable", "reply", "", socketMessage.getSource(), socketMessage.getDestination()).toString());
        }
    }

    private Roles getRoleFromToken(String token) {
        DecodedJWT decodedJWT = jwtAuthProvider.getDecoded(token);

        return Roles.valueOf(decodedJWT.getClaim("role").asString());
    }

    private Long getIdFromToken(String token) {
        DecodedJWT decodedJWT = jwtAuthProvider.getDecoded(token);

        return decodedJWT.getClaim("id").asLong();
    }

    private void addTokenToTokenSet(String sourceToken, String destToken, Roles role) {
        webSocketConnections.getTokenToRoleToToken().computeIfAbsent(
                sourceToken, k -> new HashMap<>()).put(role, destToken);
    }

    private void updateTheSate(String token, String FromSTATE, String ToSTATE) {
        System.out.println("inside the updateTheState: " + token);
        System.out.println(FromSTATE + "   :::>   " + ToSTATE);
        System.out.println("this is the RoleToStateToToken :: " + webSocketConnections.getRoleToStateToToken());
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
        System.out.println("this is token to Role to Token " + webSocketConnections.getTokenToRoleToToken());
        /*
         * - when the message needs to be forwarded
         * - check for the token to token set and send accordingly
         */
        String sourceToken = webSocketConnections.getSessionIdToToken().get(sourceSession.getId());
        if (!webSocketConnections.getTokenToRoleToToken().containsKey(sourceToken)
                || webSocketConnections.getTokenToRoleToToken().get(sourceToken).isEmpty()) {
            sendTextMessage(sourceSession,
                    tempWebsocketMessage.setItems("DestinationNotConnected", "reply", "", socketMessage.getSource(), socketMessage.getDestination()).toString());
        }

        String destToken = webSocketConnections.getTokenToRoleToToken()
                .get(sourceToken)
                .get(
                        Roles.valueOf(
                                socketMessage.getDestination()
                        )
                );
        String destSessionId = webSocketConnections.getTokenToSessionId().get(destToken);
        socketMessage.setToken("");
        sendTextMessage(sessions.get(destSessionId), socketMessage.toString());
        sendTextMessage(sourceSession, tempWebsocketMessage.setItems("forwardSuccess", "reply", "", socketMessage.getSource(), socketMessage.getDestination()).toString());
    }

    private void sendTextMessage(WebSocketSession session, String payload) throws IOException {
        if (session != null && session.isOpen()) {
            session.sendMessage(new TextMessage(payload));
            System.out.println("Sending this message: " + payload);
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