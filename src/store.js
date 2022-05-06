import { writable } from "svelte/store";

// 토큰 상태
// - 스토리지와 인증 처리 컴퍼넌트에서 상태 공유 할 때 사용됨
// - 'checkRequired': 검증이 필요함 
// -            true: 사용 가능한 인증 토큰
// -           false: 사용 불가능한 인증 토큰
export const tokenStatus = writable(null);

// 페이지 정보
// - 프로젝트와 프로젝트 목록 페이지 이동할 때 사용됨
// - 프로젝트 목록에서 나갈때 저장하고
// - 프로젝트 목록에 들어올때 저장함
export const pageStore = writable(1);