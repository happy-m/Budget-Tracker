package com.example.budgettracker.domain.transaction;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByTransactionDateBetween(LocalDate from, LocalDate to);

    List<Transaction> findByType(TransactionType type);
}
