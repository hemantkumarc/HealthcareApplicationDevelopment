package com.drvolte.spring_server.models;

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

    @Column(name = "name", nullable = false)
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

    @Column(name = "languague", nullable = false)
    private String languague;

    @Column(name = "dob", nullable = true)
    private String dob;


}
