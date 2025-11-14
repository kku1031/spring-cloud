package com.labzang.api.soccer.player;

import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class PlayerRepositoryImpl implements PlayerRepositoryCustom {
    
    //쿼리 공장 미친놈 마냥 쿼리만듬.
    private final JPAQueryFactory queryFactory; 

}
