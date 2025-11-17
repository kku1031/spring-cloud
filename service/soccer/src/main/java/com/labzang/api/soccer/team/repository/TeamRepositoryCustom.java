package com.labzang.api.soccer.team.repository;

import java.util.List;

import com.labzang.api.soccer.team.domain.Team;

public interface TeamRepositoryCustom {
    
    // 키워드로 팀 검색 (이름, 영문이름으로 검색)
    List<Team> findByTeamNameContainingOrETeamNameContaining(
            String teamName, String eTeamName);
    
    // 간단한 키워드 검색을 위한 메서드
    default List<Team> findByKeyword(String keyword) {
        return findByTeamNameContainingOrETeamNameContaining(keyword, keyword);
    }
}

