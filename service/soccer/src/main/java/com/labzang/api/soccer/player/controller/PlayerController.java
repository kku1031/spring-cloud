package com.labzang.api.soccer.player.controller;

import com.labzang.api.soccer.common.domain.Messenger;
import com.labzang.api.soccer.player.domain.PlayerDTO;
import com.labzang.api.soccer.player.service.PlayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/player")
public class PlayerController {
    private final PlayerService playerService;

    @PostMapping("/save")
    public ResponseEntity<Messenger> save(@RequestBody PlayerDTO playerDTO) {
        return ResponseEntity.ok(playerService.save(playerDTO));
    }

    @PostMapping("/all")
    public ResponseEntity<Messenger> saveAll(@RequestBody List<PlayerDTO> playerDTOs) {
        return ResponseEntity.ok(playerService.saveAll(playerDTOs));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Messenger> update(@PathVariable String id, @RequestBody PlayerDTO playerDTO) {
        return ResponseEntity.ok(playerService.update(playerDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Messenger> delete(@PathVariable String id) {
        return ResponseEntity.ok(playerService.delete(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Messenger> findById(@PathVariable String id) {
        return ResponseEntity.ok(playerService.findById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<Messenger> findAll() {
        return ResponseEntity.ok(playerService.findAll());
    }
}
