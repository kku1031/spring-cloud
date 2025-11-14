package com.labzang.api.soccer.team.repository;

import com.labzang.api.soccer.team.domain.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    
    // 키워드로 팀 검색 (이름, 영문이름으로 검색)
    java.util.List<Team> findByTeamNameContainingOrETeamNameContaining(
        String teamName, String eTeamName);
    
    // 간단한 키워드 검색을 위한 메서드
    default java.util.List<Team> findByKeyword(String keyword) {
        return findByTeamNameContainingOrETeamNameContaining(keyword, keyword);
    }
}
