package com.example.budgettracker.domain.account;

import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record AccountUpdateRequest(
        Long accountGroupId,
        @Size(max = 50) String name,
        BigDecimal balance,
        Boolean excludeFromStats,
        Boolean hidden) {}
