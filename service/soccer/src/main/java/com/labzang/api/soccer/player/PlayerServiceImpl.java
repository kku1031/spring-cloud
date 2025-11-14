package com.labzang.api.soccer.player;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.labzang.api.soccer.common.Messenger;
import com.labzang.api.soccer.team.repository.TeamRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PlayerServiceImpl implements PlayerService {

    private final PlayerRepository playerRepository;
    private final TeamRepository teamRepository;

    @Override
    public Messenger save(PlayerModel playerModel) {
        Player player = toEntity(playerModel);
        Player savedPlayer = playerRepository.save(player);
        return Messenger.builder()
                .code(200)
                .message("Player saved successfully")
                .data(toModel(savedPlayer))
                .build();
    }

    @Override
    public Messenger update(PlayerModel playerModel) {
        if (playerModel.getPlayerId() == null) {
            return Messenger.builder()
                    .code(400)
                    .message("Player ID is required for update")
                    .build();
        }

        Player player = playerRepository.findById(playerModel.getPlayerId())
                .orElseThrow(() -> new RuntimeException("Player not found with ID: " + playerModel.getPlayerId()));

        updateEntityFromModel(player, playerModel);
        Player updatedPlayer = playerRepository.save(player);

        return Messenger.builder()
                .code(200)
                .message("Player updated successfully")
                .data(toModel(updatedPlayer))
                .build();
    }

    @Override
    public Messenger delete(String id) {
        Long playerId = Long.parseLong(id);
        if (!playerRepository.existsById(playerId)) {
            return Messenger.builder()
                    .code(404)
                    .message("Player not found with ID: " + id)
                    .build();
        }

        playerRepository.deleteById(playerId);
        return Messenger.builder()
                .code(200)
                .message("Player deleted successfully")
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Messenger findById(String id) {
        Long playerId = Long.parseLong(id);
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found with ID: " + id));

        return Messenger.builder()
                .code(200)
                .message("Player found successfully")
                .data(toModel(player))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Messenger findAll() {
        List<Player> players = playerRepository.findAll();
        List<PlayerModel> playerModels = players.stream()
                .map(this::toModel)
                .collect(Collectors.toList());

        return Messenger.builder()
                .code(200)
                .message("Players found: " + playerModels.size())
                .data(playerModels)
                .build();
    }

    @Override
    public Messenger saveAll(List<PlayerModel> playerModels) {
        List<Player> players = playerModels.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());

        List<Player> savedPlayers = playerRepository.saveAll(players);
        List<PlayerModel> savedModels = savedPlayers.stream()
                .map(this::toModel)
                .collect(Collectors.toList());

        return Messenger.builder()
                .code(200)
                .message("Players saved successfully: " + savedModels.size())
                .data(savedModels)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Messenger findByKeyword(String keyword) {
        List<Player> players = playerRepository.findByKeyword(keyword);
        List<PlayerModel> playerModels = players.stream()
                .map(this::toModel)
                .collect(Collectors.toList());

        return Messenger.builder()
                .code(200)
                .message("Players found by keyword '" + keyword + "': " + playerModels.size())
                .data(playerModels)
                .build();
    }

    // PlayerModel을 Player 엔티티로 변환
    private Player toEntity(PlayerModel model) {
        Player player = new Player();
        player.setPlayerId(model.getPlayerId());
        player.setPlayerName(model.getPlayerName());
        player.setEPlayerName(model.getEPlayerName());
        player.setNickname(model.getNickname());
        player.setJoinYyyy(model.getJoinYyyy());
        player.setPosition(model.getPosition());
        player.setBackNo(model.getBackNo());
        player.setNation(model.getNation());
        player.setBirthDate(model.getBirthDate());
        player.setSolar(model.getSolar());
        player.setHeight(model.getHeight());
        player.setWeight(model.getWeight());

        // Team 설정
        if (model.getTeamId() != null && !model.getTeamId().isEmpty()) {
            try {
                Long teamId = Long.parseLong(model.getTeamId());
                teamRepository.findById(teamId).ifPresent(player::setTeam);
            } catch (NumberFormatException e) {
                // teamId가 숫자가 아닌 경우 무시
            }
        }

        return player;
    }

    // Player 엔티티를 PlayerModel로 변환
    private PlayerModel toModel(Player player) {
        return PlayerModel.builder()
                .playerId(player.getPlayerId())
                .playerName(player.getPlayerName())
                .ePlayerName(player.getEPlayerName())
                .nickname(player.getNickname())
                .joinYyyy(player.getJoinYyyy())
                .position(player.getPosition())
                .backNo(player.getBackNo())
                .nation(player.getNation())
                .birthDate(player.getBirthDate())
                .solar(player.getSolar())
                .height(player.getHeight())
                .weight(player.getWeight())
                .teamId(player.getTeam() != null ? player.getTeam().getTeamId().toString() : null)
                .build();
    }

    // Player 엔티티를 PlayerModel의 값으로 업데이트
    private void updateEntityFromModel(Player player, PlayerModel model) {
        if (model.getPlayerName() != null)
            player.setPlayerName(model.getPlayerName());
        if (model.getEPlayerName() != null)
            player.setEPlayerName(model.getEPlayerName());
        if (model.getNickname() != null)
            player.setNickname(model.getNickname());
        if (model.getJoinYyyy() != null)
            player.setJoinYyyy(model.getJoinYyyy());
        if (model.getPosition() != null)
            player.setPosition(model.getPosition());
        if (model.getBackNo() != null)
            player.setBackNo(model.getBackNo());
        if (model.getNation() != null)
            player.setNation(model.getNation());
        if (model.getBirthDate() != null)
            player.setBirthDate(model.getBirthDate());
        if (model.getSolar() != null)
            player.setSolar(model.getSolar());
        if (model.getHeight() != null)
            player.setHeight(model.getHeight());
        if (model.getWeight() != null)
            player.setWeight(model.getWeight());

        // Team 업데이트
        if (model.getTeamId() != null && !model.getTeamId().isEmpty()) {
            try {
                Long teamId = Long.parseLong(model.getTeamId());
                teamRepository.findById(teamId).ifPresent(player::setTeam);
            } catch (NumberFormatException e) {
                // teamId가 숫자가 아닌 경우 무시
            }
        }
    }
}
