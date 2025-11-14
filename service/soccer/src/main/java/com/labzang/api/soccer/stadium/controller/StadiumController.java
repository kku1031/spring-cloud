package com.labzang.api.soccer.stadium.controller;

import com.labzang.api.soccer.common.Messenger;
import com.labzang.api.soccer.stadium.domain.StadiumDTO;
import com.labzang.api.soccer.stadium.service.StadiumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/stadium")
public class StadiumController {
    private final StadiumService stadiumService;


    @PostMapping("/save")
    public ResponseEntity<Messenger> save(@RequestBody StadiumDTO stadiumDTO) {
        return ResponseEntity.ok(stadiumService.save(stadiumDTO));
    }

    @PostMapping("/all")
    public ResponseEntity<Messenger> saveAll(@RequestBody List<StadiumDTO> stadiumDTOs) {
        return ResponseEntity.ok(stadiumService.saveAll(stadiumDTOs));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Messenger> update(@PathVariable String id, @RequestBody StadiumDTO stadiumDTO) {
        return ResponseEntity.ok(stadiumService.update(stadiumDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Messenger> delete(@PathVariable String id) {
        return ResponseEntity.ok(stadiumService.delete(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Messenger> findById(@PathVariable String id) {
        return ResponseEntity.ok(stadiumService.findById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<Messenger> findAll() {
        return ResponseEntity.ok(stadiumService.findAll());
    }
}
