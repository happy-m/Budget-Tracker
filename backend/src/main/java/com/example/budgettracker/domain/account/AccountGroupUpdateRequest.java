package com.example.budgettracker.domain.account;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AccountGroupUpdateRequest(
        @NotBlank @Size(max = 30) String name,
        @NotNull AccountGroupKind kind) {}
