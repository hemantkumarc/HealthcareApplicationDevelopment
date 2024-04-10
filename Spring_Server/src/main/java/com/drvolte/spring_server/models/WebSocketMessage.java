package com.drvolte.spring_server.models;

import lombok.Data;
import org.json.JSONObject;
import org.springframework.web.socket.TextMessage;

@Data
public class WebSocketMessage {
    private String data;
    private String event;
    private String token;
    private String source;
    private String destination;

    public WebSocketMessage(String data, String event, String token, String source, String destination) {
        this.data = data;
        this.event = event;
        this.token = token;
        this.source = source;
        this.destination = destination;
    }

    public WebSocketMessage() {
        this.data = "";
        this.event = "";
        this.token = "";
        this.source = "";
        this.destination = "";
    }

    public WebSocketMessage(TextMessage message) {
        JSONObject messageJSON = new JSONObject(message.getPayload());
        System.out.println("Createinga socketmessage: " + messageJSON);
        this.token = messageJSON.getString("token");
        this.data = messageJSON.getString("data");
        this.event = messageJSON.getString("event");
        this.source = messageJSON.getString("source");
        this.destination = messageJSON.getString("destination");
    }

    public WebSocketMessage setItems(String data, String event, String token, String source, String destination) {
        this.data = data;
        this.event = event;
        this.token = token;
        this.source = source;
        this.destination = destination;
        return this;
    }

    public WebSocketMessage setItems(TextMessage message) {

        JSONObject messageJSON = new JSONObject(message.getPayload());
        System.out.println("Createinga socketmessage: " + messageJSON);
        this.token = messageJSON.getString("token");
        this.data = messageJSON.getString("data");
        this.event = messageJSON.getString("event");
        this.source = messageJSON.getString("source");
        this.destination = messageJSON.getString("destination");
        return this;

    }

    @Override
    public String toString() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("data", this.data);
        jsonObject.put("event", this.event);
        jsonObject.put("token", this.token);
        jsonObject.put("source", this.source);
        jsonObject.put("destination", this.destination);
        return jsonObject.toString();
    }

}