package com.drvolte.spring_server.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;


@Entity
@Table(name = "counsellor")
@PrimaryKeyJoinColumn(name = "doctor_id")
@Data
@EqualsAndHashCode(callSuper = true)
public class Counsellor extends Doctor {

}