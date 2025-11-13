package com.labzang.api.soccer.team.domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "team")
@Data
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long teamId;
    
    private String teamName;
    
    private String eTeamName;
    
    private String regionName;
    
    private String stadiumId;
}
