package com.labzang.api.soccer.schedule.domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "schedule")
@Data
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scheduleId;
    
    private String matchDate;
    
    private String matchTime;
    
    private String homeTeamId;
    
    private String awayTeamId;
    
    private String stadiumId;
    
    private String matchResult;
}
