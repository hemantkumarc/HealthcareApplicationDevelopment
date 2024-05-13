package com.drvolte.spring_server.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "patient_history")
public class PatientHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "symptoms", nullable = false)
    private String symptoms;

    @Column(name = "summanry", nullable = false)
    private String summanry;

    @Column(name = "prescription", nullable = false)
    private String prescription;

    @Column(name = "consent", nullable = false)
    private Boolean consent;

    @Column(name = "audio_recording", nullable = false)
    private String audio_recording;

    @Column(name = "test_suggested")
    private String test_suggested;

    @Column(name = "gender")
    private String gender;

    @Column(name = "created", nullable = false)
    private Date created;

    public Long getResourceId() {
        return id;
    }


}