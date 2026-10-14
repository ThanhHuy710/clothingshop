package com.example.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private static final int MIN_HS256_SECRET_BYTES = 32;
    private static final String TOKEN_TYPE_CLAIM = "type";
    private static final String ACCESS_TOKEN_TYPE = "ACCESS";

    private final JwtProperties jwtProperties;

    @Autowired
    public JwtService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    public String generateAccessToken(Long userId, String role) {
        return generateAccessToken(userId, role, false);
    }

    public String generateAccessToken(Long userId, String role, boolean rememberMe) {
        Map<String, Object> claims = new LinkedHashMap<>();
        claims.put("role", role);
        claims.put(TOKEN_TYPE_CLAIM, ACCESS_TOKEN_TYPE);
        
        long expiration = rememberMe
                ? jwtProperties.getRefreshTokenExpirationMillis()
                : jwtProperties.getAccessTokenExpirationMillis();

        return generateToken(
                String.valueOf(userId),
                claims,
                expiration,
                jwtProperties.getAccessTokenSecret()
        );
    }

    public Long extractUserIdFromAccessToken(String token) {
        String subject = parseAccessTokenClaims(token).getSubject();
        return Long.valueOf(subject);
    }
    
    public String extractRoleFromAccessToken(String token) {
        return parseAccessTokenClaims(token).get("role", String.class);
    }

    private String generateToken(
            String subject,
            Map<String, Object> claims,
            long expirationMillis,
            String secret
    ) {
        Instant now = Instant.now();
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(expirationMillis)))
                .signWith(toSecretKey(secret))
                .compact();
    }

    private Claims parseClaims(String token, String secret) {
        return Jwts.parser()
                .verifyWith(toSecretKey(secret))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Claims parseAccessTokenClaims(String token) {
        Claims claims = parseClaims(token, jwtProperties.getAccessTokenSecret());
        validateTokenType(claims, ACCESS_TOKEN_TYPE);
        return claims;
    }

    private void validateTokenType(Claims claims, String expectedType) {
        String tokenType = claims.get(TOKEN_TYPE_CLAIM, String.class);
        if (!expectedType.equals(tokenType)) {
            throw new JwtException("Invalid token type");
        }
    }

    private SecretKey toSecretKey(String secret) {
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < MIN_HS256_SECRET_BYTES) {
            throw new IllegalStateException("JWT secret must contain at least 32 bytes");
        }
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
