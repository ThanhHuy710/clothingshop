package com.example.backend.security;

import java.util.Set;
import org.springframework.http.HttpMethod;

/**
 * Nguồn duy nhất khai báo các endpoint public để SecurityConfig và JWT filter không bị lệch nhau.
 */
final class SecurityPaths {

    static final String HEALTH = "/health";
    static final String REGISTER = "/api/auth/register";
    static final String LOGIN = "/api/auth/login";

    static final Set<String> PUBLIC_POST_AUTH_ENDPOINTS = Set.of(
            REGISTER,
            LOGIN
    );
    static final Set<String> PUBLIC_GET_AUTH_ENDPOINTS = Set.of(HEALTH);

    static boolean isPublic(String method, String requestUri) {
        if (HttpMethod.POST.matches(method) && PUBLIC_POST_AUTH_ENDPOINTS.contains(requestUri)) {
            return true;
        }
        if (HttpMethod.GET.matches(method)) {
            if (PUBLIC_GET_AUTH_ENDPOINTS.contains(requestUri)) {
                return true;
            }
            if (requestUri.startsWith("/api/products") ||
                requestUri.startsWith("/api/colors") ||
                requestUri.startsWith("/api/sizes") ||
                requestUri.startsWith("/api/variants") ||
                requestUri.startsWith("/api/categories")) {
                return true;
            }
        }
        return false;
    }

    private SecurityPaths() {
    }
}
