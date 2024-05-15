package com.drvolte.spring_server.models;

import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@Data
public class WebSocketConnection {

    // Token to session id mapping
    private Map<String, String> tokenToSessionId;
    // Session Id to token mapping
    private Map<String, String> sessionIdToToken;
    // Roles to state and then each state to token
    private Map<Roles, Map<String, HashSet<String>>> roleToStateToToken;
    // Token to token forwarding mapping based on role as there can be only 3 roles involed in a call
    private Map<String, Map<Roles, String>> tokenToRoleToToken;
    // its role to their id (id in entity)
    private Map<Roles, Map<Long, String>> roleToIdToToken;
    // queue for patients in call
    private Queue<Long> waitQueue;
    // missied call (means they callled and didnt want to wait and cut the call as counsellors are busy)
    private Queue<Long> missedCalls;

    public WebSocketConnection() {
        this.tokenToSessionId = new HashMap<String, String>();
        this.sessionIdToToken = new HashMap<String, String>();
        this.roleToStateToToken = new HashMap<Roles, Map<String, HashSet<String>>>();
        this.tokenToRoleToToken = new HashMap<String, Map<Roles, String>>();
        this.roleToIdToToken = new HashMap<Roles, Map<Long, String>>();
        this.waitQueue = new LinkedList<>();
        this.missedCalls = new LinkedList<>();

    }

}