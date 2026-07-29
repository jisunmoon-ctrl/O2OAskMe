import { useState } from 'react';
import { Flex, Text } from '@bucketplace/design-system';
import { CategoryTile, EstimateCard, SERVICE_ASSET } from '../components';

/**
 * CardsFrame — Figma 🃏 Cards (node 175:2629) 재현.
 * CategoryTile(default/selected) + EstimateCard(summary / list_confirm) 조립 예시.
 */
export function CardsFrame() {
  const [selected, setSelected] = useState(true);

  return (
    <Flex direction="column" gap={24} bgc="background" p={40} bdr={20} maw={455}>
      <Text variant="heading32" weight={700} color="foreground">
        🃏 Cards
      </Text>

      {/* CategoryTile — default vs selected */}
      <Flex direction="row" gap={8} align="center">
        <Flex w={74.75}>
          <CategoryTile label="도배" selected={!selected} onClick={() => setSelected(false)} />
        </Flex>
        <Flex w={74.75}>
          <CategoryTile label="도배" selected={selected} onClick={() => setSelected(true)} />
        </Flex>
      </Flex>

      {/* EstimateCard — summary */}
      <EstimateCard
        title="집 전체 시공"
        icon={SERVICE_ASSET.집전체시공}
        rows={[
          { label: '예상', value: '1,000만원부터' },
          { label: '범위', value: '도배,장판 포함, 상담 후 결정' },
          { label: '평수', value: '30평대' },
        ]}
      />

      {/* list_confirm 행 — 라벨/값 강조 (body16, foreground medium) */}
      <Flex direction="row" gap={8} align="flex-start">
        <Flex w={60} shrink={0}>
          <Text variant="body16L20" weight={400} color="foregroundWeak">
            평수
          </Text>
        </Flex>
        <Text variant="body16L20" weight={500} color="foreground">
          20평대
        </Text>
      </Flex>
    </Flex>
  );
}
