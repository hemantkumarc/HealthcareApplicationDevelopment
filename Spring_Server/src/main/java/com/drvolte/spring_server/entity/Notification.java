package com.drvolte.spring_server.entity;

import com.drvolte.spring_server.models.Roles;
import jakarta.persistence.*;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "role", nullable = false)
    private Roles role;

    @Column(name = "message", nullable = false)
    private String message;


}