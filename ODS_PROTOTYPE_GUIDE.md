# ODS 컴포넌트 프로토타입 구현 지침

이 문서는 **오늘의집 Design System(ODS)** 컴포넌트를 이 프로젝트의 프로토타입 구현에 사용할 때 지켜야 할 규칙을 정의합니다.
ODS는 사내 git 레포에서 관리되고 사내 npm 레지스트리(Nexus)로 배포되므로, **임의 컴포넌트·임의 색·외부 아이콘을 새로 만들지 않고 배포된 패키지의 스펙을 그대로 재현**하는 것이 원칙입니다.

- 최종 갱신: 2026-07-27
- 대상: 프로토타입(PD/PO 검증용) 구현. **프로덕션 코드 생성용 지침이 아닙니다.**

---

## 1. ODS 소스 (git 레포 → 패키지 → 조회 도구)

ODS 컴포넌트의 원본은 아래 git 레포에 있으며, 사내 Nexus 레지스트리로 배포됩니다.

| 패키지 | 버전(검증 기준) | git 레포 | 디렉터리 |
|---|---|---|---|
| `@bucketplace/design-system` | 11.5.1 | `github.com/bucketplace/apps-web` | `packages/design-system` |
| `@bucketplace/tokens` | 3.12.0 | `github.com/bucketplace/apps-web` | `packages/tokens` |
| `@bucketplace/lib` | 3.3.0 | `github.com/bucketplace/apps-web` | `packages/lib` |
| `@bucketplace/icons` | 3.25.0 | `github.com/bucketplace/design-assets` | `packages/icons` |
| `@bucketplace/assets` | 4.78.0 | `github.com/bucketplace/design-assets` | `packages/assets` |
| `@bucketplace/ui` | 1.1.0 | `github.com/bucketplace/ohouse-web-front` | – |

### 1.1 ground truth 우선순위

구현 중 "이 컴포넌트가 ODS에 있나 / prop 이름이 뭔가 / 이 색 토큰이 뭔가"를 판단할 때 **아래 순서**로 확인합니다.
아래 어디에서도 근거를 찾지 못하면 **추측해서 만들지 말고** §7 예외 절차를 따릅니다.

1. **ods-prototype MCP** — `list_components`, `get_component`, `get_tokens`, `search_icon`, `search_asset`, `check_component_name`, `get_preview_harness`, `list_recipes`
2. **`node_modules/@bucketplace/*`** — 설치된 패키지의 `dist/*.d.ts`, `package.json`. MCP 미사용 시 오프라인 ground truth
3. **ods-hermes MCP** (`retrieve_ods_evidence`) — 컴포넌트 선택 판단·가이드라인 문서 근거
4. **git 레포 소스** — 위 표의 레포/디렉터리. 배포본에 없는 최신 변경이나 내부 구현 확인이 필요할 때만

> ⚠️ 웹 검색·기억·유추로 ODS API를 작성하지 않습니다. ODS는 사내 비공개 패키지라 외부 문서가 존재하지 않거나 오래됐습니다.

---

## 2. 프로젝트 셋업

### 2.1 레지스트리 인증

`@bucketplace` 스코프는 공개 npm에 없습니다. 프로젝트 루트에 `.npmrc`를 둡니다.

```
@bucketplace:registry=https://nexus.co-workerhou.se/repository/npm-private/
```

### 2.2 의존성

