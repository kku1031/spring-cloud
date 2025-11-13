package com.labzang.api.soccer.team.repository;

import com.labzang.api.soccer.common.domain.Messenger;
import com.labzang.api.soccer.team.domain.TeamDTO;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class TeamRepository {
    
    public Messenger save(TeamDTO teamDTO) {
        return Messenger.builder()
                .code(200)
                .message("success")
                .build();
    }

    public Messenger update(TeamDTO teamDTO) {
        return Messenger.builder()
                .code(200)
                .message("success")
                .build();
    }

    public Messenger delete(String id) {
        return Messenger.builder()
                .code(200)
                .message("success")
                .build();
    }

    public Messenger findById(String id) {
        return Messenger.builder()
                .code(200)
                .message("success")
                .build();
    }

    public Messenger findAll() {
        return Messenger.builder()
                .code(200)
                .message("success")
                .build();
    }

    public Messenger saveAll(List<TeamDTO> teamDTOs) {
        return Messenger.builder()
                .code(200)
                .message("success")
                .build();
    }

    public Messenger findByKeyword(String keyword) {
        System.out.println("=== TeamRepository: 검색어로 팀 검색 ===");
        System.out.println("검색어: " + keyword);
        return Messenger.builder()
                .code(200)
                .message("Team search by keyword: " + keyword)
                .build();
    }
}
