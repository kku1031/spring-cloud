package com.labzang.api.soccer.team.repository;

import com.labzang.api.soccer.team.domain.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long>, TeamRepositoryCustom {
    // 비워져 있어야 하고 따로 빼야함.
}
