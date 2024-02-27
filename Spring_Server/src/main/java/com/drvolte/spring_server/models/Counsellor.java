package com.drvolte.spring_server.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;


@Entity
@Table(name = "counsellor")
public class Counsellor extends Doctor {
    public Counsellor() {
        super();
    }
}