```jsonc
{
  "dependencies": {
    "@bucketplace/design-system": "^11",
    "@bucketplace/tokens": "^3",
    "@bucketplace/icons": "^3",
    "@bucketplace/assets": "^4",
    "@emotion/react": "^11",
    "@emotion/styled": "^11",
    "i18next": "^23",
    "react-i18next": "^13",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

- **React 18 고정**: ODS peerDependency가 `react@18.3.1` 기준입니다. React 19로 올리지 않습니다.
- **Emotion 필수**: ODS는 `@emotion/react` 기반입니다. Vite/tsconfig에 `jsxImportSource: '@emotion/react'`를 설정하고 `@emotion/babel-plugin`을 켭니다.
- **i18next 필수**: ODS 내부 컴포넌트 일부가 `react-i18next` 컨텍스트를 요구하므로 최소 초기화가 필요합니다(초기화 누락 시 런타임 에러).

### 2.3 루트 Provider

**`DesignSystemProvider`로 앱 최상단을 한 번 감쌉니다.** 대부분의 ODS 컴포넌트가 provider 없이는 동작하지 않습니다.
`ThemeProvider + SnackbarProvider + StickyProvider + OverlayProvider`가 내장되어 있으므로 개별 provider를 따로 붙이지 않습니다.

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Global } from '@emotion/react';
import { DesignSystemProvider, GLOBAL_STYLE } from '@bucketplace/design-system';
import './i18n';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Global styles={GLOBAL_STYLE} />
    <DesignSystemProvider mode="light">
      <App />
    </DesignSystemProvider>
  </React.StrictMode>,
);
```

> 새 프로토타입을 시작할 때는 ods-prototype MCP의 `get_starter_files`를 1회 호출해 스캐폴드(`.npmrc` / `vite.config.ts` / `tsconfig.json` / `src/main.tsx` / `src/i18n.ts` / `src/prototype-ods/*`)를 그대로 받아 쓰는 것이 가장 안전합니다.

---

## 3. 컴포넌트 사용 규칙

### 3.1 ODS 미정의 컴포넌트 금지

- UI 요소가 필요하면 **먼저 `list_components`로 ODS 카탈로그에 대응 항목이 있는지 확인**합니다.
- 이름이 의심스러우면 `check_component_name`으로 **BDS(legacy) / Tailwind / shadcn 계열인지 검증**합니다. (예: `Button` → ODS는 `BoxButton`, `Toast` → ODS는 `Snackbar`)
- 카탈로그에 있는 컴포넌트만 사용하고, `get_component`의 props·compound 구조·canonical usage를 그대로 따릅니다.
- **임의 신규 컴포넌트·off-system 시안(자체 배너/자체 카드/자체 탭 등)을 프로토타입에 도입하지 않습니다.**

### 3.2 현재 카탈로그 (43개)

| 카테고리 | 컴포넌트 |
|---|---|
| provider | `DesignSystemProvider` |
| buttons | `BoxButton` · `IconButton` · `TextButton` |
| typography | `Text` · `Heading` |
| input | `Input` · `SearchField` · `Checkbox` · `RadioGroup` · `Switch` · `Dropdown` · `Calendar` |
| layout | `Box` · `Flex` · `Grid` · `Section` · `Divider` · `ScrollableList` |
| display | `Card` · `CardProduct`(`Card.Product`) · `Avatar` · `Thumbnail` · `GridThumbnail` · `ResizeImage` · `Chip` · `Empty` · `Loading` · `IndicatorNumber` |
| badges | `CircleBadge` · `DotBadge` · `PillBadge` · `SquareBadge` |
| feedback / overlay | `Snackbar` · `Dialog` · `BottomSheet` · `Tooltip` · `CautionBox` |
| navigation | `Tab` |
| action | `ScrapButton` |
| **prototype 전용** | `TopNavigation` · `BottomNavigation` · `ActionDock` |

> 목록은 시점 스냅샷입니다. **작업 시작 시 `list_components`를 다시 호출**해 최신 카탈로그를 확인하세요.

### 3.3 compound 구조를 임의로 평탄화하지 않기

ODS 다수 컴포넌트는 compound API입니다. `get_component`의 `canonicalUsage`를 그대로 사용합니다.

```tsx
import { BoxButton } from '@bucketplace/design-system';

<BoxButton size="medium" variant="brand-solid" onClick={handleSubmit}>
  <BoxButton.Slot side="center">
    <BoxButton.Label>로그인</BoxButton.Label>
  </BoxButton.Slot>
</BoxButton>
```

