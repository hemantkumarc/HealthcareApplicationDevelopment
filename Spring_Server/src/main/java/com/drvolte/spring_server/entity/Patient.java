package com.drvolte.spring_server.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "patient")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ph_no", nullable = false)
    private String phNumber;

    @Column(name = "name", nullable = true)
    private String name;

    @Column(name = "location", nullable = true)
    private String location;

    @Column(name = "major_issues", nullable = true)
    private String major_issues;

    @Column(name = "minor_issues", nullable = true)
    private String minor_issues;

    @Column(name = "allergies", nullable = true)
    private String allergies;

    @Column(name = "blood_group", nullable = true)
    private String blood_group;

    @Column(name = "state", nullable = false)
    private String state;

    @Column(name = "languague", nullable = true)
    private String languague;
    
    @Column(name = "test_suggested")
    private String test_suggested;

    @Column(name = "gender")
    private String gender;

    @Column(name = "dob", nullable = true)
    private String dob;

    public Long getResourceId() {
        return id;
    }

}