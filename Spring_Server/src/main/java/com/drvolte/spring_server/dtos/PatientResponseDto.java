package com.drvolte.spring_server.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PatientResponseDto {
    private String phnumber;
    private String id;
    private String state;
    private String token;
    private String role;
}