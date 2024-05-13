package com.drvolte.spring_server.mappers;

import com.drvolte.spring_server.dtos.UserDto;
import com.drvolte.spring_server.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(source = "role", target = "role")
    @Mapping(source = "name", target = "firstName")
    UserDto touserDto(User user);
}