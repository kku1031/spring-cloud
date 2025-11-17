package com.labzang.api.soccer.search;

import com.labzang.api.soccer.common.Messenger;
import com.labzang.api.soccer.player.PlayerService;
import com.labzang.api.soccer.team.service.TeamService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/search")
public class SearchController {
    
    private final PlayerService playerService;
    private final TeamService teamService;

    @PostMapping
    public ResponseEntity<Messenger> search(@RequestBody SearchDTO searchDTO) {
        log.info("========================================");
        log.info("[SearchController] 검색 요청 수신");
        log.info("[SearchController] Domain: {}", searchDTO.getDomain());
        log.info("[SearchController] Keyword: {}", searchDTO.getKeyword());
        log.info("========================================");

        String domain = searchDTO.getDomain() != null ? searchDTO.getDomain() : "default";
        String keyword = searchDTO.getKeyword();

        if (keyword == null || keyword.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Messenger.builder()
                            .code(400)
                            .message("검색어를 입력해주세요.")
                            .build());
        }

        try {
            Messenger result;
            
            switch (domain.toLowerCase()) {
                case "player":
                case "default":
                    result = searchPlayers(keyword);
                    break;
                case "team":
                    result = searchTeams(keyword);
                    break;
                default:
                    result = Messenger.builder()
                            .code(400)
                            .message("지원하지 않는 검색 도메인입니다: " + domain)
                            .build();
            }
            
            log.info("[SearchController] Search complete - code: {}, message: {}", 
                     result.getCode(), result.getMessage());
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            log.error("[SearchController] Search error", e);
            return ResponseEntity.internalServerError()
                    .body(Messenger.builder()
                            .code(500)
                            .message("검색 중 오류가 발생했습니다: " + e.getMessage())
                            .build());
        }
    }

    private Messenger searchPlayers(String keyword) {
        return playerService.findByKeyword(keyword);
    }

    private Messenger searchTeams(String keyword) {
        return teamService.findByKeyword(keyword);
    }
}

