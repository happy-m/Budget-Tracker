package com.example.budgettracker.domain.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SubcategoryCreateRequest(
        @NotNull Long categoryId, @NotBlank @Size(max = 30) String name) {}
