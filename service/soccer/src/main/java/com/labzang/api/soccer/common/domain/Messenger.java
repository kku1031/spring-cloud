package com.labzang.api.soccer.common.domain;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Messenger {
    
    private Integer code;
    private String message;
    private Object data;
}
