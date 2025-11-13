package com.labzang.api.soccer.schedule.controller;

import com.labzang.api.soccer.common.domain.Messenger;
import com.labzang.api.soccer.schedule.domain.ScheduleDTO;
import com.labzang.api.soccer.schedule.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/schedule")
public class ScheduleController {
    private final ScheduleService scheduleService;

    @PostMapping("/save")
    public ResponseEntity<Messenger> save(@RequestBody ScheduleDTO scheduleDTO) {
        return ResponseEntity.ok(scheduleService.save(scheduleDTO));
    }

    @PostMapping("/all")
    public ResponseEntity<Messenger> saveAll(@RequestBody List<ScheduleDTO> scheduleDTOs) {
        return ResponseEntity.ok(scheduleService.saveAll(scheduleDTOs));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Messenger> update(@PathVariable String id, @RequestBody ScheduleDTO scheduleDTO) {
        return ResponseEntity.ok(scheduleService.update(scheduleDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Messenger> delete(@PathVariable String id) {
        return ResponseEntity.ok(scheduleService.delete(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Messenger> findById(@PathVariable String id) {
        return ResponseEntity.ok(scheduleService.findById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<Messenger> findAll() {
        return ResponseEntity.ok(scheduleService.findAll());
    }
}
