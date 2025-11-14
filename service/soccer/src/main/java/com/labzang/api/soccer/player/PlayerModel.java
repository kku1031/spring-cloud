package com.labzang.api.soccer.player;

import lombok.*;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlayerModel {
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
    private String teamId;
}
