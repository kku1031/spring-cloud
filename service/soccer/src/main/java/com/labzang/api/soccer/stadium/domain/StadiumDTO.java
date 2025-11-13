package com.labzang.api.soccer.stadium.domain;

import lombok.*;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StadiumDTO {
    private Long stadiumId;
    private String stadiumName;
    private String homeTeamId;
    private String seatCount;
    private String address;
    private String ddd;
    private String tel;
}
