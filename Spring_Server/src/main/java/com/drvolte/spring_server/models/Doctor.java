package com.drvolte.spring_server.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "doctor")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "specialization", nullable = false)
    private String specialization;

    @Column(name = "hospital_name", nullable = true)
    private String hospital_name;

    @Column(name = "hospital_address", nullable = true)
    private String hospital_address;

    @Column(name = "qualification", nullable = false)
    private String qualification;

    @Column(name = "profile_photo", nullable = true)
    private String profile_photo;

    @Column(name = "dob", nullable = false)
    private Date date;


}
