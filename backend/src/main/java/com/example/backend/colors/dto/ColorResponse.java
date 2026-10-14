package com.example.backend.colors.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ColorResponse {

    private Long id;
    private String name;
    private String code;
    private String colorCode;
}
