package com.example.backend.sizes.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SizeResponse {

    private Long id;
    private String name;
    private Integer sortOrder;
    private String sizeCode;
}
