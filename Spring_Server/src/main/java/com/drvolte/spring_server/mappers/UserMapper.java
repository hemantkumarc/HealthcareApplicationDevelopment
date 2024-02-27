package com.drvolte.spring_server.mappers;

import com.drvolte.spring_server.models.User;
import com.drvolte.spring_server.models.UserDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto touserDto(User user);


}
