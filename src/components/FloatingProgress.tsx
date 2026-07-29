import { BoxButton, Box, Flex, Loading, Text } from '@bucketplace/design-system';
import { useTheme } from '@bucketplace/tokens';
import { IconTextDocumentFilled, IconCheck } from '@bucketplace/icons';

export type FloatingProgressVariant = 'loading' | 'progress' | 'confirm' | 'inquiry';

export interface FloatingProgressProps {
  variant: FloatingProgressVariant;
  /** loading — 로딩 문구 */
  loadingLabel?: string;
  /** progress — 진행 문구 + 단계 표시 */
  progressLabel?: string;
  step?: number;
  total?: number;
  /** confirm/inquiry — 견적 라벨·값 */
  estimateLabel?: string;
  estimateValue?: string;
  /** confirm/inquiry — 우측 버튼 라벨(미지정 시 variant 기본값) */
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * ext.o2o.shadow.card (Figma) — offset(2,2)·blur10·#C2C8CC33.
 * ODS theme.shadow 에 대응 토큰이 없어 [토큰 예외]로 실측값을 사용한다.
 */
const CARD_SHADOW = '2px 2px 10px rgba(194, 200, 204, 0.2)';

/**
 * FloatingProgress — 화면 하단에 떠 있는 진행/견적 플로팅 바.
 *
 * Figma: floatingProgress (node 178:23968) · variants: loading / progress / confirm / Inquiry
 * 흰 바(background) · rounded 4 · gap 8 · ext.o2o.shadow.card.
 * loading·progress 는 p12, confirm·inquiry 는 px12 py8(버튼 높이 수용).
 */
export function FloatingProgress(props: FloatingProgressProps) {
  const { variant } = props;
  const isEstimate = variant === 'confirm' || variant === 'inquiry';

  return (
    <Flex
      direction="row"
      align="center"
      gap={8}
      w="100%"
      bgc="background"
      bdr={4}
      px={12}
      py={isEstimate ? 8 : 12}
      style={{ boxShadow: CARD_SHADOW }}
    >
      <Left {...props} />
      <Right {...props} />
    </Flex>
  );
}

/** 좌측 아이콘 + 문구 (grow) */
function Left({
  variant,
  loadingLabel = '총 예상 견적 계산 중...',
  progressLabel = '필수 정보 입력',
  estimateLabel = '총 예상 견적',
  estimateValue = '',
}: FloatingProgressProps) {
  const theme = useTheme();

  if (variant === 'loading') {
    return (
      <Flex direction="row" align="center" gap={7} grow={1} miw={0}>
        <Loading size={20} />
        <Text variant="body14L18" weight={500} color="foreground" wordBreak="break-word">
          {loadingLabel}
        </Text>
      </Flex>
    );
  }

  if (variant === 'progress') {
    return (
      <Flex direction="row" align="center" gap={8} grow={1} miw={0}>
        {/* 완료 표시 링 — 20px 원(backgroundWeak) + 2px borderStrong + Check(foreground) */}
        <Flex
          shrink={0}
          w={20}
          h={20}
          align="center"
          justify="center"
          bgc="backgroundWeak"
          bdr="50%"
          bd={`2px solid ${theme.colors.borderStrong}`}
          style={{ color: theme.colors.foreground }}
        >
          <IconCheck size={12} weight="regular" />
        </Flex>
        <Text variant="body14L18" weight={500} color="foreground" wordBreak="break-word">
          {progressLabel}
        </Text>
      </Flex>
    );
  }

  // confirm / inquiry — [문서 아이콘 + 라벨](gap4) + 값
  return (
    <Flex direction="row" align="center" gap={7} grow={1} miw={0}>
      <Flex direction="row" align="center" gap={4} shrink={0}>
        <Box style={{ display: 'flex', color: theme.colors.foregroundWeak }}>
          <IconTextDocumentFilled size={16} weight="regular" />
        </Box>
        <Text variant="body14L18" weight={500} color="foreground" whiteSpace="nowrap">
          {estimateLabel}
        </Text>
      </Flex>
      <Text variant="body14L18" weight={600} color="foreground" whiteSpace="nowrap">
        {estimateValue}
      </Text>
    </Flex>
  );
}

/** 우측 — progress: 단계 카운트 / confirm·inquiry: 액션 버튼 */
function Right({ variant, step = 1, total = 5, actionLabel, onAction }: FloatingProgressProps) {
  if (variant === 'progress') {
    return (
      <Text variant="body14L18" weight={400} color="foregroundWeak">
        {step}/{total}
      </Text>
    );
  }

  if (variant === 'confirm' || variant === 'inquiry') {
    const disabled = variant === 'inquiry';
    const label = actionLabel ?? (disabled ? '상담예약중' : '상담신청');
    return (
      <BoxButton size="small" variant="normal" disabled={disabled} onClick={onAction}>
        <BoxButton.Slot side="center">
          <BoxButton.Label>{label}</BoxButton.Label>
        </BoxButton.Slot>
      </BoxButton>
    );
  }

  return null;
}
