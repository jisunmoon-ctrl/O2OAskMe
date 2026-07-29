import { useState } from 'react';
import { Flex, Text } from '@bucketplace/design-system';
import { ServiceListItem } from '../components';

const TITLE = '집 전체 리모델링';
const DESC = '원하는 스타일과 예산에 맞춘 종합 리모델링';

/**
 * ListContentFrame — Figma 📋 List & Content (node 175:2631) 재현.
 * Setup 헤더 + ServiceListItem 4개 상태(default / selected / disabled / disabled+checked).
 */
export function ListContentFrame() {
  const [checkedA, setCheckedA] = useState(false);
  const [checkedB, setCheckedB] = useState(true);

  return (
    <Flex direction="column" gap={24} bgc="background" p={40} bdr={20} maw={455}>
      <Text variant="heading32" weight={700} color="foreground">
        📋 List &amp; Content
      </Text>

      {/* Setup 헤더 */}
      <Text variant="body16L20" weight={600} color="foreground">
        상담 받고 싶은 서비스를 모두 선택해주세요.
      </Text>

      <Flex direction="column" gap={12}>
        {/* default — unchecked */}
        <ServiceListItem
          title={TITLE}
          description={DESC}
          checked={checkedA}
          onCheckedChange={setCheckedA}
        />
        {/* default — checked */}
        <ServiceListItem
          title={TITLE}
          description={DESC}
          checked={checkedB}
          onCheckedChange={setCheckedB}
        />
        {/* disabled — unchecked */}
        <ServiceListItem title={TITLE} description={DESC} disabled checked={false} />
        {/* disabled — checked */}
        <ServiceListItem title={TITLE} description={DESC} disabled checked />
      </Flex>
    </Flex>
  );
}
