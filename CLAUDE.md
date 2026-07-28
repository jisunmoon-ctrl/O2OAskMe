# O2OAskMe 프로젝트 지침

## ODS 프로토타입 구현

이 프로젝트의 모든 UI 프로토타입 구현은 [ODS_PROTOTYPE_GUIDE.md](ODS_PROTOTYPE_GUIDE.md)를 따릅니다.
아이콘 상세는 [ICON_LIBRARY.md](ICON_LIBRARY.md)를 함께 참고합니다.

작업 전 반드시 확인:

1. **ground truth 조회** — ods-prototype MCP(`list_components` / `get_component` / `get_tokens` / `search_icon` / `search_asset` / `check_component_name`)로 스펙을 확인한 뒤 구현. 기억·유추·웹 검색으로 ODS API를 작성하지 않습니다.
2. **ODS 미정의 컴포넌트 금지** — 카탈로그에 있는 컴포넌트만 사용. 임의 신규 컴포넌트/off-system 시안 도입 금지.
3. **raw hex 금지** — 색·타이포·섀도우는 전부 ODS 토큰(`theme.colors.*`, `Text variant`, `theme.shadow.*`) 참조.
4. **아이콘은 `@bucketplace/icons`만** — 외부 아이콘 세트·임의 SVG path·이모지/유니코드 글리프 금지.
5. **자산은 `search_asset`** — 임의 URL·이모지 대체 금지.
6. **GNB·OS statusbar 제외** — 구현·QA 모두 대상 아님. 단 페이지 전용 헤더/탭은 feature이므로 포함.

예외는 [ODS_PROTOTYPE_GUIDE.md §7](ODS_PROTOTYPE_GUIDE.md)의 절차대로 사유를 기록한 경우에만 허용합니다.
