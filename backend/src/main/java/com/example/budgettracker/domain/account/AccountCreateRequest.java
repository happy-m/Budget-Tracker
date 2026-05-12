package com.example.budgettracker.domain.account;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record AccountCreateRequest(
        @NotNull Long accountGroupId,
        @NotBlank @Size(max = 50) String name,
        BigDecimal balance) {}
