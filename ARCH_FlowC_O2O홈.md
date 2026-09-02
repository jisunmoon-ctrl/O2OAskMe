# Flow C — O2O 홈 화면 아키텍처 · 구현 기록

- 최종 갱신: 2026-09-02
- 구현 위치: `o2o_prototype_ods.html` — `VIEW.cHome` (Flow C 진입 화면)
- Figma: `RU5G6QgqKVv5IdyL0qJ1M1`
  - default `868:18466` (O2OHome, 375×1898)
  - sticky  `892:15126` (O2OHome_Sticky_Scrap, 375×812)
  - menu `820:100420` · **pin `892:15014`** · **card `820:100317`**
    (핀/카드 노드 ID 는 최초 요청의 라벨과 서로 반대였다 — 실제 노드 기준으로 구현)

---

## 1. 스크롤 구조 — "고정 지도 위를 덮으며 올라오는 Container"

두 노드를 비교하면 스크롤 동작이 확정된다.

| | default `868:18466` | sticky `892:15126` | 이동량 |
|---|---|---|---|
| `map-view-wrapper` | y **136** | y **136** | **0** |
| `Container` | y 346 | y −74 (첫 자식 `Bundle_Menu` 기준) | **−504** |
| `Top Navigation` | h 136 | h **196** (= 136 + tab 60) | tab 흡수 |

즉 **지도는 움직이지 않고 Container 만 504px 올라오며 지도를 덮는다.**
드래그 스냅 바텀시트가 아니라 **스크롤 연동 sticky 레이아웃**이다.

```
┌ .screen (스크롤 컨테이너) ────────────────────┐
│ .ch-top      position:sticky; top:0   (z9)   │  Search Top Navigation 44 + Location 42 = 86
│ .ch-map      position:sticky; top:86  (z1)   │  375×240, 배경 1800×1040 @ (-1161,-134)
│ .ch-body     margin-top:-30px         (z2)   │  지도를 30px 덮는 흰 시트, r16 16 0 0
│   .ch-tab    position:sticky; top:86  (z8)   │  Handle 24 + Tab 44 + pb16
│   .ch-menu / .ch-offering / .ch-bundle ×2    │
│ .ch-compare  position:sticky; bottom:88(z7)  │  스크랩 ≥1 일 때
│ .home-gnb    position:sticky; bottom:0       │
└──────────────────────────────────────────────┘
```

## 2. sticky tab — 별도 컴포넌트가 아니라 같은 tab 의 상태

`892:15275` 에서 tab 이 `Top Navigation` 안으로 들어가고 `Handle` 이 `hidden=true` 가 되며
프레임 높이가 84 → 60 으로 줄어든다. 탭 자체(항목·인디케이터)는 동일하다.

구현: `.ch-tab { position:sticky; top:86px }` + 스크롤 리스너가 `is-stuck` 토글 →
`.ct-handle` 높이 24 → 0, 상단 radius 제거. 탭을 두 벌 만들지 않는다.

## 3. 모듈 구성

