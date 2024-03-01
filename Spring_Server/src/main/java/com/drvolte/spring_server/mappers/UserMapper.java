package com.drvolte.spring_server.mappers;

import com.drvolte.spring_server.entity.User;
import com.drvolte.spring_server.dtos.UserDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(source = "role", target = "role")
    UserDto touserDto(User user);
}