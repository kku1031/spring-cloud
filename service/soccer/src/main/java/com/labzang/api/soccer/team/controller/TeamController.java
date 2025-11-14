package com.labzang.api.soccer.team.controller;

import com.labzang.api.soccer.common.Messenger;
import com.labzang.api.soccer.team.domain.TeamDTO;
import com.labzang.api.soccer.team.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/team")
public class TeamController {
    private final TeamService teamService;


    @PostMapping("/save")
    public ResponseEntity<Messenger> save(@RequestBody TeamDTO teamDTO) {
        return ResponseEntity.ok(teamService.save(teamDTO));
    }

    @PostMapping("/all")
    public ResponseEntity<Messenger> saveAll(@RequestBody List<TeamDTO> teamDTOs) {
        return ResponseEntity.ok(teamService.saveAll(teamDTOs));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Messenger> update(@PathVariable String id, @RequestBody TeamDTO teamDTO) {
        return ResponseEntity.ok(teamService.update(teamDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Messenger> delete(@PathVariable String id) {
        return ResponseEntity.ok(teamService.delete(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Messenger> findById(@PathVariable String id) {
        return ResponseEntity.ok(teamService.findById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<Messenger> findAll() {
        return ResponseEntity.ok(teamService.findAll());
    }
}
