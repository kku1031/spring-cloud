package com.labzang.api.soccer.team.repository;

import java.util.List;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.querydsl.core.BooleanBuilder;

import lombok.RequiredArgsConstructor;

import static com.labzang.api.soccer.team.domain.QTeam.team;

import com.labzang.api.soccer.team.domain.Team;

@RequiredArgsConstructor
public class TeamRepositoryImpl implements TeamRepositoryCustom {
    
    //쿼리 공장 미친놈 마냥 쿼리만듬.
    private final JPAQueryFactory queryFactory; 

    @Override
    public List<Team> findByTeamNameContainingOrETeamNameContaining(
            String teamName, String eTeamName) {
        
        BooleanBuilder builder = new BooleanBuilder();
        
        if (teamName != null && !teamName.isEmpty()) {
            builder.or(team.teamName.containsIgnoreCase(teamName));
        }
        if (eTeamName != null && !eTeamName.isEmpty()) {
            builder.or(team.eTeamName.containsIgnoreCase(eTeamName));
        }
        
        return queryFactory
                .selectFrom(team)
                .where(builder)
                .fetch();
    }
}

