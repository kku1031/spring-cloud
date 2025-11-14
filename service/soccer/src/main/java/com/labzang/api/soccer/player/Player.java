package com.labzang.api.soccer.player;

import jakarta.persistence.*;
import lombok.Data;
import com.labzang.api.soccer.team.domain.Team;

@Entity
@Table(name = "player")
@Data
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long playerId;

    private String playerName;

    private String ePlayerName;

    private String nickname;

    private String joinYyyy;

    private String position;

    private String backNo;

    private String nation;

    private String birthDate;

    private String solar;

    private String height;

    private String weight;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;
}
