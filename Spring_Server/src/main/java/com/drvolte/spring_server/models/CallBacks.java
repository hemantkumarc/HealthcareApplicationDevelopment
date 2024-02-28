package com.drvolte.spring_server.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "callbacks")
public class CallBacks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "counsellor_id", nullable = false)
    private Counsellor counsellorId;

    @Column(name = "followup_reason", nullable = true)
    private String followupReason;

    @Column(name = "schedule", nullable = false)
    private Date schedule;

}
