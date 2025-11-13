package com.labzang.api.soccer.stadium.service;

import com.labzang.api.soccer.common.domain.Messenger;
import com.labzang.api.soccer.stadium.domain.StadiumDTO;
import java.util.List;

public interface StadiumService {

    Messenger save(StadiumDTO stadiumDTO);

    Messenger update(StadiumDTO stadiumDTO);

    Messenger delete(String id);

    Messenger findById(String id);

    Messenger findAll();

    Messenger saveAll(List<StadiumDTO> stadiumDTOs);

    Messenger findByKeyword(String keyword);
    
}
