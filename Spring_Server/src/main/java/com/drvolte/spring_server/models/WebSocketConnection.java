package com.drvolte.spring_server.models;

import lombok.Data;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Component
@Data
public class WebSocketConnection {

    private Map<Roles, Set<String>> roleToToken;

    private Map<String, WebSocketSession> tokenToConnection;

    private Map<String, String> tokenToState;

    public WebSocketConnection() {
        this.roleToToken = new HashMap<Roles, Set<String>>();
        this.tokenToConnection = new HashMap<String, WebSocketSession>();
        this.tokenToState = new HashMap<String, String>();
    }

}