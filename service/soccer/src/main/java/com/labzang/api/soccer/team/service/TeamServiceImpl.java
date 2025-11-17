package com.labzang.api.soccer.team.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.labzang.api.soccer.common.Messenger;
import com.labzang.api.soccer.team.domain.Team;
import com.labzang.api.soccer.team.domain.TeamDTO;
import com.labzang.api.soccer.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;

    @Override
    public Messenger save(TeamDTO teamDTO) {
        Team team = toEntity(teamDTO);
        Team savedTeam = teamRepository.save(team);
        return Messenger.builder()
                .code(200)
                .message("Team saved successfully")
                .data(toDTO(savedTeam))
                .build();
    }

    @Override
    public Messenger update(TeamDTO teamDTO) {
        if (teamDTO.getTeamId() == null) {
            return Messenger.builder()
                    .code(400)
                    .message("Team ID is required for update")
                    .build();
        }

        Team team = teamRepository.findById(teamDTO.getTeamId())
                .orElseThrow(() -> new RuntimeException("Team not found with ID: " + teamDTO.getTeamId()));

        updateEntityFromDTO(team, teamDTO);
        Team updatedTeam = teamRepository.save(team);

        return Messenger.builder()
                .code(200)
                .message("Team updated successfully")
                .data(toDTO(updatedTeam))
                .build();
    }

    @Override
    public Messenger delete(String id) {
        Long teamId = Long.parseLong(id);
        if (!teamRepository.existsById(teamId)) {
            return Messenger.builder()
                    .code(404)
                    .message("Team not found with ID: " + id)
                    .build();
        }

        teamRepository.deleteById(teamId);
        return Messenger.builder()
                .code(200)
                .message("Team deleted successfully")
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Messenger findById(String id) {
        Long teamId = Long.parseLong(id);
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found with ID: " + id));

        return Messenger.builder()
                .code(200)
                .message("Team found successfully")
                .data(toDTO(team))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Messenger findAll() {
        List<Team> teams = teamRepository.findAll();
        List<TeamDTO> teamDTOs = teams.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return Messenger.builder()
                .code(200)
                .message("Teams found: " + teamDTOs.size())
                .data(teamDTOs)
                .build();
    }

    @Override
    public Messenger saveAll(List<TeamDTO> teamDTOs) {
        List<Team> teams = teamDTOs.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());

        List<Team> savedTeams = teamRepository.saveAll(teams);
        List<TeamDTO> savedDTOs = savedTeams.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return Messenger.builder()
                .code(200)
                .message("Teams saved successfully: " + savedDTOs.size())
                .data(savedDTOs)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Messenger findByKeyword(String keyword) {
        List<Team> teams = teamRepository.findByKeyword(keyword);
        List<TeamDTO> teamDTOs = teams.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return Messenger.builder()
                .code(200)
                .message("Teams found by keyword '" + keyword + "': " + teamDTOs.size())
                .data(teamDTOs)
                .build();
    }

    // TeamDTO를 Team 엔티티로 변환
    private Team toEntity(TeamDTO dto) {
        Team team = new Team();
        team.setTeamId(dto.getTeamId());
        team.setTeamName(dto.getTeamName());
        team.setETeamName(dto.getETeamName());
        team.setRegionName(dto.getRegionName());
        team.setStadiumId(dto.getStadiumId());
        return team;
    }

    // Team 엔티티를 TeamDTO로 변환
    private TeamDTO toDTO(Team team) {
        return TeamDTO.builder()
                .teamId(team.getTeamId())
                .teamName(team.getTeamName())
                .eTeamName(team.getETeamName())
                .regionName(team.getRegionName())
                .stadiumId(team.getStadiumId())
                .build();
    }

    // Team 엔티티를 TeamDTO의 값으로 업데이트
    private void updateEntityFromDTO(Team team, TeamDTO dto) {
        if (dto.getTeamName() != null)
            team.setTeamName(dto.getTeamName());
        if (dto.getETeamName() != null)
            team.setETeamName(dto.getETeamName());
        if (dto.getRegionName() != null)
            team.setRegionName(dto.getRegionName());
        if (dto.getStadiumId() != null)
            team.setStadiumId(dto.getStadiumId());
    }
}
