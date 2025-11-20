package site.aiion.api.soccer.stadium;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import site.aiion.api.soccer.common.domain.Messenger;

@Service
@RequiredArgsConstructor
public class StadiumServiceImpl implements StadiumService {

    private final StadiumRepository stadiumRepository;

    private StadiumModel entityToModel(Stadium entity) {
        return StadiumModel.builder()
                .id(entity.getId())
                .stadium_uk(entity.getStadium_uk())
                .stadium_name(entity.getStadium_name())
                .hometeam_uk(entity.getHometeam_uk())
                .seat_count(entity.getSeat_count())
                .address(entity.getAddress())
                .ddd(entity.getDdd())
                .tel(entity.getTel())
                .build();
    }

    private Stadium modelToEntity(StadiumModel model) {
        return Stadium.builder()
                .id(model.getId())
                .stadium_uk(model.getStadium_uk())
                .stadium_name(model.getStadium_name())
                .hometeam_uk(model.getHometeam_uk())
                .seat_count(model.getSeat_count())
                .address(model.getAddress())
                .ddd(model.getDdd())
                .tel(model.getTel())
                .build();
    }

    @Override
    @SuppressWarnings("null")
    public Messenger findById(StadiumModel stadiumModel) {
        Long stadiumId = stadiumModel.getId();
        Optional<Stadium> entity = stadiumRepository.findById(stadiumId);
        if (entity.isPresent()) {
            Stadium stadium = entity.get();
            StadiumModel model = entityToModel(stadium);
            return Messenger.builder()
                    .Code(200)
                    .message("조회 성공")
                    .data(model)
                    .build();
        } else {
            return Messenger.builder()
                    .Code(404)
                    .message("경기장을 찾을 수 없습니다.")
                    .build();
        }
    }

    @Override
    public Messenger findAll() {
        List<Stadium> entities = stadiumRepository.findAll();
        List<StadiumModel> modelList = entities.stream()
                .map(this::entityToModel)
                .collect(Collectors.toList());
        return Messenger.builder()
                .Code(200)
                .message("전체 조회 성공: " + modelList.size() + "개")
                .data(modelList)
                .build();
    }

    @Override
    @Transactional
    @SuppressWarnings("null")
    public Messenger save(StadiumModel stadiumModel) {
        Stadium entity = modelToEntity(stadiumModel);
        Stadium saved = stadiumRepository.save(entity);
        StadiumModel model = entityToModel(saved);
        Long savedId = saved.getId();
        return Messenger.builder()
                .Code(200)
                .message("저장 성공: " + savedId)
                .data(model)
                .build();
    }

    @Override
    @Transactional
    @SuppressWarnings("null")
    public Messenger saveAll(List<StadiumModel> stadiumModelList) {
        List<Stadium> entities = stadiumModelList.stream()
                .map(this::modelToEntity)
                .collect(Collectors.toList());
        
        List<Stadium> saved = stadiumRepository.saveAll(entities);
        return Messenger.builder()
                .Code(200)
                .message("일괄 저장 성공: " + saved.size() + "개")
                .build();
    }

    @Override
    @Transactional
    @SuppressWarnings("null")
    public Messenger update(StadiumModel stadiumModel) {
        Long stadiumId = stadiumModel.getId();
        Optional<Stadium> optionalEntity = stadiumRepository.findById(stadiumId);
        if (optionalEntity.isPresent()) {
            Stadium existing = optionalEntity.get();
            Stadium updated = Stadium.builder()
                    .id(existing.getId())
                    .stadium_uk(stadiumModel.getStadium_uk() != null ? stadiumModel.getStadium_uk() : existing.getStadium_uk())
                    .stadium_name(stadiumModel.getStadium_name() != null ? stadiumModel.getStadium_name() : existing.getStadium_name())
                    .hometeam_uk(stadiumModel.getHometeam_uk() != null ? stadiumModel.getHometeam_uk() : existing.getHometeam_uk())
                    .seat_count(stadiumModel.getSeat_count() != null ? stadiumModel.getSeat_count() : existing.getSeat_count())
                    .address(stadiumModel.getAddress() != null ? stadiumModel.getAddress() : existing.getAddress())
                    .ddd(stadiumModel.getDdd() != null ? stadiumModel.getDdd() : existing.getDdd())
                    .tel(stadiumModel.getTel() != null ? stadiumModel.getTel() : existing.getTel())
                    .schedules(existing.getSchedules())
                    .teams(existing.getTeams())
                    .build();
            
            Stadium saved = stadiumRepository.save(updated);
            StadiumModel model = entityToModel(saved);
            return Messenger.builder()
                    .Code(200)
                    .message("수정 성공: " + stadiumId)
                    .data(model)
                    .build();
        } else {
            return Messenger.builder()
                    .Code(404)
                    .message("수정할 경기장을 찾을 수 없습니다.")
                    .build();
        }
    }

    @Override
    @Transactional
    @SuppressWarnings("null")
    public Messenger delete(StadiumModel stadiumModel) {
        Long stadiumId = stadiumModel.getId();
        Optional<Stadium> optionalEntity = stadiumRepository.findById(stadiumId);
        if (optionalEntity.isPresent()) {
            stadiumRepository.deleteById(stadiumId);
            return Messenger.builder()
                    .Code(200)
                    .message("삭제 성공: " + stadiumId)
                    .build();
        } else {
            return Messenger.builder()
                    .Code(404)
                    .message("삭제할 경기장을 찾을 수 없습니다.")
                    .build();
        }
    }

    @Override
    public Messenger findByWord(StadiumModel stadiumModel) {
        String keyword = stadiumModel.getStadium_name();
        if (keyword == null || keyword.trim().isEmpty()) {
            return Messenger.builder()
                    .Code(400)
                    .message("검색어를 입력해주세요.")
                    .data(null)
                    .build();
        }
        
        List<Stadium> stadiums = stadiumRepository.findAll().stream()
                .filter(s -> s.getStadium_name() != null && s.getStadium_name().contains(keyword))
                .collect(Collectors.toList());
        
        List<StadiumModel> modelList = stadiums.stream()
                .map(this::entityToModel)
                .collect(Collectors.toList());
        
        return Messenger.builder()
                .Code(200)
                .message("검색 완료: " + modelList.size() + "개")
                .data(modelList)
                .build();
    }

}

