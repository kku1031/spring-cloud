package com.labzang.api.soccer.schedule.service;

import com.labzang.api.soccer.common.domain.Messenger;
import com.labzang.api.soccer.schedule.domain.ScheduleDTO;
import java.util.List;

public interface ScheduleService {

    Messenger save(ScheduleDTO scheduleDTO);

    Messenger update(ScheduleDTO scheduleDTO);

    Messenger delete(String id);

    Messenger findById(String id);

    Messenger findAll();

    Messenger saveAll(List<ScheduleDTO> scheduleDTOs);

    Messenger findByKeyword(String keyword);
    
}
