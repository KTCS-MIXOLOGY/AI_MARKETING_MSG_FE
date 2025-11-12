# KT CS AI 기반 고객 맞춤형 마케팅 메시지 자동 생성 시스템

## 프로젝트 개요

KT CS를 고객사로 하는 생성형 AI 기반 고객 맞춤형(초개인화) 마케팅 메시지 자동 생성 솔루션입니다. React와 Styled-Components를 사용하여 구현되었으며, 관리자와 실행자 역할에 따른 다양한 기능을 제공합니다.

## 주요 기능

### 🔐 사용자 관리
- 회원가입 및 로그인
- 역할 기반 접근 제어 (관리자/실행자)
- 사용자 프로필 관리

### 👥 관리자 기능
- 사용자 계정 관리 (생성, 수정, 삭제)
- 캠페인 관리 (생성, 수정, 삭제)
- 상품 관리 (생성, 수정, 삭제)
- 고객 세그먼트 관리
- 메시지 로그 조회

### 💬 실행자 기능
- 메시지 생성 (세그먼트/개별 고객)
- 최근 생성 메시지 조회
- 캠페인 및 상품 정보 조회
- 고객 360도 뷰

### 🤖 AI 메시지 생성
- 고객 세그먼트 기반 메시지 자동 생성
- 개별 고객 맞춤형 메시지 생성
- 톤앤매너 적용 (격식있는/친근한/캐주얼한/전문적인)
- 여러 버전 메시지 생성 (A/B 테스트용)

## 기술 스택

- **Frontend**: React 18
- **Styling**: Styled-Components
- **State Management**: React Context API
- **Data Fetching**: Axios
- **UI Components**: Custom components with styled-components
- **Charts**: Recharts (향후 추가 예정)
- **Table**: React Table
- **Forms**: React Hook Form

## 설치 및 실행

### 필수 조건
- Node.js 16+
- npm 또는 yarn

### 설치
```bash
# 저장소 클론
git clone [repository-url]
cd kt-cs-marketing-message-generator

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

### 빌드
```bash
# 프로덕션 빌드
npm run build
```

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── common/         # 공통 컴포넌트
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Input.js
│   │   ├── Modal.js
│   │   ├── Sidebar.js
│   │   ├── Header.js
│   │   ├── Layout.js
│   │   ├── Table.js
│   │   ├── Loading.js
│   │   └── ...
├── contexts/            # React Context
│   └── AuthContext.js
├── hooks/               # Custom Hooks
│   └── useApi.js
├── pages/               # 페이지 컴포넌트
│   ├── Login.js
│   ├── Register.js
│   ├── UserDashboard.js
│   ├── AdminDashboard.js
│   ├── MessageSegment.js
│   ├── MessageIndividual.js
│   └── Customer360.js
├── services/            # API 서비스
│   └── api.js
├── styles/              # 스타일 관련
│   └── theme.js
└── App.js              # 메인 애플리케이션
```

## 주요 페이지

### 1. 로그인/회원가입
- 사용자 인증 및 역할 기반 라우팅
- 관리자는 관리자 대시보드로, 실행자는 사용자 대시보드로 이동

### 2. 사용자 대시보드
- 주요 통계 및 KPI 표시
- 빠른 액션 버튼 (메시지 생성, 고객 검색 등)
- 최근 생성 메시지 목록

### 3. 관리자 대시보드
- 전체 시스템 관리 기능
- 사용자, 캠페인, 상품, 세그먼트 관리
- 통계 및 분석 기능

### 4. 메시지 생성 (세그먼트)
1. 세그먼트 필터 선택 (나이대, 성별, 지역 등)
2. 필터링 실행 및 고객 수 확인
3. 캠페인 선택
4. 상품 선택
5. 톤앤매너 선택
6. AI 메시지 생성 (3버전)
7. 메시지 선택 및 수정
8. 저장 또는 클립보드 복사

### 5. 메시지 생성 (개별 고객)
1. 고객 검색 (ID/전화번호)
2. 고객 정보 확인
3. 캠페인 선택
4. 상품 선택
5. 톤앤매너 선택
6. AI 메시지 생성
7. 메시지 선택 및 수정

### 6. 고객 360도 뷰
- 고객의 전체 정보 통합 표시
- 이용 패턴, 만족도, 이탈 위험도
- 맞춤형 추천 액션

## API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `PUT /api/auth/profile` - 프로필 업데이트

### 사용자 관리
- `GET /api/users` - 사용자 목록
- `POST /api/users` - 사용자 생성
- `PUT /api/users/:id` - 사용자 수정
- `DELETE /api/users/:id` - 사용자 삭제

### 캠페인 관리
- `GET /api/campaigns` - 캠페인 목록
- `POST /api/campaigns` - 캠페인 생성
- `PUT /api/campaigns/:id` - 캠페인 수정
- `DELETE /api/campaigns/:id` - 캠페인 삭제

### 상품 관리
- `GET /api/products` - 상품 목록
- `POST /api/products` - 상품 생성
- `PUT /api/products/:id` - 상품 수정
- `DELETE /api/products/:id` - 상품 삭제

### 고객 관리
- `GET /api/customers` - 고객 목록
- `GET /api/customers/:id` - 고객 상세
- `GET /api/customers/search` - 고객 검색

### 세그먼트 관리
- `GET /api/segments` - 세그먼트 목록
- `POST /api/segments` - 세그먼트 생성
- `GET /api/segments/:id/customers` - 세그먼트 고객 목록

### 메시지 관리
- `GET /api/messages` - 메시지 목록
- `POST /api/messages` - 메시지 생성
- `POST /api/messages/generate` - AI 메시지 생성

### 분석
- `GET /api/analytics/dashboard` - 대시보드 통계
- `GET /api/analytics/messages` - 메시지 통계

## 환경 변수

```env
REACT_APP_API_URL=http://localhost:3001/api
```

## 요구사항 정의서 기반 기능 구현 현황

### ✅ 구현 완료
- RQ-0001 ~ RQ-0005: 사용자 관리 (로그인, 회원가입, 프로필, 권한 관리)
- RQ-0006 ~ RQ-0009: 캠페인 관리 (등록, 조회, 수정, 삭제)
- RQ-0010 ~ RQ-0013: 상품 관리 (등록, 조회, 수정, 삭제)
- RQ-0015 ~ RQ-0016: 고객 세그먼트 관리
- RQ-0017 ~ RQ-0025: 메시지 생성 (세그먼트, 개별, AI 생성, 선택, 수정)
- RQ-0048 ~ RQ-0050: 고객 관리 (검색, 360도 뷰, 1:1 메시지)

### 🚫 제외된 요구사항
- RQ-0026 ~ RQ-0030: 메시지 승인 및 발송 관리
- RQ-0032 ~ RQ-0034: 성과 분석 및 리포팅
- RQ-0036: 보안 관리 (수신동의)

## 향후 개선 사항

1. **AI 모델 통합**: 실제 GPT API 연동
2. **실시간 알림**: WebSocket 기반 실시간 업데이트
3. **고급 분석**: 대시보드 차트 및 리포트 기능
4. **모바일 반응형**: 모바일 최적화 개선
5. **성능 최적화**: 코드 스플리팅, 지연 로딩
6. **테스트**: 단위 테스트 및 통합 테스트 추가

## 라이선스

이 프로젝트는 내부 용도로만 사용됩니다.

## 문의사항

프로젝트 관련 문의사항은 개발팀으로 연락주세요.