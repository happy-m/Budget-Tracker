package com.example.budgettracker.domain.account;

import com.example.budgettracker.common.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AccountOwnership ownership;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal balance;

    @Column(nullable = false, length = 3)
    private String currency;

    @Column(nullable = false)
    private boolean excludeFromStats;

    @Builder
    public Account(
            AccountGroup accountGroup,
            String name,
            AccountOwnership ownership,
            BigDecimal balance,
            String currency,
            boolean excludeFromStats) {
        this.accountGroup = accountGroup;
        this.name = name;
        this.ownership = ownership;
        this.balance = balance != null ? balance : BigDecimal.ZERO;
        this.currency = currency != null ? currency : "KRW";
        this.excludeFromStats = excludeFromStats;
    }
}
