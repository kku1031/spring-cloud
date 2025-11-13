package com.labzang.api.soccer.team.domain;

import lombok.*;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeamDTO {
    private Long teamId;
    private String teamName;
    private String eTeamName;
    private String regionName;
    private String stadiumId;
}
