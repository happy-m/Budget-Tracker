package com.example.budgettracker.domain.account;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/account-groups")
@RequiredArgsConstructor
public class AccountGroupController {

    private final AccountGroupService accountGroupService;

    @GetMapping
    public ResponseEntity<List<AccountGroupResponse>> findAll() {
        return ResponseEntity.ok(accountGroupService.findAll());
    }

    @PostMapping
    public ResponseEntity<AccountGroupResponse> create(
            @Valid @RequestBody AccountGroupCreateRequest request) {
        AccountGroupResponse response = accountGroupService.create(request);
        return ResponseEntity.created(URI.create("/api/account-groups/" + response.id()))
                .body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountGroupResponse> update(
            @PathVariable Long id, @Valid @RequestBody AccountGroupUpdateRequest request) {
        return ResponseEntity.ok(accountGroupService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        accountGroupService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
