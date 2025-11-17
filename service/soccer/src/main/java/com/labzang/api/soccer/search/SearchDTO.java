package com.labzang.api.soccer.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchDTO {
    private String domain;  // "player", "team", "schedule", "stadium", "default"
    private String keyword; // 검색 키워드
}

