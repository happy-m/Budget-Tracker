package com.example.budgettracker.domain.account;

import java.time.LocalDateTime;

public record AccountGroupResponse(
        Long id,
        String name,
        AccountGroupKind kind,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

    public static AccountGroupResponse from(AccountGroup entity) {
        return new AccountGroupResponse(
                entity.getId(),
                entity.getName(),
                entity.getKind(),
                entity.getCreatedAt(),
                entity.getUpdatedAt());
    }
}
