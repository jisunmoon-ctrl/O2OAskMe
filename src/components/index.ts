// ─────────────────────────────────────────────────────────────────────────────
// O2O 통합 신청폼 — 프로토타입 컴포넌트 라이브러리 (barrel)
//
// 앞으로 프로토타입을 구성할 때는 아래 컴포넌트 variable 을 import 해서 조립합니다.
// 새 UI 요소가 필요하면 먼저 여기 정의된 컴포넌트를 재사용하고,
// 없으면 ODS 카탈로그(list_components) 확인 후 이 라이브러리에 추가합니다.
// 규칙: ODS_PROTOTYPE_GUIDE.md / COMPONENTS.md 참고.
// ─────────────────────────────────────────────────────────────────────────────

// 자산 매핑 & 유틸
export {
  AssetImage,
  CATEGORY_ASSET,
  SERVICE_ASSET,
  HOUSE_WITH_DRILL_ASSET,
  REMODELING_CATEGORIES,
  type AssetComponent,
  type AssetImageProps,
} from './assets';

// 카테고리 선택
export { CategoryTile, type CategoryTileProps } from './CategoryTile';
export { CategoryGrid, type CategoryGridProps } from './CategoryGrid';

// 견적 카드
export {
  EstimateCard,
  type EstimateCardProps,
  type EstimateCardData,
  type EstimateRow,
} from './EstimateCard';

// 서비스 선택 리스트
export { ServiceListItem, type ServiceListItemProps } from './ServiceListItem';

// 채팅 액션 버튼
export {
  ChatActionButton,
  type ChatActionButtonProps,
  type ChatActionIcon,
} from './ChatActionButton';

// 하단 플로팅 진행/견적 바
export {
  FloatingProgress,
  type FloatingProgressProps,
  type FloatingProgressVariant,
} from './FloatingProgress';

// 채팅 말풍선
export {
  LoadingBubble,
  type LoadingBubbleProps,
  MessageBubble,
  type MessageBubbleProps,
  PriceBubble,
  type PriceBubbleProps,
  TypeBubble,
  type TypeBubbleProps,
  type TypeBubbleFooterCheckbox,
} from './ChatBubble';
