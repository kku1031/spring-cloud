package com.labzang.api.soccer.stadium.domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "stadium")
@Data
public class Stadium {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stadiumId;
    
    private String stadiumName;
    
    private String homeTeamId;
    
    private String seatCount;
    
    private String address;
    
    private String ddd;
    
    private String tel;
}
