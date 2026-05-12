package com.example.budgettracker.domain.entry;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/entries")
@RequiredArgsConstructor
@Tag(name = "Entry")
public class EntryController {

    private final EntryService entryService;

    @GetMapping
    public ResponseEntity<List<EntryResponse>> findAll() {
        return ResponseEntity.ok(entryService.findAll());
    }

    @PostMapping
    public ResponseEntity<EntryResponse> create(@Valid @RequestBody EntryCreateRequest request) {
        EntryResponse response = entryService.create(request);
        return ResponseEntity.created(URI.create("/entries/" + response.id())).body(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<EntryResponse> update(
            @PathVariable Long id, @Valid @RequestBody EntryUpdateRequest request) {
        return ResponseEntity.ok(entryService.update(id, request));
    }
}
