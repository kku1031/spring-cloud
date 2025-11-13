package com.labzang.api.soccer.schedule.domain;

import lombok.*;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleDTO {
    private Long scheduleId;
    private String matchDate;
    private String matchTime;
    private String homeTeamId;
    private String awayTeamId;
    private String stadiumId;
    private String matchResult;
}
