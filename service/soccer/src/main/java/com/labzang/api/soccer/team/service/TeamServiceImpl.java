package com.labzang.api.soccer.team.service;

import java.util.List;

import com.labzang.api.soccer.common.domain.Messenger;
import com.labzang.api.soccer.team.domain.TeamDTO;
import com.labzang.api.soccer.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {
    
    private final TeamRepository teamRepository;

    @Override
    public Messenger update(TeamDTO teamDTO) {
        return teamRepository.update(teamDTO);
    }

    @Override
    public Messenger delete(String id) {
        return teamRepository.delete(id);
    }

    @Override
    public Messenger findById(String id) {
        return teamRepository.findById(id);
    }

    @Override
    public Messenger findAll() {
        return teamRepository.findAll();
    }

    @Override
    public Messenger saveAll(List<TeamDTO> teamDTOs) {
        return teamRepository.saveAll(teamDTOs);
    }

    @Override
    public Messenger save(TeamDTO teamDTO) {
        return teamRepository.save(teamDTO);
    }

    @Override
    public Messenger findByKeyword(String keyword) {
        return teamRepository.findByKeyword(keyword);
    }
}
