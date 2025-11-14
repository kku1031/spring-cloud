package com.labzang.api.soccer.stadium.service;

import java.util.List;

import com.labzang.api.soccer.common.Messenger;
import com.labzang.api.soccer.stadium.domain.StadiumDTO;
import com.labzang.api.soccer.stadium.repository.StadiumRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StadiumServiceImpl implements StadiumService {
    
    private final StadiumRepository stadiumRepository;

    @Override
    public Messenger update(StadiumDTO stadiumDTO) {
        return stadiumRepository.update(stadiumDTO);
    }

    @Override
    public Messenger delete(String id) {
        return stadiumRepository.delete(id);
    }

    @Override
    public Messenger findById(String id) {
        return stadiumRepository.findById(id);
    }

    @Override
    public Messenger findAll() {
        return stadiumRepository.findAll();
    }

    @Override
    public Messenger saveAll(List<StadiumDTO> stadiumDTOs) {
        return stadiumRepository.saveAll(stadiumDTOs);
    }

    @Override
    public Messenger save(StadiumDTO stadiumDTO) {
        return stadiumRepository.save(stadiumDTO);
    }

    @Override
    public Messenger findByKeyword(String keyword) {
        return stadiumRepository.findByKeyword(keyword);
    }
}
