package com.example.budgettracker.domain.transaction;

import com.example.budgettracker.common.BaseTimeEntity;
import com.example.budgettracker.domain.account.Account;
import com.example.budgettracker.domain.category.Category;
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
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "transactions")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Transaction extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionType type;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDate transactionDate;

    @Column(length = 200)
    private String memo;

    // INCOME: 입금되는 계좌 / TRANSFER: 도착 계좌 / EXPENSE: null
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_account_id")
    private Account toAccount;

    // EXPENSE: 출금되는 계좌 / TRANSFER: 출발 계좌 / INCOME: null
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_account_id")
    private Account fromAccount;

    // TRANSFER 시에는 null 허용 (자산 간 이동은 카테고리 무관)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Builder
    public Transaction(
            TransactionType type,
            BigDecimal amount,
            LocalDate transactionDate,
            String memo,
            Account toAccount,
            Account fromAccount,
            Category category) {
        this.type = type;
        this.amount = amount;
        this.transactionDate = transactionDate;
        this.memo = memo;
        this.toAccount = toAccount;
        this.fromAccount = fromAccount;
        this.category = category;
    }
}
