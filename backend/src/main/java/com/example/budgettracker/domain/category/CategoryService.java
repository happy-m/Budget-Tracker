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
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryGroupRepository categoryGroupRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> findAllByType(CategoryGroupKind type) {
        CategoryGroup group = findGroup(type);
        return categoryRepository.findAllByCategoryGroupOrderByDisplayOrderAscIdAsc(group).stream()
                .map(CategoryResponse::from)
                .toList();
    }

    public CategoryResponse create(CategoryCreateRequest request) {
        CategoryGroup group = findGroup(request.type());
        int displayOrder = categoryRepository.findMaxDisplayOrderByGroup(group) + 1;
        Category category =
                Category.builder()
                        .categoryGroup(group)
                        .name(request.name())
                        .displayOrder(displayOrder)
                        .build();
        return CategoryResponse.from(categoryRepository.save(category));
    }

    public CategoryResponse update(Long id, CategoryUpdateRequest request) {
        Category category =
                categoryRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Category not found: " + id));
        category.update(request.name(), request.displayOrder());
        return CategoryResponse.from(category);
    }

    public void delete(Long id) {
        Category category =
                categoryRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Category not found: " + id));
        categoryRepository.delete(category);
    }

    private CategoryGroup findGroup(CategoryGroupKind type) {
        return categoryGroupRepository
                .findByName(type)
                .orElseThrow(
                        () ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "CategoryGroup not found: " + type));
    }
}
