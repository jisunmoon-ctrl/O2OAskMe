import { Flex } from '@bucketplace/design-system';
import { useTheme } from '@bucketplace/tokens';
import { IconArrowUpCircleFilled, IconMagnifyingGlass, IconArrowRight } from '@bucketplace/icons';

export type ChatActionIcon = 'send' | 'search' | 'arrowright';

export interface ChatActionButtonProps {
  icon: ChatActionIcon;
  onClick?: () => void;
  'aria-label'?: string;
}

const DEFAULT_LABEL: Record<ChatActionIcon, string> = {
  send: '보내기',
  search: '검색',
  arrowright: '다음',
};

/**
 * ChatActionButton — 채팅 입력 하단 액션 버튼 (검은 원형).
 *
 * Figma: 💬 Chat > btn (icon=send | search | arrowright)
 * 40px 원형. send 는 ODS IconArrowUpCircleFilled(자체 원형 채움)을 foreground 로,
 * search/arrowright 는 backgroundInverse 원형 + foregroundInverse 글리프로 렌더합니다.
 * 아이콘 색은 currentColor 상속(semantic 토큰), 아이콘은 전부 @bucketplace/icons.
 */
export function ChatActionButton({ icon, onClick, ...rest }: ChatActionButtonProps) {
  const theme = useTheme();
  const ariaLabel = rest['aria-label'] ?? DEFAULT_LABEL[icon];

  if (icon === 'send') {
    return (
      <Flex
        as="button"
        w={40}
        h={40}
        align="center"
        justify="center"
        style={{ color: theme.colors.foreground }}
        asProps={{ type: 'button', 'aria-label': ariaLabel, onClick }}
      >
        <IconArrowUpCircleFilled size={40} weight="regular" />
      </Flex>
    );
  }

  const Glyph = icon === 'search' ? IconMagnifyingGlass : IconArrowRight;

  return (
    <Flex
      as="button"
      w={40}
      h={40}
      align="center"
      justify="center"
      bgc="backgroundInverse"
      bdr="50%"
      style={{ color: theme.colors.foregroundInverse }}
      asProps={{ type: 'button', 'aria-label': ariaLabel, onClick }}
    >
      <Glyph size={24} weight="regular" />
    </Flex>
  );
}
