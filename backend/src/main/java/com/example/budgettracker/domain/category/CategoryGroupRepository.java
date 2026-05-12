package com.example.budgettracker.domain.category;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryGroupRepository extends JpaRepository<CategoryGroup, Long> {
    Optional<CategoryGroup> findByName(CategoryGroupKind name);
}
