package com.example.budgettracker.domain.entry;

import com.example.budgettracker.domain.category.CategoryGroupKind;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record EntryResponse(
        Long id,
        CategoryGroupKind type,
        Long categoryId,
        String categoryName,
        Long subcategoryId,
        String subcategoryName,
        BigDecimal amount,
        LocalDateTime transactionAt,
        Long fromAccountId,
        String fromAccountName,
        Long toAccountId,
        String toAccountName,
        String memo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

    public static EntryResponse from(Entry entry) {
        return new EntryResponse(
                entry.getId(),
                entry.getCategoryGroup().getName(),
                entry.getCategory() != null ? entry.getCategory().getId() : null,
                entry.getCategory() != null ? entry.getCategory().getName() : null,
                entry.getSubcategory() != null ? entry.getSubcategory().getId() : null,
                entry.getSubcategory() != null ? entry.getSubcategory().getName() : null,
                entry.getAmount(),
                entry.getTransactionAt(),
                entry.getFromAccount() != null ? entry.getFromAccount().getId() : null,
                entry.getFromAccount() != null ? entry.getFromAccount().getName() : null,
                entry.getToAccount() != null ? entry.getToAccount().getId() : null,
                entry.getToAccount() != null ? entry.getToAccount().getName() : null,
                entry.getMemo(),
                entry.getCreatedAt(),
                entry.getUpdatedAt());
    }
}
