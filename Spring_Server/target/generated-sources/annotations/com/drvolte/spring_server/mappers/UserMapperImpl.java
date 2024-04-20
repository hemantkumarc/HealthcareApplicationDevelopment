package com.drvolte.spring_server.mappers;

import com.drvolte.spring_server.dtos.UserDto;
import com.drvolte.spring_server.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-04-18T07:31:19+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDto touserDto(User user) {
        if ( user == null ) {
            return null;
        }

        UserDto.UserDtoBuilder userDto = UserDto.builder();

        if ( user.getRole() != null ) {
            userDto.role( user.getRole().name() );
        }
        if ( user.getId() != null ) {
            userDto.id( user.getId() );
        }
        userDto.username( user.getUsername() );

        return userDto.build();
    }
}
