import { Checkbox, Flex, Text } from '@bucketplace/design-system';
import { useTheme } from '@bucketplace/tokens';
import { AssetImage, type AssetComponent, HOUSE_WITH_DRILL_ASSET } from './assets';

export interface ServiceListItemProps {
  title: string;
  description: string;
  /** 리딩 자산 아이콘. 기본값은 집 전체 리모델링 아이콘. */
  asset?: AssetComponent;
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * ServiceListItem — 상담 신청 서비스 선택 리스트 행.
 *
 * Figma: 📋 List & Content > List (type=default, states: default/selected/disabled)
 * border(1px, border 토큰) + radius 12, px12 py16, gap12.
 * 왼쪽 자산 아이콘 + [제목(body16 semibold) · 설명(body14 weak)] + 오른쪽 ODS Checkbox.
 * disabled 는 행 전체 opacity 40% + Checkbox disabled.
 */
export function ServiceListItem({
  title,
  description,
  asset = HOUSE_WITH_DRILL_ASSET,
  checked = false,
  disabled = false,
  onCheckedChange,
}: ServiceListItemProps) {
  const theme = useTheme();

  return (
    <Flex
      direction="row"
      align="center"
      gap={12}
      px={12}
      py={16}
      w="100%"
      bgc="background"
      bd={`1px solid ${theme.colors.border}`}
      bdr={12}
      opacity={disabled ? 0.4 : 1}
    >
      <AssetImage asset={asset} size={40} />

      <Flex direction="column" gap={4} grow={1} miw={0}>
        <Text variant="body16L20" weight={600} color="foreground" wordBreak="break-word">
          {title}
        </Text>
        <Text variant="body14L18" weight={400} color="foregroundWeak" wordBreak="break-word">
          {description}
        </Text>
      </Flex>

      <Checkbox
        checked={checked}
        disabled={disabled}
        onCheckedChange={(state) => onCheckedChange?.(state === true)}
      >
        <Checkbox.Indicator>
          <Checkbox.IndicatorIcon />
        </Checkbox.Indicator>
      </Checkbox>
    </Flex>
  );
}