- `BoxButton`은 `size`·`variant`가 **필수**입니다.
  - `size`: `extra-small`(28) · `small`(32) · `medium`(40) · `large`(48) · `extra-large`(56)
  - `variant`: `normal` · `outlined` · `solid` · `subtle` · `brand-solid` · `brand-outlined`
  - Figma에서 `Normal`로 표기된 버튼은 테두리가 보여도 `outlined`로 해석하지 않습니다.
- 다른 compound 컴포넌트(`Card` / `Card.Product` / `Checkbox` / `Chip` / `Dialog` / `Tooltip` 등)도 동일하게 하위 컴포넌트로 조립합니다.

### 3.4 prototype 전용 컴포넌트

`TopNavigation` · `BottomNavigation` · `ActionDock` · `ScreenShell` · overlay adapter는 **ODS 패키지 export가 아니라 프로토타입 하네스**입니다.
`get_starter_files` / `get_preview_harness`로 받은 구현을 `src/prototype-ods/`에 두고 사용하며, 프로덕션 코드로 옮기지 않습니다.

프레임 안에서 Dialog/BottomSheet/Tooltip을 띄우려면 portal container를 프레임으로 잡아주는 `PrototypeDialog` / `PrototypeBottomSheet` / `PrototypeTooltip` 어댑터를 사용합니다(원본 컴포넌트를 직접 쓰면 오버레이가 뷰포트 전체로 새어 나갑니다).

---

## 4. 토큰 규칙 (raw hex 금지)

**모든 색·타이포·섀도우 값은 ODS 토큰을 참조합니다.** Tailwind 색 클래스나 hex 직접 값은 사용하지 않습니다.
ODS에는 **spacing/radius 토큰이 없고** 컴포넌트 내부에 값이 내장되어 있습니다 — 여백은 컴포넌트 기본값을 따르고, 필요한 경우에만 숫자 값을 씁니다.

### 4.1 색

`useTheme()`로 접근하고 **semantic 이름**을 우선 사용합니다. palette 값(`genuineBlue.350` 등)은 theme 접근이 불가한 컨텍스트에서만 씁니다.

```tsx
import { useTheme } from '@bucketplace/tokens';

const theme = useTheme();
theme.colors.foreground;         // 기본 텍스트   (light: gray.900  #141414)
theme.colors.foregroundWeak;     // 보조 텍스트   (light: gray.400  #8C8C8C)
theme.colors.foregroundBrand;    // 브랜드        (genuineBlue.350  #00A1FF)
theme.colors.foregroundCritical; // 에러          (light: red.400   #FD3D4A)
theme.colors.background;         // 기본 배경     (light: white)
theme.colors.backgroundWeak;     // 약한 배경     (light: gray.50   #F5F5F5)
theme.colors.border;             // 기본 보더     (light: gray.150  #E0E0E0)
```

주요 semantic 이름: `background` · `backgroundWeak` · `backgroundDisabled` · `backgroundInverse` · `backgroundBrand(Weak)` · `backgroundEmphasis(Weak)` · `backgroundCritical(Weak)` · `backgroundAttention(Weak)` · `backgroundDim` · `backgroundOverlay` · `border` · `borderStrong` · `borderInverse` · `borderBrand` · `borderEmphasis` · `borderCritical` · `borderAttention` · `borderThumbnail` · `foreground` · `foregroundWeak` · `foregroundDisabled` · `foregroundInverse` · `foregroundBrand` · `foregroundEmphasis` · `foregroundCritical` · `foregroundAttention` · `accentRed` · `accentYellow` · `accentPurple`

> light/dark에서 매핑되는 palette 값이 다릅니다(예: `foregroundCritical` light `red.400` / dark `red.450`). semantic 이름을 쓰면 자동으로 처리되지만, hex를 하드코딩하면 dark에서 깨집니다.

### 4.2 타이포그래피

`Text` / `Heading`의 `variant`에 textStyle 이름을 지정합니다.

```tsx
<Text variant="body16L24" weight={500} color="foreground">본문</Text>
<Text variant="detail12L16" color="foregroundWeak">보조 설명</Text>
```

