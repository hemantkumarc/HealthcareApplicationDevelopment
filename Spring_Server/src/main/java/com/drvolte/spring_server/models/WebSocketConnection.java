package com.drvolte.spring_server.models;

import lombok.Data;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

@Component
@Data
public class WebSocketConnection {

    private Map<Roles, HashSet<String>> roleToToken;

    private Map<String, WebSocketSession> tokenToConnection;

    private Map<String, String> tokenToState;

    private Map<String, String> sessionIdToToken;

    private Map<String, HashSet<String>> tokenToTokenSet;

    public WebSocketConnection() {
        this.roleToToken = new HashMap<Roles, HashSet<String>>();
        this.tokenToConnection = new HashMap<String, WebSocketSession>();
        this.tokenToState = new HashMap<String, String>();
        this.sessionIdToToken = new HashMap<String, String>();
        this.tokenToTokenSet = new HashMap<String, HashSet<String>>();

    }

}