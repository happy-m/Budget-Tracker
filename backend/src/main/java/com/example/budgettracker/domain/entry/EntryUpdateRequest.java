package com.example.budgettracker.domain.entry;

import com.example.budgettracker.domain.category.CategoryGroupKind;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record EntryUpdateRequest(
        @NotNull CategoryGroupKind type,
        Long categoryId,
        Long subcategoryId,
        @NotNull @Positive BigDecimal amount,
        @NotNull LocalDateTime transactionAt,
        Long fromAccountId,
        Long toAccountId,
        @Size(max = 200) String memo) {}
