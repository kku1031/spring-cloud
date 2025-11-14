package com.labzang.api.soccer.stadium.repository;

import com.labzang.api.soccer.common.Messenger;
import com.labzang.api.soccer.stadium.domain.StadiumDTO;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class StadiumRepository {
    
    public Messenger save(StadiumDTO stadiumDTO) {
        return Messenger.builder()
                .code(200)
                .message("success")
                .build();
    }

    public Messenger update(StadiumDTO stadiumDTO) {
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

    public Messenger saveAll(List<StadiumDTO> stadiumDTOs) {
        return Messenger.builder()
                .code(200)
                .message("success")
                .build();
    }

    public Messenger findByKeyword(String keyword) {
        System.out.println("=== StadiumRepository: 검색어로 경기장 검색 ===");
        System.out.println("검색어: " + keyword);
        return Messenger.builder()
                .code(200)
                .message("Stadium search by keyword: " + keyword)
                .build();
    }
}
