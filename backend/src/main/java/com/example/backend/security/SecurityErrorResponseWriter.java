package com.example.backend.security;

import com.example.backend.exception.ErrorResponse;
import com.example.backend.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Ghi response lỗi bảo mật thống nhất với GlobalExceptionHandler.
 */
@Component
public class SecurityErrorResponseWriter {

    private final ObjectMapper objectMapper;

    public SecurityErrorResponseWriter() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
    }

    public void write(HttpServletResponse response, HttpServletRequest request, ErrorCode errorCode)
            throws IOException {
        response.setStatus(errorCode.getHttpStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setHeader("Cache-Control", "no-store");
        response.setHeader("Pragma", "no-cache");
        
        ErrorResponse errorResponse = new ErrorResponse(
            errorCode.getHttpStatus().value(),
            errorCode.getDefaultMessage(),
            LocalDateTime.now()
        );
        
        objectMapper.writeValue(response.getWriter(), errorResponse);
    }
}
