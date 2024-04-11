package com.drvolte.spring_server.models;

import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

@Component
@Data
public class WebSocketConnection {

    private Map<String, String> tokenToSessionId;
    private Map<String, String> sessionIdToToken;
    private Map<Roles, Map<String, HashSet<String>>> roleToStateToToken;
    private Map<String, Map<Roles, String>> tokenToRoleToToken;
    private Map<Roles, Map<Long, String>> roleToIdToToken;

    public WebSocketConnection() {
        this.tokenToSessionId = new HashMap<String, String>();
        this.sessionIdToToken = new HashMap<String, String>();
        this.roleToStateToToken = new HashMap<Roles, Map<String, HashSet<String>>>();
        this.tokenToRoleToToken = new HashMap<String, Map<Roles, String>>();
        this.roleToIdToToken = new HashMap<Roles, Map<Long, String>>();

    }

}