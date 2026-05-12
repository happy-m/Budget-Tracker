package com.example.budgettracker.domain.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CategoryCreateRequest(
        @NotNull CategoryGroupKind type, @NotBlank @Size(max = 30) String name) {}