| 모듈 | Figma | 구현 | 핵심 스펙 |
|---|---|---|---|
| Location | `868:14832` | `.ch-loc` | px16 py8 gap12 · `IconLocationPinDot` 18 · body14L20 regular · TextButton `주소변경` |
| 지도 | `837:14495` | `chMap()` | 375×240 · 배경 1800×1040 @(−1161,−134) |
| Pin | `892:15014` | `.ch-pin` | lounge(흰 26 r8 + Ohouse 심볼) · house(inverse 32 원형 + `IconPlaceHouseFilled`) · brand(흰 r8 + brand 22 r6 + 스탠다드 심볼), 라벨 body14L18 semibold |
| 지도 액션 | `837:14497` | `.ch-mapact` | 34 원형 ×2, `IconHouse` / `IconScope` 20 |
| tab | `837:16396` | `.ch-tab` | Handle 32×4 r6 · ODS Tab fixed 5×75 · active foreground / inactive foregroundWeak · indicator 2px foreground |
| Bundle_Menu | `837:14502` | `.ch-menu` | 5열×2행 · asset 52 r16 `rgba(0,0,0,.04)` · label detail13L18 medium |
| Bundle_Offering | `837:14525` | `.ch-offering` | 343×72 r12 · 이미지 크롭 w153.22%/h152.16% @(−63.08%,−46.56%) · indicatorNumber `1/10` |
| ModuleTitle | `868:14703` | `.ch-mtitle` | heading17 semibold + Section Arrow Button 28 (`backgroundWeak` + `IconArrowRight`) |
| ChipGroup | `846:52868` | `.ch-chips` | ODS Chip md · 선택 `solid` / 미선택 `normal` |
| 2DepthFilter | `868:14738` | `.ch-filter2` | ODS BoxButton xs 28 · 선택 ghost(foreground) / 미선택 weak-ghost(foregroundWeak) |
| partner card | `846:52878` | `.ch-pcard` | 320×130 · info flex1 + thumb 80×110 r8 · SquareBadge subtle green/blue · ★ accentYellow · quote 2줄(52px) |
| review card | `863:10948` | `.ch-rcard` | 159 폭 · 썸네일 159 r8 · 본문 3줄(60px) · author foregroundWeak |
| more-button | `863:10969` | `.ch-more` | 343×44 r8 border · `더보기` + `IconChevronRight` 12 |
| 비교 Snackbar | `892:15251` | `.ch-compare` | backgroundInverse · 아바타 2 · `N개 비교중` · `비교하기` |

## 4. 추가한 ODS 자원

- **아이콘** (`@bucketplace/icons` 3.25.0 monochrome/regular 렌더 추출 → `ODS_ICON`)
  `IconScope` · `IconPlaceHouseFilled` · `IconBookmark` · `IconBookmarkFilled` · `IconLine3Horizontal`
  Flow C 화면에만 적용. Flow A/B 의 기존 GNB 는 여전히 손그림 hamburger/bookmark SVG 를 쓰는데,
  이제 ODS path 를 확보했으므로 교체 가능하다(요청 범위 밖이라 미변경 — 후속 항목).
- **에셋** (`asset.ohousecdn.com/static`)
  `AssetOhouseSymbol/ohouse-symbol.svg` · `AssetOhouseStandardSymbolWhite/ohouse-standard-symbol-white.svg`
- **토큰** `--ods-accent-blue:#0079FA` · `--ods-accent-yellow:#FFC300` (`@bucketplace/tokens` 3.12.0 확인)
- **이미지** `assets/o2ohome/` — Figma raw image 원본(map / offering / pcard1~3 / review_1~3)

## 5. 토큰 예외 기록 (가이드 §7)

| 값 | 사유 |
|---|---|
| `#172F47` (Offering 배너 배경) | 캠페인 브랜드 색, ODS semantic 대응 없음 |
| `#15b86921` / `#0079fa14` (SquareBadge subtle 배경) | ODS 코드 토큰에 subtle 배경 alias 가 없어 컴포넌트 변수값 그대로 재현 |
| `rgba(0,0,0,.04)` (메뉴 asset 박스) | Figma 실측 오버레이 값, semantic 대응 없음 |
| `rgba(33,38,41,.5)` (indicatorNumber) | `dim_basic #212629` 50% — ODS dim alias 없음 |
| 지도 이미지 | ODS 카탈로그에 map 컴포넌트 없음 → 정적 이미지 + 핀 절대배치 |

Figma 가 노출한 legacy palette 신호(`base_1[light] #2F3438` · `neutral500(base_2) #828C94` ·
`neutral300(base_4) #EAEDEF`)는 코드 토큰이 아니므로(가이드 §4.4) 역할에 맞는 semantic 으로 매핑했다
→ 각각 `--ods-foreground` · `--ods-foreground-weak` · `--ods-border`.

## 6. 범위 (CLAUDE.md §2)

- **제외** — OS statusbar / home indicator: `body.preview-only` 에서 비표시.
- **공통 chrome 이나 디자인 재현을 위해 렌더** — Search Top Navigation(`🪩`), Bottom Navigation(`🪩`).
  기존 프로토타입(`VIEW.entry`)이 이미 같은 방침으로 구현돼 있어 일관성을 맞췄다. **QA 대조 대상에서는 제외.**
- **포함(feature)** — Location 행, tab, Bundle_Menu / Offering / partner·case 번들, 비교 Snackbar.

## 7. 미구현 / 후속

