import { Box } from '@bucketplace/design-system';
import { CategoryTile } from './CategoryTile';
import { REMODELING_CATEGORIES } from './assets';

export interface CategoryGridProps {
  /** 표시할 카테고리 라벨 목록. 기본값은 12개 리모델링 카테고리 전체. */
  categories?: string[];
  /** 선택된 카테고리 라벨 집합. */
  selected?: string[];
  onSelect?: (label: string) => void;
}

/**
 * CategoryGrid — CategoryTile 4열 그리드.
 *
 * Figma: 💬 Chat > type=type > contents (4 cols x 3 rows, gap 4).
 */
export function CategoryGrid({
  categories = REMODELING_CATEGORIES,
  selected = [],
  onSelect,
}: CategoryGridProps) {
  return (
    <Box
      display="grid"
      w="100%"
      style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 4 }}
    >
      {categories.map((label) => (
        <CategoryTile
          key={label}
          label={label}
          selected={selected.includes(label)}
          onClick={onSelect ? () => onSelect(label) : undefined}
        />
      ))}
    </Box>
  );
}
