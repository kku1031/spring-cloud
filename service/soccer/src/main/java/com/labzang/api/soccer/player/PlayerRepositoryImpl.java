package com.labzang.api.soccer.player;

import java.util.List;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.querydsl.core.BooleanBuilder;

import lombok.RequiredArgsConstructor;

import static com.labzang.api.soccer.player.QPlayer.player;

@RequiredArgsConstructor
public class PlayerRepositoryImpl implements PlayerRepositoryCustom {

    // 쿼리 공장 미친놈 마냥 쿼리만듬.
    private final JPAQueryFactory queryFactory;

    @Override
    public List<Player> findByPlayerNameContainingOrEPlayerNameContainingOrNicknameContaining(
            String playerName, String ePlayerName, String nickname) {

        BooleanBuilder builder = new BooleanBuilder();

        if (playerName != null && !playerName.isEmpty()) {
            builder.or(player.playerName.containsIgnoreCase(playerName));
        }
        if (ePlayerName != null && !ePlayerName.isEmpty()) {
            builder.or(player.ePlayerName.containsIgnoreCase(ePlayerName));
        }
        if (nickname != null && !nickname.isEmpty()) {
            builder.or(player.nickname.containsIgnoreCase(nickname));
        }

        return queryFactory
                .selectFrom(player)
                .where(builder)
                .fetch();
    }
}
