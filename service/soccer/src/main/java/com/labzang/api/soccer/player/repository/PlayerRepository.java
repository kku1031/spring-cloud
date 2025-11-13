package com.labzang.api.soccer.player.repository;

import com.labzang.api.soccer.common.domain.Messenger;
import com.labzang.api.soccer.player.domain.PlayerDTO;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class PlayerRepository {

    public Messenger save(PlayerDTO playerDTO) {
        return Messenger.builder()
                .code(200)
                .message("success")
                .build();
    }

    public Messenger update(PlayerDTO playerDTO) {
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

    public Messenger saveAll(List<PlayerDTO> playerDTOs) {
        return Messenger.builder()
                .code(200)
                .message("success")
                .build();
    }

    public Messenger findByKeyword(String keyword) {
        System.out.println("=== PlayerRepository: 검색어로 선수 검색 ===");
        System.out.println("검색어: " + keyword);
        return Messenger.builder()
                .code(200)
                .message("Player search by keyword: " + keyword)
                .build();
    }
}
