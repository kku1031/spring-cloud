package com.labzang.api.soccer.team.service;

import com.labzang.api.soccer.common.Messenger;
import com.labzang.api.soccer.team.domain.TeamDTO;
import java.util.List;

public interface TeamService {

    Messenger save(TeamDTO teamDTO);

    Messenger update(TeamDTO teamDTO);

    Messenger delete(String id);

    Messenger findById(String id);

    Messenger findAll();

    Messenger saveAll(List<TeamDTO> teamDTOs);

    Messenger findByKeyword(String keyword);
    
}
