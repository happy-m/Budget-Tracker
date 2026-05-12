package com.example.budgettracker.domain.category;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {

    List<Subcategory> findAllByCategoryOrderByDisplayOrderAscIdAsc(Category category);

    @Query(
            "SELECT COALESCE(MAX(s.displayOrder), -1) FROM Subcategory s "
                    + "WHERE s.category = :category")
    int findMaxDisplayOrderByCategory(@Param("category") Category category);
}
