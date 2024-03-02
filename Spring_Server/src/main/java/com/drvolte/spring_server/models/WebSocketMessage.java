package com.drvolte.spring_server.models;

import lombok.Data;
import org.json.JSONObject;
import org.springframework.web.socket.TextMessage;

@Data
public class WebSocketMessage {
    private final String data;
    private final String event;
    private final String token;

    public WebSocketMessage(String data, String event, String token) {
        this.data = data;
        this.event = event;
        this.token = token;
    }

    public WebSocketMessage(TextMessage message) {
        JSONObject messageJSON = new JSONObject(message.getPayload());
        System.out.println("Createinga socketmessage: " + messageJSON);
        this.token = messageJSON.getString("token");
        this.data = messageJSON.getString("data");
        this.event = messageJSON.getString("event");
    }

    @Override
    public String toString() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("data", this.data);
        jsonObject.put("event", this.event);
        jsonObject.put("token", this.token);
        return jsonObject.toString();
    }

}