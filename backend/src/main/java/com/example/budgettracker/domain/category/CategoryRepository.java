package com.example.budgettracker.domain.category;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findAllByCategoryGroupOrderByDisplayOrderAscIdAsc(CategoryGroup categoryGroup);

    @Query(
            "SELECT COALESCE(MAX(c.displayOrder), -1) FROM Category c "
                    + "WHERE c.categoryGroup = :group")
    int findMaxDisplayOrderByGroup(@Param("group") CategoryGroup group);
}
