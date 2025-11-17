package com.labzang.api.soccer.player;

import java.util.List;

public interface PlayerRepositoryCustom {
    
    // 키워드로 선수 검색 (이름, 영문이름, 닉네임으로 검색)
    List<Player> findByPlayerNameContainingOrEPlayerNameContainingOrNicknameContaining(
            String playerName, String ePlayerName, String nickname);

    // 간단한 키워드 검색을 위한 메서드
    default List<Player> findByKeyword(String keyword) {
        return findByPlayerNameContainingOrEPlayerNameContainingOrNicknameContaining(
                keyword, keyword, keyword);
    }
}
