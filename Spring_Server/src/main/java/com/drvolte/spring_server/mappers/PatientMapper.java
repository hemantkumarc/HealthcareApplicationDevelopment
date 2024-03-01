package com.drvolte.spring_server.mappers;

import com.drvolte.spring_server.dtos.PatientRequestDto;
import com.drvolte.spring_server.dtos.PatientResponseDto;
import com.drvolte.spring_server.entity.Patient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PatientMapper {
    @Mapping(source = "phNumber", target = "phnumber")
    public PatientResponseDto patientToPatientResponseDto(Patient patient);


    @Mapping(source = "phnumber", target = "phNumber")
    @Mapping(source = "state", target = "state")
    public Patient patientRequestDtoToPatient(PatientRequestDto patientRequestDto);


    @Mapping(source = "phnumber", target = "phNumber")
    @Mapping(source = "state", target = "state")
    @Mapping(source = "id", target = "id")
    public Patient patientResponseDtoToPatient(PatientResponseDto patientResponseDto);




}