package com.labzang.api.soccer.player.service;

import com.labzang.api.soccer.common.domain.Messenger;
import com.labzang.api.soccer.player.domain.PlayerDTO;
import java.util.List;

public interface PlayerService {

    Messenger save(PlayerDTO playerDTO);

    Messenger update(PlayerDTO playerDTO);

    Messenger delete(String id);

    Messenger findById(String id);

    Messenger findAll();

    Messenger saveAll(List<PlayerDTO> playerDTOs);

    Messenger findByKeyword(String keyword);

}
