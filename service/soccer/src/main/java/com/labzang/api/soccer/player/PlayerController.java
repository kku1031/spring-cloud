package com.labzang.api.soccer.player;

import com.labzang.api.soccer.common.Messenger;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/player")
public class PlayerController {
    private final PlayerService playerService;

    @PostMapping("/save")
    public ResponseEntity<Messenger> save(@RequestBody PlayerModel playerDTO) {
        return ResponseEntity.ok(playerService.save(playerDTO));
    }

    @PostMapping("/all")
    public ResponseEntity<Messenger> saveAll(@RequestBody List<PlayerModel> playerDTOs) {
        return ResponseEntity.ok(playerService.saveAll(playerDTOs));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Messenger> update(@PathVariable String id, @RequestBody PlayerModel playerDTO) {
        playerDTO.setPlayerId(Long.parseLong(id));
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

    @GetMapping("/search")
    public ResponseEntity<Messenger> findByKeyword(@RequestParam String keyword) {
        log.info("========================================");
        log.info("[PlayerController] 검색 요청 받음");
        log.info("[PlayerController] 검색어: {}", keyword);
        log.info("========================================");
        
        Messenger result = playerService.findByKeyword(keyword);
        
        log.info("[PlayerController] 검색 완료 - 결과 코드: {}, 메시지: {}", 
                 result.getCode(), result.getMessage());
        
        return ResponseEntity.ok(result);
    }
}
