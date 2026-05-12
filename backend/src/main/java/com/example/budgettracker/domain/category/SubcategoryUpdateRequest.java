package com.example.budgettracker.domain.category;

import jakarta.validation.constraints.Size;

public record SubcategoryUpdateRequest(
        @Size(max = 30) String name,
        Integer displayOrder) {}
