import { Flex, Text } from '@bucketplace/design-system';
import { AssetImage, type AssetComponent } from './assets';

export interface EstimateRow {
  label: string;
  value: string;
}

export interface EstimateCardData {
  /** 카드 제목 (예: "집 전체 시공", "시공", "이사"). */
  title: string;
  /** 제목 왼쪽 리딩 자산 아이콘 (SERVICE_ASSET 참고). 없으면 아이콘 없이 렌더. */
  icon?: AssetComponent;
  rows: EstimateRow[];
}

export interface EstimateCardProps extends EstimateCardData {
  /**
   * true 면 값(value)을 foreground/medium 으로 강조합니다 (Figma list_confirm 스타일).
   * 기본 false — 값은 foregroundWeak/regular (Figma summary 스타일).
   */
  emphasizeValues?: boolean;
  /** 리딩 아이콘 크기(px). Figma price(-dropdown) 카드 기준 기본 36. */
  iconSize?: number;
  /** 행 라벨 고정 폭(px). Figma price-dropdown 기준 기본 48. */
  labelWidth?: number;
}

/**
 * EstimateCard — 서비스 견적 요약 카드.
 *
 * Figma: 🃏 Cards > Card(type=summary) / 💬 Chat > type=price·price-dropdown > card
 * 아이콘(36) + 제목(body16L20 semibold) + [라벨(w48) · 값] 행 반복. 값 색은 기본 foregroundWeak.
 * 레이아웃은 Flex, 타이포는 Text 로만 처리합니다 (Text 에 width/grow 미지원).
 */
export function EstimateCard({
  title,
  icon,
  rows,
  emphasizeValues = false,
  iconSize = 36,
  labelWidth = 48,
}: EstimateCardProps) {
  return (
    <Flex direction="row" gap={10} pb={12} align="flex-start" w="100%">
      {icon ? <AssetImage asset={icon} size={iconSize} /> : null}

      <Flex direction="column" grow={1} miw={0} w="100%">
        <Flex align="center" pb={9} w="100%">
          <Text variant="body16L20" weight={600} color="foreground" wordBreak="break-word">
            {title}
          </Text>
        </Flex>

        {rows.map((row, i) => (
          <Flex key={`${row.label}-${i}`} direction="row" gap={8} pb={4} align="flex-start" w="100%">
            <Flex w={labelWidth} shrink={0}>
              <Text
                variant="body14L18"
                weight={400}
                color="foregroundWeak"
                whiteSpace="nowrap"
                truncate
              >
                {row.label}
              </Text>
            </Flex>
            <Flex grow={1} miw={0}>
              <Text
                variant="body14L18"
                weight={emphasizeValues ? 500 : 400}
                color={emphasizeValues ? 'foreground' : 'foregroundWeak'}
                wordBreak="break-word"
              >
                {row.value}
              </Text>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}
