package com.drvolte.spring_server.mappers;

import com.drvolte.spring_server.dtos.PatientRequestDto;
import com.drvolte.spring_server.dtos.PatientResponseDto;
import com.drvolte.spring_server.entity.Patient;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-04-18T07:31:19+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21 (Oracle Corporation)"
)
@Component
public class PatientMapperImpl implements PatientMapper {

    @Override
    public PatientResponseDto patientToPatientResponseDto(Patient patient) {
        if ( patient == null ) {
            return null;
        }

        PatientResponseDto.PatientResponseDtoBuilder patientResponseDto = PatientResponseDto.builder();

        patientResponseDto.phnumber( patient.getPhNumber() );
        if ( patient.getId() != null ) {
            patientResponseDto.id( String.valueOf( patient.getId() ) );
        }
        patientResponseDto.state( patient.getState() );

        return patientResponseDto.build();
    }

    @Override
    public Patient patientRequestDtoToPatient(PatientRequestDto patientRequestDto) {
        if ( patientRequestDto == null ) {
            return null;
        }

        Patient patient = new Patient();

        patient.setPhNumber( patientRequestDto.phnumber() );
        patient.setState( patientRequestDto.state() );

        return patient;
    }

    @Override
    public Patient patientResponseDtoToPatient(PatientResponseDto patientResponseDto) {
        if ( patientResponseDto == null ) {
            return null;
        }

        Patient patient = new Patient();

        patient.setPhNumber( patientResponseDto.getPhnumber() );
        patient.setState( patientResponseDto.getState() );
        if ( patientResponseDto.getId() != null ) {
            patient.setId( Long.parseLong( patientResponseDto.getId() ) );
        }

        return patient;
    }
}
