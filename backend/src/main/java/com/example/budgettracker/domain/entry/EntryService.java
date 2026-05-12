package com.example.budgettracker.domain.entry;

import com.example.budgettracker.domain.account.Account;
import com.example.budgettracker.domain.account.AccountRepository;
import com.example.budgettracker.domain.category.Category;
import com.example.budgettracker.domain.category.CategoryGroup;
import com.example.budgettracker.domain.category.CategoryGroupRepository;
import com.example.budgettracker.domain.category.CategoryRepository;
import com.example.budgettracker.domain.category.Subcategory;
import com.example.budgettracker.domain.category.SubcategoryRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class EntryService {

    private final EntryRepository entryRepository;
    private final CategoryGroupRepository categoryGroupRepository;
    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final AccountRepository accountRepository;

    @Transactional(readOnly = true)
    public List<EntryResponse> findAll() {
        return entryRepository.findAll().stream().map(EntryResponse::from).toList();
    }

    public EntryResponse update(Long id, EntryUpdateRequest request) {
        Entry entry =
                entryRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Entry not found: " + id));
        CategoryGroup group =
                categoryGroupRepository
                        .findByName(request.type())
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "CategoryGroup not found: " + request.type()));
        Category category =
                request.categoryId() != null
                        ? categoryRepository
                                .findById(request.categoryId())
                                .orElseThrow(
                                        () ->
                                                new ResponseStatusException(
                                                        HttpStatus.NOT_FOUND,
                                                        "Category not found: "
                                                                + request.categoryId()))
                        : null;
        Subcategory subcategory =
                request.subcategoryId() != null
                        ? subcategoryRepository
                                .findById(request.subcategoryId())
                                .orElseThrow(
                                        () ->
                                                new ResponseStatusException(
                                                        HttpStatus.NOT_FOUND,
                                                        "Subcategory not found: "
                                                                + request.subcategoryId()))
                        : null;
        Account fromAccount =
                request.fromAccountId() != null
                        ? accountRepository
                                .findById(request.fromAccountId())
                                .orElseThrow(
                                        () ->
                                                new ResponseStatusException(
                                                        HttpStatus.NOT_FOUND,
                                                        "Account not found: "
                                                                + request.fromAccountId()))
                        : null;
        Account toAccount =
                request.toAccountId() != null
                        ? accountRepository
                                .findById(request.toAccountId())
                                .orElseThrow(
                                        () ->
                                                new ResponseStatusException(
                                                        HttpStatus.NOT_FOUND,
                                                        "Account not found: "
                                                                + request.toAccountId()))
                        : null;
        entry.update(
                group,
                category,
                subcategory,
                request.amount(),
                request.transactionAt(),
                fromAccount,
                toAccount,
                request.memo());
        return EntryResponse.from(entry);
    }

    public EntryResponse create(EntryCreateRequest request) {
        CategoryGroup group =
                categoryGroupRepository
                        .findByName(request.type())
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "CategoryGroup not found: " + request.type()));
        Category category =
                request.categoryId() != null
                        ? categoryRepository
                                .findById(request.categoryId())
                                .orElseThrow(
                                        () ->
                                                new ResponseStatusException(
                                                        HttpStatus.NOT_FOUND,
                                                        "Category not found: "
                                                                + request.categoryId()))
                        : null;
        Subcategory subcategory =
                request.subcategoryId() != null
                        ? subcategoryRepository
                                .findById(request.subcategoryId())
                                .orElseThrow(
                                        () ->
                                                new ResponseStatusException(
                                                        HttpStatus.NOT_FOUND,
                                                        "Subcategory not found: "
                                                                + request.subcategoryId()))
                        : null;
        Account fromAccount =
                request.fromAccountId() != null
                        ? accountRepository
                                .findById(request.fromAccountId())
                                .orElseThrow(
                                        () ->
                                                new ResponseStatusException(
                                                        HttpStatus.NOT_FOUND,
                                                        "Account not found: "
                                                                + request.fromAccountId()))
                        : null;
        Account toAccount =
                request.toAccountId() != null
                        ? accountRepository
                                .findById(request.toAccountId())
                                .orElseThrow(
                                        () ->
                                                new ResponseStatusException(
                                                        HttpStatus.NOT_FOUND,
                                                        "Account not found: "
                                                                + request.toAccountId()))
                        : null;

        Entry entry =
                Entry.builder()
                        .categoryGroup(group)
                        .category(category)
                        .subcategory(subcategory)
                        .amount(request.amount())
                        .transactionAt(request.transactionAt())
                        .fromAccount(fromAccount)
                        .toAccount(toAccount)
                        .memo(request.memo())
                        .build();
        return EntryResponse.from(entryRepository.save(entry));
    }
}
