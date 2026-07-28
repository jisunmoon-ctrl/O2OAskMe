# 🎨 오늘의집 아이콘 라이브러리 통합 가이드

## 📚 개요

오늘의집 디자인 시스템 기반 통합 아이콘 라이브러리입니다.

- **기반 URL**: https://fe.co-workerhou.se/catalog/?path=/docs/documentation-1-icons--docs
- **총 아이콘 수**: 60개+
- **TypeScript 완벽 지원**: 자동완성 및 타입 안전성
- **디자인 시스템 통합**: CSS 변수 완벽 호환

## 📁 파일 구조

```
src/app/components/icons/
├── IconLibrary.tsx        # 핵심 아이콘 컴포넌트 및 타입 정의
├── IconShowcase.tsx       # 아이콘 쇼케이스 (미리보기 및 테스트)
├── index.ts               # Export 파일
└── README.md              # 상세 문서
```

## 🚀 빠른 시작

### 1. 기본 사용

```tsx
import { Icon } from '@/components/icons';

function MyComponent() {
  return (
    <Icon 
      name="check" 
      size={24} 
      color="var(--fg-neutral)" 
    />
  );
}
```

### 2. 디자인 시스템 색상 적용

```tsx
// ✅ 권장: CSS 변수 사용
<Icon name="check" color="var(--fg-brand)" />
<Icon name="alert" color="var(--fg-critical)" />
<Icon name="info" color="var(--fg-weak)" />

// ❌ 비권장: 하드코딩
<Icon name="check" color="#00A1FF" />
```

### 3. 인터랙티브 아이콘

```tsx
<Icon 
  name="trash" 
  size={20}
  color="var(--fg-critical)"
  onClick={() => console.log('Delete')}
  className="hover:opacity-80 transition-opacity cursor-pointer"
/>
```

## 📋 아이콘 카탈로그

### Navigation (7개)
`chevron-left` `chevron-right` `chevron-up` `chevron-down` `arrow-left` `arrow-right` `close`

### Status & Actions (12개)
`check` `check-circle` `plus` `minus` `search` `refresh` `upload` `download` `share` `trash` `edit` `copy`

### Content (8개)
`home` `user` `settings` `help` `info` `alert` `warning` `error`

### Commerce (4개)
`cart` `heart` `star` `bookmark`

### Communication (4개)
`phone` `mail` `message` `notification`

### Media (5개)
`image` `camera` `video` `play` `pause`

### Moving Service (6개)
`truck` `box` `location` `calendar` `clock` `package`

## 🎨 아이콘 쇼케이스

아이콘 라이브러리를 시각적으로 확인하고 테스트하려면:

```tsx
import { IconShowcase } from '@/components/icons/IconShowcase';

// App.tsx의 renderScreen에 추가
case "icon_showcase": return <IconShowcase />;
```

쇼케이스 기능:
- ✅ 모든 아이콘 한눈에 보기
- ✅ 실시간 크기/색상 조정
- ✅ 코드 자동 생성 및 복사
- ✅ 카테고리별 그룹화

## 🔧 Props 상세

```typescript
interface IconProps {
  name: IconName;           // 필수: 아이콘 이름
  size?: number | string;   // 선택: 크기 (기본 24)
  color?: string;           // 선택: 색상 (기본 currentColor)
  className?: string;       // 선택: CSS 클래스
  strokeWidth?: number;     // 선택: 선 두께 (기본 2)
  onClick?: () => void;     // 선택: 클릭 핸들러
}
```

## 📐 권장 사이즈

| 용도 | 크기 | 예시 |
|------|------|------|
| **Small** | 16px | 인라인 아이콘, 뱃지 |
| **Medium** | 20px | 입력 필드, 작은 버튼 |
| **Default** | 24px | 버튼, 네비게이션 |
| **Large** | 32px | 큰 강조 아이콘 |
| **XLarge** | 48px+ | 빈 상태, 플레이스홀더 |

## 🎯 실전 예제

### 1. 버튼 + 아이콘

```tsx
function SubmitButton() {
  return (
    <button className="btn-primary flex items-center gap-2">
      <Icon name="check" size={20} color="var(--fg-inverse)" />
      <span>확인</span>
    </button>
  );
}
```

### 2. 검색 입력 필드

```tsx
function SearchInput() {
  return (
    <div className="relative">
      <Icon 
        name="search" 
        size={20} 
        color="var(--fg-weak)"
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
      />
      <input 
        type="text" 
        placeholder="검색..." 
        className="pl-10 pr-4 py-2 w-full border border-[var(--border-neutral)] rounded-lg"
      />
    </div>
  );
}
```

### 3. 네비게이션 헤더

```tsx
function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-neutral)]">
      <Icon 
        name="chevron-left" 
        size={24} 
        color="var(--fg-neutral)"
        onClick={onBack}
        className="cursor-pointer hover:opacity-70 transition-opacity"
      />
      <h1 className="text-heading-18 font-semibold">{title}</h1>
    </header>
  );
}
```

### 4. 상태 배지

