package com.example.budgettracker.domain.entry;

import com.example.budgettracker.common.BaseTimeEntity;
import com.example.budgettracker.domain.account.Account;
import com.example.budgettracker.domain.category.Category;
import com.example.budgettracker.domain.category.CategoryGroup;
import com.example.budgettracker.domain.category.Subcategory;
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
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "entries")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Entry extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_group_id", nullable = false)
    private CategoryGroup categoryGroup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subcategory_id")
    private Subcategory subcategory;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDateTime transactionAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_account_id")
    private Account fromAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_account_id")
    private Account toAccount;

    @Column(length = 200)
    private String memo;

    @Builder
    public Entry(
            CategoryGroup categoryGroup,
            Category category,
            Subcategory subcategory,
            BigDecimal amount,
            LocalDateTime transactionAt,
            Account fromAccount,
            Account toAccount,
            String memo) {
        this.categoryGroup = categoryGroup;
        this.category = category;
        this.subcategory = subcategory;
        this.amount = amount;
        this.transactionAt = transactionAt;
        this.fromAccount = fromAccount;
        this.toAccount = toAccount;
        this.memo = memo;
    }

    public void update(
            CategoryGroup categoryGroup,
            Category category,
            Subcategory subcategory,
            BigDecimal amount,
            LocalDateTime transactionAt,
            Account fromAccount,
            Account toAccount,
            String memo) {
        if (categoryGroup != null) this.categoryGroup = categoryGroup;
        if (category != null) this.category = category;
        if (subcategory != null) this.subcategory = subcategory;
        if (amount != null) this.amount = amount;
        if (transactionAt != null) this.transactionAt = transactionAt;
        if (fromAccount != null) this.fromAccount = fromAccount;
        if (toAccount != null) this.toAccount = toAccount;
        if (memo != null) this.memo = memo;
    }
}
