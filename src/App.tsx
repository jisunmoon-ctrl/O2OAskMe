import { Flex } from '@bucketplace/design-system';
import { ChatFrame, CardsFrame, ListContentFrame } from './frames';

/**
 * 3개 Figma 프레임(Chat / Cards / List & Content)을 한 화면에 렌더하는 데모.
 * 실제 프로토타입은 이 프레임들이 조립한 컴포넌트(src/components)를 재사용해 구성합니다.
 */
export function App() {
  return (
    <Flex direction="row" wrap="wrap" gap={40} align="flex-start" p={40} bgc="backgroundWeak">
      <ChatFrame />
      <CardsFrame />
      <ListContentFrame />
    </Flex>
  );
}