```tsx
function StatusBadge({ status }: { status: 'success' | 'error' | 'warning' }) {
  const config = {
    success: { icon: 'check-circle', color: 'var(--fg-brand)', label: '완료' },
    error: { icon: 'error', color: 'var(--fg-critical)', label: '오류' },
    warning: { icon: 'warning', color: 'var(--fg-attention)', label: '주의' },
  };

  const { icon, color, label } = config[status];

  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--bg-weak)]">
      <Icon name={icon as IconName} size={14} color={color} />
      <span className="text-detail-12 font-medium" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
```

### 5. 액션 버튼 그룹

```tsx
function ActionButtons() {
  return (
    <div className="flex items-center gap-2">
      <button className="p-2 rounded-lg hover:bg-[var(--bg-weak)] transition-colors">
        <Icon name="edit" size={20} color="var(--fg-neutral)" />
      </button>
      <button className="p-2 rounded-lg hover:bg-[var(--bg-weak)] transition-colors">
        <Icon name="share" size={20} color="var(--fg-neutral)" />
      </button>
      <button className="p-2 rounded-lg hover:bg-[var(--bg-critical-weak)] transition-colors">
        <Icon name="trash" size={20} color="var(--fg-critical)" />
      </button>
    </div>
  );
}
```

### 6. 이사 서비스 예제

```tsx
function MovingServiceCard() {
  return (
    <div className="bg-[var(--bg-neutral)] p-4 rounded-lg border border-[var(--border-neutral)]">
      <div className="flex items-start gap-3">
        <div className="p-3 bg-[var(--bg-brand-weak)] rounded-lg">
          <Icon name="truck" size={24} color="var(--fg-brand)" />
        </div>
        <div className="flex-1">
          <h3 className="text-heading-16 font-semibold mb-2">포장 이사</h3>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-body-14 text-[var(--fg-weak)]">
              <Icon name="calendar" size={16} color="var(--fg-weak)" />
              <span>2024년 3월 15일</span>
            </div>
            <div className="flex items-center gap-2 text-body-14 text-[var(--fg-weak)]">
              <Icon name="location" size={16} color="var(--fg-weak)" />
              <span>서울 강남구 → 분당구</span>
            </div>
            <div className="flex items-center gap-2 text-body-14 text-[var(--fg-weak)]">
              <Icon name="box" size={16} color="var(--fg-weak)" />
              <span>20평형, 짐 많음</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 🔄 새 아이콘 추가하기

### 1. Figma에서 아이콘 추출

```bash
1. Figma에서 아이콘 선택
2. 우클릭 → "Copy as SVG"
3. viewBox와 path 추출
```

### 2. IconLibrary.tsx 수정

```tsx
// 1. IconName 타입에 추가
export type IconName =
  // ... existing icons
  | 'my-new-icon';

// 2. iconPaths에 추가
const iconPaths: Record<IconName, { viewBox: string; paths: string[] }> = {
  // ... existing icons
  'my-new-icon': {
    viewBox: '0 0 24 24',
    paths: ['M12 2L2 7l10 5 10-5-10-5z'],
  },
};
```

### 3. 사용

```tsx
<Icon name="my-new-icon" size={24} />
```

## 🎨 색상 가이드

### 주요 색상 토큰

```tsx
// Foreground (텍스트/아이콘)
'var(--fg-neutral)'        // 기본 색상 (#141414)
'var(--fg-weak)'           // 보조 색상 (#BCBCBC)
'var(--fg-brand)'          // 브랜드 색상 (#00A1FF)
'var(--fg-inverse)'        // 반전 색상 (흰색)
'var(--fg-critical)'       // 오류 색상 (#F05656)
'var(--fg-attention)'      // 경고 색상 (#623B00)

// Background (배경)
'var(--bg-brand)'          // 브랜드 배경
'var(--bg-brand-weak)'     // 브랜드 연한 배경
'var(--bg-critical-weak)'  // 오류 연한 배경
'var(--bg-attention-weak)' // 경고 연한 배경
```

## ✅ 체크리스트

### 아이콘 사용 시

- [ ] `IconName` 타입으로 자동완성 확인
- [ ] CSS 변수 사용 (하드코딩 금지)
- [ ] 표준 크기 사용 (16, 20, 24, 32)
- [ ] 적절한 strokeWidth (보통 2)
- [ ] onClick 있을 때 cursor 스타일 확인

### 새 아이콘 추가 시

- [ ] IconName 타입에 추가
- [ ] iconPaths에 경로 추가
- [ ] viewBox 정확히 설정
- [ ] 카테고리 확인 (Navigation, Actions 등)
- [ ] README.md 업데이트

## 🚀 성능

- **번들 크기**: 사용하지 않는 아이콘은 트리 쉐이킹
- **렌더링**: 인라인 SVG로 별도 요청 없음
- **최적화**: 필요시 React.memo 사용

```tsx
const MemoizedIcon = React.memo(Icon);
```

## 📚 참고 자료

- [오늘의집 디자인 시스템](https://fe.co-workerhou.se/catalog/)
- [아이콘 상세 문서](/src/app/components/icons/README.md)
- [디자인 토큰](/src/styles/theme.css)
- [타이포그래피 시스템](/src/styles/theme.css)

## 🤝 기여하기

아이콘 추가 요청이나 버그 리포트는 팀에 문의해 주세요.

---

**Last Updated**: 2024-03-12  
**Version**: 1.0.0  
**Author**: 오늘의집 프론트엔드 팀
