package com.drvolte.spring_server.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "callback")
public class CallBack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "counsellor_id", nullable = false)
    private Counsellor counsellor;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Counsellor patient;

    @Column(name = "followup_reason", nullable = true)
    private String followupReason;

    @Column(name = "schedule", nullable = false)
    private Date schedule;

    @Column(name = "status", nullable = false)
    private String status;

}