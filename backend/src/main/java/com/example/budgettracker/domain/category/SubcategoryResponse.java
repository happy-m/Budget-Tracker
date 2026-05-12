package com.example.budgettracker.domain.category;

import java.time.LocalDateTime;

public record SubcategoryResponse(
        Long id,
        Long categoryId,
        String categoryName,
        String name,
        int displayOrder,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

    public static SubcategoryResponse from(Subcategory entity) {
        return new SubcategoryResponse(
                entity.getId(),
                entity.getCategory().getId(),
                entity.getCategory().getName(),
                entity.getName(),
                entity.getDisplayOrder(),
                entity.getCreatedAt(),
                entity.getUpdatedAt());
    }
}
