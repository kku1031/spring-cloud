package site.aiion.api.soccer.player;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class PlayerRepositoryImpl implements PlayerRepositoryCustom {
   // QueryDSL을 사용할 때 활성화
   @SuppressWarnings("unused")
   private final JPAQueryFactory queryFactory;
}
