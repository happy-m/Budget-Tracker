ALTER TABLE categories    ADD COLUMN display_order INT NOT NULL DEFAULT 0;
ALTER TABLE subcategories ADD COLUMN display_order INT NOT NULL DEFAULT 0;

CREATE INDEX idx_categories_display_order    ON categories    (category_group_id, display_order);
CREATE INDEX idx_subcategories_display_order ON subcategories (category_id, display_order);