- heading: `heading32` · `heading24` · `heading20` · `heading18` · `heading17`
- body: `body20L28` · `body17L22` · `body16L28` · `body16L24` · `body16L20` · `body15L24` · `body14L20` · `body14L18`
- detail: `detail13L18` · `detail12L20` · `detail12L16` · `detail11L14` · `detail10L14`
- weight: `400`(regular) · `500`(medium) · `600`(semibold) · `700`(bold)
- CSS에서 직접 필요하면 `theme.text[variantName]`

### 4.3 섀도우

```tsx
style={theme.shadow.legacy.core.shadow.depth20}  // depth10 / depth20 / depth30
```

### 4.4 Figma 신호를 코드 토큰으로 착각하지 않기

Figma MCP가 반환하는 `base_2[light]`, `neutral500(base_2)`, `Accent/accent-red`, `Spacing-16`, `Content Padding X`, `shadow_basic`, `Depth 30`, `◇/ODS ...` 같은 이름은 **코드 토큰이 아닙니다.**
그대로 emit하지 말고, semantic 역할로 코드 토큰을 고르거나 `get_token_migration_hints`로 후보를 확인합니다.

---

## 5. 아이콘 (@bucketplace/icons 강제)

- **모든 아이콘은 ODS 아이콘을 사용합니다.** Lucide · Heroicons · Feather · Material 등 외부 세트, 손으로 그린 SVG path, 이모지·유니코드 글리프(✕ → ▶ 등)를 아이콘 용도로 쓰지 않습니다.
- 아이콘이 필요하면 **먼저 `search_icon`으로 이름을 확정한 뒤** 반영합니다.

```tsx
import { IconX, IconChevronLeft, IconMagnifyingGlass } from '@bucketplace/icons';

<IconX size={24} weight="regular" renderMode="monochrome" />
```

- `size`: `number | string` (기본 `"1em"`), `aspect`: `"width" | "height" | "both"`
- weight 분기(`regular` / `medium` / `semibold` / `bold`)를 가지며 **기본은 `regular`**
- 색은 부모의 ODS semantic 색을 상속받게 두고(`currentColor`) 아이콘에 hex를 직접 넣지 않습니다.
- `search_icon`은 **형태 이름**으로 검색됩니다. 의미어로 못 찾으면 형태어로 재검색하세요.
  예: `close` → 결과 없음 / 닫기 아이콘은 `IconX`. 뒤로 `IconChevronLeft`, 검색 `IconMagnifyingGlass`, 안내 `IconInfoCircle`(Filled), 새로고침 `IconArrowTriangleHeadClockwise`

### 5.1 self-contained HTML 프로토타입인 경우

React import가 불가한 단일 HTML 프로토타입에서는 `@bucketplace/icons`의 해당 아이콘 SVG를 **추출해 인라인**합니다.

- `viewBox="0 0 480 480"`, `fill="currentColor"`, 단일/다중 `<path>`
- even-odd 채움 아이콘은 `fill-rule="evenodd"`를 함께 둡니다
- **regular** weight 변형을 사용합니다

### 5.2 이미지/로티 자산

이모지나 임의 URL 대신 `search_asset`으로 `@bucketplace/assets`에서 먼저 찾고, 없을 때만 placeholder를 씁니다.

---

## 6. 구현 범위 제외 영역

프리뷰·프로토타입에서 아래는 **구현하지 않고, QA 비교 대상에서도 제외**합니다.

- **웹 GNB** — 글로벌 상단 내비게이션(로고 · 검색 · 장바구니 · 햄버거 · 카테고리 GNB). 서비스 공통 chrome
- **OS statusbar** — 시간(9:41) · 배터리 · 신호 · 노치 · home indicator. preview harness / OS chrome

