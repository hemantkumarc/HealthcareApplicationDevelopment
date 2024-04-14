package com.drvolte.spring_server.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordStructure {
    private String password;
    private String token;
}
