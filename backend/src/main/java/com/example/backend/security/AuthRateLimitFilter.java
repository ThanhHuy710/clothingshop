package com.example.backend.security;

import com.example.backend.exception.ErrorCode;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Set;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/** Rate limit tập trung cho Auth nhạy cảm, không đọc hoặc lưu request body chứa credential. */
@Component
public class AuthRateLimitFilter extends OncePerRequestFilter {
    private static final Set<String> PUBLIC_SENSITIVE = Set.of(
            "/api/auth/register", 
            "/api/auth/login"
    );
    private final AuthRateLimiter limiter;
    private final SecurityErrorResponseWriter errorWriter;

    public AuthRateLimitFilter(AuthRateLimiter limiter, SecurityErrorResponseWriter errorWriter) {
        this.limiter = limiter;
        this.errorWriter = errorWriter;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        boolean mutatingAuthRequest = "POST".equals(request.getMethod()) || "DELETE".equals(request.getMethod());
        if (!mutatingAuthRequest) return true;
        String uri = request.getRequestURI();
        return !PUBLIC_SENSITIVE.contains(uri);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        RateLimitDecision decision = limiter.acquire(buildOpaqueKey(request));
        if (!decision.allowed()) {
            response.setHeader("Retry-After", Long.toString(decision.retryAfterSeconds()));
            errorWriter.write(response, request, ErrorCode.AUTH_RATE_LIMITED);
            return;
        }
        filterChain.doFilter(request, response);
    }

    private String buildOpaqueKey(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String subject = authentication != null && authentication.getPrincipal() instanceof CustomUserPrincipal user
                ? "user:" + user.getUserId() : "ip:" + request.getRemoteAddr();
        // Chỉ giữ digest của subject và endpoint; không đưa email hoặc token vào key/bộ nhớ.
        return sha256(subject + "|" + request.getRequestURI());
    }

    private String sha256(String value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 không khả dụng", exception);
        }
    }
}
