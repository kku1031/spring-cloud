package com.labzang.api.soccer.schedule.repository;

import com.labzang.api.soccer.common.Messenger;
import com.labzang.api.soccer.schedule.domain.ScheduleDTO;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class ScheduleRepository {
    
    public Messenger save(ScheduleDTO scheduleDTO) {
        return Messenger.builder()
                .code(200)
                .message("success")
                .build();
    }

    public Messenger update(ScheduleDTO scheduleDTO) {
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

    public Messenger saveAll(List<ScheduleDTO> scheduleDTOs) {
        return Messenger.builder()
                .code(200)
                .message("success")
                .build();
    }

    public Messenger findByKeyword(String keyword) {
        System.out.println("=== ScheduleRepository: 검색어로 일정 검색 ===");
        System.out.println("검색어: " + keyword);
        return Messenger.builder()
                .code(200)
                .message("Schedule search by keyword: " + keyword)
                .build();
    }
}
