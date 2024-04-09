package com.drvolte.spring_server.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "call_history")
public class CallHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "counsellor_id", referencedColumnName = "doctor_id", nullable = false)
    private Counsellor counsellor;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "id", nullable = false)
    private Patient patient;

    @Column(name = "call_start", nullable = false)
    private Date callStart;

    @Column(name = "call_end", nullable = false)
    private Date callEnd;

    @Column(name = "status", nullable = false)
    private String status;
}