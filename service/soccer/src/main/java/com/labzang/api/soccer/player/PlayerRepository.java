package com.labzang.api.soccer.player;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository //동적, JPA안에 수많은 overide들이 있음, ai 할려면 필수 많음.
public interface PlayerRepository extends JpaRepository<Player, Long>, PlayerRepositoryCustom {

    // 키워드로 선수 검색 (이름, 영문이름, 닉네임으로 검색)
    List<Player> findByPlayerNameContainingOrEPlayerNameContainingOrNicknameContaining(
            String playerName, String ePlayerName, String nickname);

    // 간단한 키워드 검색을 위한 메서드
    default List<Player> findByKeyword(String keyword) {
        return findByPlayerNameContainingOrEPlayerNameContainingOrNicknameContaining(
                keyword, keyword, keyword);
    }
    
}
