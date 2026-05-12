package com.example.budgettracker.domain.category;

import com.example.budgettracker.common.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "subcategories")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Subcategory extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(nullable = false)
    private int displayOrder;

    @Builder
    public Subcategory(Category category, String name, int displayOrder) {
        this.category = category;
        this.name = name;
        this.displayOrder = displayOrder;
    }

    public void update(String name, Integer displayOrder) {
        if (name != null) this.name = name;
        if (displayOrder != null) this.displayOrder = displayOrder;
    }
}
