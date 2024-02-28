package com.drvolte.spring_server.models;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "senior_dr")
@PrimaryKeyJoinColumn(name = "doctor_id")
@Data
@EqualsAndHashCode(callSuper = true)
public class Senior_Dr extends Doctor {


}
