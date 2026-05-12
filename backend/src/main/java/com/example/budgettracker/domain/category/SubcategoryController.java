package com.example.budgettracker.domain.category;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/subcategories")
@RequiredArgsConstructor
@Tag(name = "Subcategory")
public class SubcategoryController {

    private final SubcategoryService subcategoryService;

    @GetMapping
    public ResponseEntity<List<SubcategoryResponse>> findAllByCategory(
            @RequestParam Long categoryId) {
        return ResponseEntity.ok(subcategoryService.findAllByCategory(categoryId));
    }

    @PostMapping
    public ResponseEntity<SubcategoryResponse> create(
            @Valid @RequestBody SubcategoryCreateRequest request) {
        SubcategoryResponse response = subcategoryService.create(request);
        return ResponseEntity.created(URI.create("/subcategories/" + response.id()))
                .body(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SubcategoryResponse> update(
            @PathVariable Long id, @Valid @RequestBody SubcategoryUpdateRequest request) {
        return ResponseEntity.ok(subcategoryService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        subcategoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
