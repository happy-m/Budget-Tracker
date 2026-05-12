package com.example.budgettracker.domain.account;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class AccountService {

    private final AccountRepository accountRepository;
    private final AccountGroupRepository accountGroupRepository;

    @Transactional(readOnly = true)
    public List<AccountResponse> findAll() {
        return accountRepository.findAll().stream().map(AccountResponse::from).toList();
    }

    public AccountResponse create(AccountCreateRequest request) {
        AccountGroup group = findGroup(request.accountGroupId());
        Account account =
                Account.builder()
                        .accountGroup(group)
                        .name(request.name())
                        .balance(request.balance())
                        .build();
        return AccountResponse.from(accountRepository.save(account));
    }

    public AccountResponse update(Long id, AccountUpdateRequest request) {
        Account account =
                accountRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Account not found: " + id));
        AccountGroup group =
                request.accountGroupId() != null ? findGroup(request.accountGroupId()) : null;
        account.update(
                group,
                request.name(),
                request.balance(),
                request.excludeFromStats(),
                request.hidden());
        return AccountResponse.from(account);
    }

    public void delete(Long id) {
        Account account =
                accountRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Account not found: " + id));
        accountRepository.delete(account);
    }

    private AccountGroup findGroup(Long groupId) {
        return accountGroupRepository
                .findById(groupId)
                .orElseThrow(
                        () ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "AccountGroup not found: " + groupId));
    }
}
