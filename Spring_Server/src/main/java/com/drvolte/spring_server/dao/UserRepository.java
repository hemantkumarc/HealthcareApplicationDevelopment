package com.drvolte.spring_server.dao;

import com.drvolte.spring_server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RestResource;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    @RestResource(path = "byAttribute")
    Optional<User> findByUsername( @Param(value = "username")String username);
}