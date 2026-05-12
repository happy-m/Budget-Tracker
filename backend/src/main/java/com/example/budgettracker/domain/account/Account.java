package com.example.budgettracker.domain.account;

import com.example.budgettracker.common.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "accounts")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Account extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_group_id", nullable = false)
    private AccountGroup accountGroup;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal balance;

    @Column(nullable = false)
    private boolean excludeFromStats;

    @Column(nullable = false)
    private boolean hidden;

    @Builder
    public Account(
            AccountGroup accountGroup,
            String name,
            BigDecimal balance,
            boolean excludeFromStats,
            boolean hidden) {
        this.accountGroup = accountGroup;
        this.name = name;
        this.balance = balance != null ? balance : BigDecimal.ZERO;
        this.excludeFromStats = excludeFromStats;
        this.hidden = hidden;
    }

    public void update(
            AccountGroup accountGroup,
            String name,
            BigDecimal balance,
            Boolean excludeFromStats,
            Boolean hidden) {
        if (accountGroup != null) this.accountGroup = accountGroup;
        if (name != null) this.name = name;
        if (balance != null) this.balance = balance;
        if (excludeFromStats != null) this.excludeFromStats = excludeFromStats;
        if (hidden != null) this.hidden = hidden;
    }
}