단, 콘텐츠 바로 위의 **페이지 전용 헤더/탭**(페이지 타이틀 바, 콘텐츠 필터 탭)은 feature이므로 **포함**합니다.
위 제외 영역은 §3.1(ODS 컴포넌트 규칙)·§5(아이콘 규칙) 적용 대상도 아닙니다 — harness 코드이기 때문입니다.

---

## 7. 예외 처리

ODS에 대응 항목이 **전혀 없을 때만** 아래를 따릅니다.

| 상황 | 처리 |
|---|---|
| 대응 컴포넌트 없음 | 사유를 코드 주석/문서에 기록하고 `Box`/`Flex`/`Text` + 토큰으로 최대한 근접하게 조합. 신규 커스텀 컴포넌트는 ODS 채택 전까지 도입하지 않음 |
| 대응 아이콘 없음 | 사유 기록 후 근접 ODS 아이콘 또는 placeholder |
| 대응 색 토큰 없음 | 사유 + 근접 semantic 토큰명을 기록한 뒤에만 raw hex 허용 |

"의도상 빨강/초록이니까"처럼 **추정으로 색을 정하지 않습니다.** 뱃지·칩·탭 등 variant/state 색은 `get_component`나 카탈로그에서 실제 토큰을 확정합니다.

---

## 8. 안티패턴

| ❌ 하지 말 것 | ✅ 대신 |
|---|---|
| `<button className="bg-blue-500">` | `<BoxButton size="medium" variant="brand-solid">` |
| `color: '#00A1FF'` | `theme.colors.foregroundBrand` |
| `import { X } from 'lucide-react'` | `import { IconX } from '@bucketplace/icons'` |
| `<span>✕</span>` | `<IconX size={24} />` |
| `fontSize: 16, lineHeight: '24px'` | `<Text variant="body16L24">` |
| shadcn `Button`/`Card`/`Toast` 이름으로 구현 | `check_component_name`으로 ODS 대응 확인 → `BoxButton`/`Card`/`Snackbar` |
| provider 없이 ODS 컴포넌트 렌더 | `DesignSystemProvider`로 루트 래핑 |
| Dialog를 프레임 프로토타입에 그대로 사용 | `PrototypeDialog` 어댑터 사용 |
| 기억으로 prop 이름 작성 | `get_component`의 props/canonicalUsage 확인 |

---

## 9. 체크리스트

구현 시작 전:

- [ ] `.npmrc`에 `@bucketplace` 레지스트리 설정, 의존성 설치 완료
- [ ] `DesignSystemProvider` 루트 래핑 + `GLOBAL_STYLE` 적용
- [ ] `jsxImportSource: '@emotion/react'` + `@emotion/babel-plugin` 설정
- [ ] i18next 최소 초기화
- [ ] `list_components` / `get_tokens` 1회 호출로 최신 카탈로그·토큰 확인

구현 중:

- [ ] 모든 UI 요소가 ODS 카탈로그 컴포넌트로 매핑됨 (`check_component_name` 검증 완료)
- [ ] compound 구조를 `canonicalUsage`대로 사용
- [ ] 색·타이포·섀도우가 전부 ODS 토큰 참조 (raw hex 0건, 예외는 사유 기록)
- [ ] 아이콘이 전부 `@bucketplace/icons` (외부 세트·임의 SVG·이모지 0건)
- [ ] 이미지/로티는 `search_asset` 조회 결과 사용
- [ ] GNB·statusbar 미구현 확인

구현 후:

- [ ] light/dark 양쪽에서 색이 깨지지 않음 (semantic 토큰 사용 여부의 결과)
- [ ] 예외 항목(§7)이 문서/주석에 사유와 함께 기록됨

---

## 10. 참고

- ODS 카탈로그(사내): https://fe.co-workerhou.se/catalog/
- 소스 레포: `github.com/bucketplace/apps-web` (design-system · tokens · lib) / `github.com/bucketplace/design-assets` (icons · assets)
- 조회 도구: ods-prototype MCP, ods-hermes MCP(`retrieve_ods_evidence`), `/ods` 스킬
- 문구 작성: UX Writing 가이드(writing-bot 스킬)
