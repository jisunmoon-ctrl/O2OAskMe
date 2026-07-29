# O2O 통합 신청폼 — 프로토타입 컴포넌트 라이브러리

Figma [O2O서비스허브](https://www.figma.com/design/RU5G6QgqKVv5IdyL0qJ1M1/O2O%EC%84%9C%EB%B9%84%EC%8A%A4%ED%97%88%EB%B8%8C) 의 3개 프레임(💬 Chat · 🃏 Cards · 📋 List & Content)에서 사용된 컴포넌트를 TSX 로 추출한 라이브러리입니다.

> **앞으로 프로토타입을 구성할 때는 새 UI 요소를 직접 만들지 말고, 아래 컴포넌트 variable 을 `src/components` 에서 import 해서 조립합니다.**
> 없는 컴포넌트가 필요하면 ODS 카탈로그(`list_components`)를 먼저 확인하고, ODS primitive + 토큰으로 만들어 이 라이브러리에 추가합니다. (규칙: [ODS_PROTOTYPE_GUIDE.md](../ODS_PROTOTYPE_GUIDE.md))

모든 컴포넌트는 ODS ground truth 만 사용합니다 — 색/타이포는 semantic 토큰, 아이콘은 `@bucketplace/icons`, 이미지는 `@bucketplace/assets`, primitive 는 `@bucketplace/design-system`.

## 컴포넌트 variable 목록

`import { ... } from './components'` (barrel: `src/components/index.ts`)

| variable | 역할 | Figma 출처 | 사용 ODS |
|---|---|---|---|
| `MessageBubble` | 대화 말풍선 (`variant='assistant' \| 'user'`) | Chat · counter/answer | Flex · Text |
| `LoadingBubble` | 견적 생성중 로딩 표시 | Chat · loading | Loading · Flex |
| `PriceBubble` | 총 예상 견적 요약(헤더+설명+Divider+카드), 접힘/펼침(`expanded`) | Chat · price / price-dropdown | Divider · BoxButton · Box · Flex · Text |
| `TypeBubble` | 시공 범위 선택(안내문구+그리드+체크박스) | Chat · type | Checkbox · Flex · Text |
| `CategoryGrid` | 카테고리 4열 그리드 | Chat · type · contents | Box |
| `CategoryTile` | 카테고리 타일 (`selected`) | Chat/Cards · grid-tile | Flex · Text |
| `EstimateCard` | 서비스 견적 카드 (제목+라벨/값 행, `emphasizeValues`) | Cards/Chat · card | Flex · Text |
| `ServiceListItem` | 서비스 선택 리스트 행 (`checked`/`disabled`) | List & Content · List | Checkbox · Flex · Text |
| `ChatActionButton` | 채팅 액션 버튼 (`icon='send' \| 'search' \| 'arrowright'`) | Chat · btn | Flex · IconButton icons |
| `FloatingProgress` | 하단 플로팅 진행/견적 바 (`variant='loading' \| 'progress' \| 'confirm' \| 'inquiry'`) | floatingProgress (178:23968) | Loading · BoxButton · Flex · Text |
| `AssetImage` | ODS 자산을 고정 정사각 박스에 렌더 | 공통 | Box · @bucketplace/assets |

### 데이터/자산 매핑 variable

| variable | 내용 |
|---|---|
| `REMODELING_CATEGORIES` | 12개 리모델링 카테고리 라벨 배열(도배·장판·욕실·주방·마루·타일·중문/도어·창호/샷시·시트필름·커튼/블라인드·조명·페인트) |
| `CATEGORY_ASSET` | 카테고리 라벨 → `@bucketplace/assets` 이미지 매핑 |
| `SERVICE_ASSET` | `시공`/`이사`/`인터넷`/`집전체시공` → 견적카드 리딩 아이콘 |
| `HOUSE_WITH_DRILL_ASSET` | 집 전체 리모델링 리스트 아이콘 |

### 타입 variable

`EstimateCardData` · `EstimateRow` · `AssetComponent` · 각 컴포넌트 `*Props`.

## 사용 예시

```tsx
import {
  MessageBubble, PriceBubble, TypeBubble, EstimateCard,
  ServiceListItem, ChatActionButton, SERVICE_ASSET,
  type EstimateCardData,
} from './components';

const services: EstimateCardData[] = [
  { title: '시공', icon: SERVICE_ASSET.시공, rows: [
    { label: '예산', value: '1,000만원부터' },
    { label: '평수', value: '30평대' },
  ]},
];

<MessageBubble variant="user">견적 빨리 받을 수 있을까요?</MessageBubble>
<PriceBubble estimateValue="2,000만원부터 ~" services={services} collapsedHeight={220} />
<ServiceListItem title="집 전체 리모델링" description="종합 리모델링" checked onCheckedChange={fn} />
```

3개 프레임 재현 예시는 `src/frames/{ChatFrame,CardsFrame,ListContentFrame}.tsx`, 통합 렌더는 `src/App.tsx` 참고.

## 실행 (선택)

이 저장소는 지금까지 self-contained HTML 프로토타입만 있었으므로 `@bucketplace/*` 패키지가 설치돼 있지 않습니다.
실제로 렌더하려면 ods-prototype MCP `get_starter_files` 로 Vite 스캐폴드(`.npmrc`/`vite.config.ts`/`tsconfig.json`/`src/main.tsx`/i18n/provider)를 받은 뒤 이 `src/` 를 얹고, `src/main.tsx` 에서 `App` 을 `DesignSystemProvider` 로 감싸 렌더합니다. (ODS_PROTOTYPE_GUIDE §2.3)

## 토큰/예외 메모

- `CategoryTile` 라벨 색: Figma 는 `base_1(#2f3438)` 이지만 ODS semantic `foreground` 사용 (palette 직접 emit 금지, GUIDE §4.4).
- `LoadingBubble` 그라데이션 텍스트: ODS textStyle 로 표현 불가한 장식. 타이포는 body16L20 재현, gradient stop 은 semantic `foregroundWeak → foreground` 만 사용.
- `ChatActionButton` send: ODS `IconArrowUpCircleFilled`(자체 원형) 그대로 사용, search/arrowright 는 `backgroundInverse` 원형 컨테이너 + 글리프.
