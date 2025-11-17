package com.labzang.api.soccer.player;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // 동적, JPA안에 수많은 overide들이 있음, ai 할려면 필수 많음. <Player, Long> 까지가 JPQL
public interface PlayerRepository extends JpaRepository<Player, Long>, PlayerRepositoryCustom {
    // 비워져 있어야 하고 따로 빼야함.

}
