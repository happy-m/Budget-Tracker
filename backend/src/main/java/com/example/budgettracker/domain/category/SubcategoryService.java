package com.example.budgettracker.domain.category;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class SubcategoryService {

    private final SubcategoryRepository subcategoryRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<SubcategoryResponse> findAllByCategory(Long categoryId) {
        Category category = findCategory(categoryId);
        return subcategoryRepository.findAllByCategoryOrderByDisplayOrderAscIdAsc(category).stream()
                .map(SubcategoryResponse::from)
                .toList();
    }

    public SubcategoryResponse create(SubcategoryCreateRequest request) {
        Category category = findCategory(request.categoryId());
        int displayOrder = subcategoryRepository.findMaxDisplayOrderByCategory(category) + 1;
        Subcategory sub =
                Subcategory.builder()
                        .category(category)
                        .name(request.name())
                        .displayOrder(displayOrder)
                        .build();
        return SubcategoryResponse.from(subcategoryRepository.save(sub));
    }

    public SubcategoryResponse update(Long id, SubcategoryUpdateRequest request) {
        Subcategory sub =
                subcategoryRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Subcategory not found: " + id));
        sub.update(request.name(), request.displayOrder());
        return SubcategoryResponse.from(sub);
    }

    public void delete(Long id) {
        Subcategory sub =
                subcategoryRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Subcategory not found: " + id));
        subcategoryRepository.delete(sub);
    }

    private Category findCategory(Long categoryId) {
        return categoryRepository
                .findById(categoryId)
                .orElseThrow(
                        () ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Category not found: " + categoryId));
    }
}
