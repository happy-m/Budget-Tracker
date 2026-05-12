package com.example.budgettracker.domain.category;

import java.time.LocalDateTime;

public record CategoryResponse(
        Long id,
        CategoryGroupKind type,
        String name,
        int displayOrder,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

    public static CategoryResponse from(Category entity) {
        return new CategoryResponse(
                entity.getId(),
                entity.getCategoryGroup().getName(),
                entity.getName(),
                entity.getDisplayOrder(),
                entity.getCreatedAt(),
                entity.getUpdatedAt());
    }
}
