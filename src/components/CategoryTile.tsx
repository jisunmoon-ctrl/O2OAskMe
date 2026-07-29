import { Flex, Text } from '@bucketplace/design-system';
import { AssetImage, type AssetComponent, CATEGORY_ASSET } from './assets';

export interface CategoryTileProps {
  /** 카테고리 라벨 (예: "도배"). CATEGORY_ASSET 키와 일치하면 자산이 자동 매핑됩니다. */
  label: string;
  /** 라벨로 자산을 찾지 못하거나 다른 자산을 쓰고 싶을 때 직접 지정. */
  asset?: AssetComponent;
  /** 선택 상태. true 면 backgroundWeak 배경이 적용됩니다. */
  selected?: boolean;
  onClick?: () => void;
}

/**
 * CategoryTile — 리모델링 시공 범위 선택 타일.
 *
 * Figma: 💬 Chat > type=type grid-tile / 🃏 Cards > GridTile (state=default|selected)
 * 규격: 77px 높이, 8px radius, 자산 44px + 라벨(detail12L16 medium).
 * 선택 시 backgroundWeak(#f5f5f5) 배경.
 *
 * 라벨 색은 Figma 상 base_1(#2f3438)이지만 ODS semantic 토큰인 foreground 를 사용합니다.
 * (ODS_PROTOTYPE_GUIDE §4.4 — base_1 palette 를 코드 토큰으로 직접 emit 하지 않음)
 */
export function CategoryTile({ label, asset, selected = false, onClick }: CategoryTileProps) {
  const resolvedAsset = asset ?? CATEGORY_ASSET[label];

  return (
    <Flex
      as={onClick ? 'button' : 'div'}
      direction="column"
      align="center"
      justify="center"
      gap={2}
      h={77}
      py={4}
      bdr={8}
      w="100%"
      overflow="hidden"
      bgc={selected ? 'backgroundWeak' : undefined}
      asProps={onClick ? { type: 'button', onClick } : undefined}
    >
      {resolvedAsset ? <AssetImage asset={resolvedAsset} size={44} /> : null}
      <Text variant="detail12L16" weight={500} color="foreground" align="center">
        {label}
      </Text>
    </Flex>
  );
}
