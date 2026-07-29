import type { ReactNode } from 'react';
import {
  BoxButton,
  Box,
  Checkbox,
  Divider,
  Flex,
  Loading,
  Text,
} from '@bucketplace/design-system';
import { useTheme } from '@bucketplace/tokens';
import { EstimateCard, type EstimateCardData } from './EstimateCard';
import { CategoryGrid } from './CategoryGrid';
import { REMODELING_CATEGORIES } from './assets';

// ─────────────────────────────────────────────────────────────────────────────
// LoadingBubble — 견적 생성 중 로딩 표시
// Figma: 💬 Chat > type=loading (Basic Loading + 그라데이션 텍스트)
// ─────────────────────────────────────────────────────────────────────────────
export interface LoadingBubbleProps {
  label?: string;
}

export function LoadingBubble({ label = '예상 견적 만드는 중...' }: LoadingBubbleProps) {
  const theme = useTheme();

  return (
    <Flex direction="row" align="center" gap={4}>
      <Loading size={16} />
      {/*
        그라데이션 텍스트는 ODS textStyle 로 표현 불가한 장식 처리입니다.
        타이포는 body16L20(16/20, -0.3) 을 그대로 재현하고,
        gradient stop 은 semantic 토큰(foregroundWeak → foreground)만 사용합니다.
      */}
      <span
        style={{
          fontSize: 16,
          lineHeight: '20px',
          fontWeight: 400,
          letterSpacing: '-0.3px',
          backgroundImage: `linear-gradient(90deg, ${theme.colors.foregroundWeak}, ${theme.colors.foreground})`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </Flex>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MessageBubble — 일반 대화 말풍선 (assistant / user)
// Figma: 💬 Chat > type=counter(assistant) / type=answer(user)
// ─────────────────────────────────────────────────────────────────────────────
export interface MessageBubbleProps {
  variant?: 'assistant' | 'user';
  children: ReactNode;
}

export function MessageBubble({ variant = 'assistant', children }: MessageBubbleProps) {
  const isUser = variant === 'user';

  return (
    <Flex direction="row" w="100%" justify={isUser ? 'flex-end' : 'flex-start'}>
      <Flex
        direction="column"
        maw={280}
        bdr={12}
        px={isUser ? 14 : 12}
        py={12}
        bgc={isUser ? 'backgroundInverse' : 'background'}
      >
        <Text
          variant="body16L20"
          weight={400}
          color={isUser ? 'foregroundInverse' : 'foreground'}
          wordBreak="break-word"
          whiteSpace="pre-line"
        >
          {children}
        </Text>
      </Flex>
    </Flex>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PriceBubble — 총 예상 견적 요약 말풍선 (접힘 type=price / 펼침 type=price-dropdown)
// Figma: 💬 Chat > type=price·price-dropdown (헤더 + 설명 + Divider + EstimateCard 목록 + 펼쳐보기)
// ─────────────────────────────────────────────────────────────────────────────
export interface PriceBubbleProps {
  estimateLabel?: string;
  estimateValue: string;
  description?: string;
  services: EstimateCardData[];
  /**
   * 지정 시 이 높이로 카드 목록을 클립하고 하단 shade + 펼쳐보기 버튼을 노출(Figma type=price).
   * expanded=true 면 전체 카드를 펼쳐 보여주고 버튼은 없앤다(Figma type=price-dropdown).
   */
  collapsedHeight?: number;
  expanded?: boolean;
  onToggleExpand?: () => void;
  expandLabel?: string;
}

export function PriceBubble({
  estimateLabel = '총 예상 견적',
  estimateValue,
  description,
  services,
  collapsedHeight,
  expanded = false,
  onToggleExpand,
  expandLabel = '펼쳐보기',
}: PriceBubbleProps) {
  const theme = useTheme();
  const collapsible = collapsedHeight != null;
  const clip = collapsible && !expanded;

  const cardList = (
    <Flex direction="column">
      {services.map((service, i) => (
        <EstimateCard key={`${service.title}-${i}`} {...service} />
      ))}
    </Flex>
  );

  return (
    <Flex direction="column" w={320} bgc="background" p={12} bdr={12}>
      <Flex direction="column" gap={2} pb={8}>
        <Text variant="detail13L18" weight={500} color="foreground">
          {estimateLabel}
        </Text>
        <Text variant="heading24" weight={600} color="foregroundBrand">
          {estimateValue}
        </Text>
      </Flex>

      {description ? (
        <Box pb={16}>
          <Text variant="detail13L18" weight={400} color="foreground" whiteSpace="pre-line">
            {description}
          </Text>
        </Box>
      ) : null}

      <Box pb={16}>
        <Divider height={1} />
      </Box>

      {clip ? (
        <Box position="relative" h={collapsedHeight} overflow="hidden" bdr={8}>
          {cardList}
          {/* 하단 shade: 잘린 카드 위에 배경색으로 페이드. stop 은 background 토큰 사용. */}
          <Box
            position="absolute"
            left={0}
            right={0}
            bottom={0}
            h={48}
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${theme.colors.background} 100%)`,
            }}
          />
        </Box>
      ) : (
        cardList
      )}

      {/* 펼쳐보기 버튼은 접힌 상태(type=price)에서만. 펼친 상태(type=price-dropdown)엔 버튼 없음 */}
      {clip ? (
        <Box pt={12}>
          <BoxButton size="medium" variant="outlined" fullWidth onClick={onToggleExpand}>
            <BoxButton.Slot side="center">
              <BoxButton.Label>{expandLabel}</BoxButton.Label>
            </BoxButton.Slot>
          </BoxButton>
        </Box>
      ) : null}
    </Flex>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TypeBubble — 시공 범위 선택 말풍선
// Figma: 💬 Chat > type=type (안내 문구 + CategoryGrid + 하단 Checkbox)
// ─────────────────────────────────────────────────────────────────────────────
export interface TypeBubbleFooterCheckbox {
  label: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export interface TypeBubbleProps {
  title?: string;
  categories?: string[];
  selected?: string[];
  onSelect?: (label: string) => void;
  footerCheckbox?: TypeBubbleFooterCheckbox;
}

export function TypeBubble({
  title = '리모델링 고민 중이신 범위를 알려주세요',
  categories = REMODELING_CATEGORIES,
  selected = [],
  onSelect,
  footerCheckbox,
}: TypeBubbleProps) {
  return (
    <Flex direction="column" gap={12} maw={330} bgc="background" px={14} py={12} bdr={12}>
      <Text variant="body16L20" weight={400} color="foreground">
        {title}
      </Text>

      <CategoryGrid categories={categories} selected={selected} onSelect={onSelect} />

      {footerCheckbox ? (
        <Checkbox
          checked={footerCheckbox.checked ?? false}
          onCheckedChange={(state) => footerCheckbox.onCheckedChange?.(state === true)}
        >
          <Checkbox.Indicator>
            <Checkbox.IndicatorIcon />
          </Checkbox.Indicator>
          <Checkbox.Label>{footerCheckbox.label}</Checkbox.Label>
        </Checkbox>
      ) : null}
    </Flex>
  );
}
