package com.example.backend.users.controller;

import com.example.backend.exception.BadRequestException;
import com.example.backend.security.JwtService;
import com.example.backend.users.dto.AuthRequest;
import com.example.backend.users.dto.AuthResponse;
import com.example.backend.users.entity.Role;
import com.example.backend.users.entity.User;
import com.example.backend.users.repository.RoleRepository;
import com.example.backend.users.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("Sai tên đăng nhập hoặc mật khẩu"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Sai tên đăng nhập hoặc mật khẩu");
        }

        boolean rememberMe = Boolean.TRUE.equals(request.getRememberMe());
        String token = jwtService.generateAccessToken(user.getId(), user.getRole().getName(), rememberMe);
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole().getName()));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new BadRequestException("Tên đăng nhập đã tồn tại");
        }

        String targetRole = (request.getRole() != null && !request.getRole().trim().isEmpty())
                ? request.getRole().trim().toUpperCase()
                : "CUSTOMER";
        Role role = roleRepository.findByName(targetRole)
                .orElseGet(() -> roleRepository.save(new Role(null, targetRole)));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        
        userRepository.save(user);

        String token = jwtService.generateAccessToken(user.getId(), user.getRole().getName());
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole().getName()));
    }
}
