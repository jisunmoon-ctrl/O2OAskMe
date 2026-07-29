import { useState } from 'react';
import { Box, Flex, Text } from '@bucketplace/design-system';
import {
  ChatActionButton,
  LoadingBubble,
  MessageBubble,
  PriceBubble,
  TypeBubble,
  SERVICE_ASSET,
  type EstimateCardData,
} from '../components';

const QUESTION = '이사 날짜가 다음 달 15일인데\n견적서 빨리 받을 수 있을까요?';

// Figma type=price-dropdown (178:24099) 기준 4개 서비스 카드
const SCHEDULE = '2026년 10월 20일 - 2026년 11월 1일';
const SERVICES: EstimateCardData[] = [
  {
    title: '집 전체 시공',
    icon: SERVICE_ASSET.집전체시공,
    rows: [
      { label: '예산', value: '1,000만원대' },
      { label: '범위', value: '도배/장판 포함, 상담 후 결정' },
      { label: '평수', value: '30평대' },
      { label: '일정', value: SCHEDULE },
    ],
  },
  {
    title: '이사',
    icon: SERVICE_ASSET.이사,
    rows: [
      { label: '종류', value: '포장이사' },
      { label: '평수', value: '30평대' },
      { label: '출발지', value: '서울특별시 양천구 목동서로70 1610호' },
      { label: '일정', value: SCHEDULE },
    ],
  },
  {
    title: '인터넷',
    icon: SERVICE_ASSET.인터넷,
    rows: [
      { label: '통신사', value: '상관 없음' },
      { label: '결합', value: 'TV 결합' },
      { label: '일정', value: SCHEDULE },
    ],
  },
  {
    title: '렌탈',
    icon: SERVICE_ASSET.렌탈,
    rows: [
      { label: '품목', value: '정수기, 공기청정기' },
      { label: '일정', value: SCHEDULE },
    ],
  },
];

/**
 * ChatFrame — Figma 💬 Chat (node 175:2627) 재현.
 * MessageBubble / LoadingBubble / PriceBubble / TypeBubble / ChatActionButton 조립 예시.
 */
export function ChatFrame() {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<string[]>(['욕실', '타일']);
  const [addLater, setAddLater] = useState(false);

  const toggleCategory = (label: string) =>
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label],
    );

  return (
    <Flex direction="column" gap={24} bgc="background" p={40} bdr={20} maw={440}>
      <Text variant="heading32" weight={700} color="foreground">
        💬 Chat
      </Text>

      <Flex direction="column" gap={12}>
        <MessageBubble variant="assistant">{QUESTION}</MessageBubble>
        <LoadingBubble />
        <PriceBubble
          estimateValue="2,000만원부터 ~"
          description={'자세한 확정 견적은 파트너와 상담 후 확정되요.\n이 내용으로 맞춤 상담을 받아보세요.'}
          services={SERVICES}
          collapsedHeight={220}
          expanded={expanded}
          onToggleExpand={() => setExpanded((v) => !v)}
        />
        <TypeBubble
          selected={selected}
          onSelect={toggleCategory}
          footerCheckbox={{
            label: '상담 후 추가 결정할게요',
            checked: addLater,
            onCheckedChange: setAddLater,
          }}
        />
        <MessageBubble variant="user">{QUESTION}</MessageBubble>
      </Flex>

      <Box>
        <Flex direction="row" align="center" gap={20}>
          <ChatActionButton icon="send" />
          <ChatActionButton icon="search" />
          <ChatActionButton icon="arrowright" />
        </Flex>
      </Box>
    </Flex>
  );
}
