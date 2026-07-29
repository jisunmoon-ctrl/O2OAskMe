import type { ComponentType } from 'react';
import { Box } from '@bucketplace/design-system';

// ─────────────────────────────────────────────────────────────────────────────
// ODS 자산 (@bucketplace/assets) 매핑
//
// 모든 이미지는 ods-prototype 이 확정한 @bucketplace/assets/image 컴포넌트를 사용합니다.
// 이모지·임의 URL·placeholder 를 쓰지 않습니다. (ODS_PROTOTYPE_GUIDE.md §5.2)
// 자산 이름은 Figma get_design_context 가 반환한 import 명을 그대로 옮긴 것입니다.
// ─────────────────────────────────────────────────────────────────────────────
import {
  // 리모델링 시공 범위 카테고리 (CategoryTile / CategoryGrid)
  AssetPhotoWhiteWallpaperLargeStillImage, // 도배
  AssetPhotoWoodPatternVinylLargeStillImage, // 장판
  AssetPhotoWashBasinLargeStillImage, // 욕실
  AssetPhotoKitchenSinkLargeStillImage, // 주방
  AssetPhotoWoodFlooringLargeStillImage, // 마루
  AssetPhotoBathroomTilesLargeStillImage, // 타일
  AssetPhotoDoorLargeStillImage, // 중문/도어
  AssetPhotoWindowLargeStillImage, // 창호/샷시
  AssetPhotoGlossyFilmIsometricStillImage, // 시트필름
  AssetPhotographicGrayHorizontalWindowBlindsLargeStillImage, // 커튼/블라인드
  AssetPhotoPendantLampIsometricStillImage, // 조명
  AssetPhotographicBluePaintCanWithBrushLargeStillImage, // 페인트
  // 서비스 견적 카드 (EstimateCard) 리딩 아이콘
  AssetCalculatorLargeGenuineBlueView2StillImage, // 시공 / 견적 / 집 전체 시공
  AssetTruckLargeGenuineBlueView2StillImage, // 이사
  AssetWiFiRouterLargeDarkBlueView1StillImage, // 인터넷
  AssetWaterPurifierLargeGenuineBlueView2StillImage, // 렌탈
  // 서비스 리스트 (ServiceListItem)
  AssetHouseWithDrillLargeStillImage, // 집 전체 리모델링
} from '@bucketplace/assets/image';

/** @bucketplace/assets/image 의 StillImage 컴포넌트 타입 (width/height 로 크기 지정). */
export type AssetComponent = ComponentType<{
  width?: number | string;
  height?: number | string;
  'aria-hidden'?: boolean;
}>;

/** 리모델링 시공 범위 카테고리 → ODS 자산 매핑. CategoryGrid 의 기본 데이터 소스. */
export const CATEGORY_ASSET: Record<string, AssetComponent> = {
  도배: AssetPhotoWhiteWallpaperLargeStillImage,
  장판: AssetPhotoWoodPatternVinylLargeStillImage,
  욕실: AssetPhotoWashBasinLargeStillImage,
  주방: AssetPhotoKitchenSinkLargeStillImage,
  마루: AssetPhotoWoodFlooringLargeStillImage,
  타일: AssetPhotoBathroomTilesLargeStillImage,
  '중문/도어': AssetPhotoDoorLargeStillImage,
  '창호/샷시': AssetPhotoWindowLargeStillImage,
  시트필름: AssetPhotoGlossyFilmIsometricStillImage,
  '커튼/블라인드': AssetPhotographicGrayHorizontalWindowBlindsLargeStillImage,
  조명: AssetPhotoPendantLampIsometricStillImage,
  페인트: AssetPhotographicBluePaintCanWithBrushLargeStillImage,
};

/** 통합 견적 폼의 12개 카테고리 순서 (Figma 3x4 grid 기준). */
export const REMODELING_CATEGORIES: string[] = [
  '도배',
  '장판',
  '욕실',
  '주방',
  '마루',
  '타일',
  '중문/도어',
  '창호/샷시',
  '시트필름',
  '커튼/블라인드',
  '조명',
  '페인트',
];

/** 서비스 종류 → 견적 카드 리딩 아이콘 매핑. */
export const SERVICE_ASSET = {
  시공: AssetCalculatorLargeGenuineBlueView2StillImage,
  이사: AssetTruckLargeGenuineBlueView2StillImage,
  인터넷: AssetWiFiRouterLargeDarkBlueView1StillImage,
  렌탈: AssetWaterPurifierLargeGenuineBlueView2StillImage,
  집전체시공: AssetCalculatorLargeGenuineBlueView2StillImage,
} satisfies Record<string, AssetComponent>;

/** 집 전체 리모델링 리스트 아이콘. */
export const HOUSE_WITH_DRILL_ASSET: AssetComponent = AssetHouseWithDrillLargeStillImage;

export interface AssetImageProps {
  asset: AssetComponent;
  /** 정사각 픽셀 크기. 기본 44 (CategoryTile 기준). */
  size?: number;
}

/**
 * ODS 자산을 고정 정사각 박스에 담아 렌더합니다.
 * 컨테이너에 width/height 를 모두 지정해 자산이 원본 크기로 부풀지 않게 합니다.
 * (figma-design-to-code: 아이콘/이미지는 명시적 크기 컨테이너 안에서 렌더)
 */
export function AssetImage({ asset: Asset, size = 44 }: AssetImageProps) {
  return (
    <Box w={size} h={size} overflow="hidden" display="flex">
      <Asset width={size} height={size} aria-hidden />
    </Box>
  );
}
