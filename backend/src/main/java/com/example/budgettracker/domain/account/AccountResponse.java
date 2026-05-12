package com.example.budgettracker.domain.account;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AccountResponse(
        Long id,
        Long accountGroupId,
        String accountGroupName,
        String name,
        BigDecimal balance,
        boolean excludeFromStats,
        boolean hidden,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

    public static AccountResponse from(Account entity) {
        return new AccountResponse(
                entity.getId(),
                entity.getAccountGroup().getId(),
                entity.getAccountGroup().getName(),
                entity.getName(),
                entity.getBalance(),
                entity.isExcludeFromStats(),
                entity.isHidden(),
                entity.getCreatedAt(),
                entity.getUpdatedAt());
    }
}