- 탭·칩·2Depth 필터는 **선택 상태만 전환**하고 목록 필터링은 하지 않는다(디자인에 각 상태 시안 없음).
- 캐러셀은 2페이지 반복(디자인의 peek 재현)이며 실제 페이지네이션 데이터는 없다.
- 핀 탭 → 기존 `cList`(업체 목록)로 연결. 지도 상세/선택 업체 바텀시트는 별도 노드가 없어 미구현.

---

## 8. 탭별 개별 페이지 (2026-09-02 추가)

탭을 클릭하면 **tab 이 헤더 바로 아래(86px)로 올라붙고**, container 본문이 해당 탭 페이지로 교체된다.
탭 페이지 노드는 모두 `Top Navigation` 이 h196(= 헤더 86 + tab 60)이라 **항상 sticky 상태**이고 지도가 없다.

| 탭 | 노드 | ATF | Bundle_Offering | BTF (card group) |
|---|---|---|---|---|
| 전체시공 | `837:17410` | ATF-Grid: hero 169(우리 아파트) + 2×2 셀(견적계산기 yellow) | `#E3D6C5` 도배 직시공 | 시공사례 card ×2(Card+GridThumbnail) · 시공업체 card ×2 · 사례·리뷰(칩 4 + review-card) |
| 부분시공 | `868:11034` | 주방(N)·도배·마루·장판 40px 4열 | `#E3D6C5` 동일 | 전/후 비교 card ×5 (칩 4) |
| 이사·청소 | `837:16817` | 원룸이사·가정이사·보관이사·이사청소 52px 4열 | `#F0F3F6` 이사 책임보장 | 이사 파트너 card ×4 (사진 90×90 레일 + 리뷰 인용 레일 + 견적받기) |
| 인터넷·렌탈 | `837:17088` | 184 카드 ×2 + 88 카드 ×2 + Menu-LS 4열 | `#E1EEFB` 인터넷 정수기 렌탈 | 없음 |

### card 컴포넌트

`odsCard({media, content, type})` = ODS `Card.Root / Card.Media / Card.Content` 재현.
`gridThumb(imgs)` = ODS `GridThumbnail layout="left-1-right-2" shape="rectangle"` (226fr : 92fr).
시공사례 card 는 Figma 에서 `Card.Media = 🏗️🌀 Grid Thumbnail` 로 매핑돼 있어 그대로 따랐다.

### sticky 전환에서 잡은 3가지 문제

1. **무한 진동** — `is-stuck` 이 Handle(24px)을 접으면 scrollHeight 가 줄고, 최하단에서 브라우저가
   scrollTop 을 되감아 다시 unstick → 재진동. `onScroll` 에 히스테리시스(해제 임계 `86+32`)를 넣어 끊었다.
2. **scroll anchoring** — Handle 이 접힐 때 Chrome 이 "보이는 콘텐츠 유지"를 위해 scrollTop 을 24px
   자동 보정해, 탭이 86 이 아니라 110 에 멈췄다. `.ch{overflow-anchor:none}` 으로 해제.
3. **짧은 탭** — 인터넷·렌탈은 콘텐츠가 짧아 210px 을 스크롤할 수 없었다.
   `#chSpacer` 를 `clientHeight + 210 + 24 − scrollHeight` 만큼 깔아 모든 탭에서 붙도록 했다.

`chStickTab()` 은 목표 상태(`is-stuck`)를 먼저 적용한 뒤 2회 수렴시킨다
(접힘 여부에 따라 목표 스크롤량이 달라지는 순환 의존 때문).

### 추가 토큰 예외

| 값 | 사유 |
|---|---|
| `#E3D6C5` · `#F0F3F6` · `#E1EEFB` (탭별 배너 배경) | 캠페인 색, ODS semantic 대응 없음 |
| `rgba(255,255,0,.25)` (견적계산기 셀) | Figma 실측 강조 배경, 대응 토큰 없음 |

### 알려진 제약

- 칩·2Depth 필터는 선택 상태만 바뀌고 목록은 필터링하지 않는다(디자인에 결과 시안 없음).
- `AssetPhotoWoodPatternVinylFlooringIsometric` 는 CDN 에 `image_240.png` 가 없어 `.webp` 를 쓴다.
