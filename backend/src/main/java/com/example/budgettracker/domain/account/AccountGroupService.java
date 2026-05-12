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
public class AccountGroupService {

    private final AccountGroupRepository accountGroupRepository;

    @Transactional(readOnly = true)
    public List<AccountGroupResponse> findAll() {
        return accountGroupRepository.findAll().stream().map(AccountGroupResponse::from).toList();
    }

    public AccountGroupResponse create(AccountGroupCreateRequest request) {
        AccountGroup group =
                AccountGroup.builder().name(request.name()).kind(request.kind()).build();
        AccountGroup saved = accountGroupRepository.save(group);
        return AccountGroupResponse.from(saved);
    }

    public AccountGroupResponse update(Long id, AccountGroupUpdateRequest request) {
        AccountGroup group =
                accountGroupRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "AccountGroup not found: " + id));
        group.update(request.name(), request.kind());
        return AccountGroupResponse.from(group);
    }

    public void delete(Long id) {
        AccountGroup group =
                accountGroupRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "AccountGroup not found: " + id));
        accountGroupRepository.delete(group);
    }
}
