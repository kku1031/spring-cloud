package com.labzang.api.soccer.player;

import com.labzang.api.soccer.common.Messenger;

import java.util.List;

public interface PlayerService {

    Messenger save(PlayerModel playerDTO);

    Messenger update(PlayerModel playerDTO);

    Messenger delete(String id);

    Messenger findById(String id);

    Messenger findAll();

    Messenger saveAll(List<PlayerModel> playerDTOs);

    Messenger findByKeyword(String keyword);

}
