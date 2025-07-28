# 📱 프론트엔드 페이지별 API 사용 현황

이 문서는 `frontend/src/app/*` 디렉토리의 각 페이지에서 사용하는 API와 그 용도를 정리한 문서입니다.

## 📁 디렉토리 구조

```
frontend/src/app/
├── page.tsx (루트 페이지)
├── projects/
│   ├── [id]/
│   │   └── page.tsx (프로젝트 상세 페이지)
│   ├── create/
│   │   └── page.tsx (프로젝트 생성 페이지)
│   └── my-projects/
│       └── page.tsx (내 프로젝트 관리 페이지)
```

## 🏠 루트 페이지 (`/`)

**파일:** `frontend/src/app/page.tsx`

### 사용하는 API

#### 1. 프로젝트 관련 API (`project.ts`)
- `getAllProjects()`
  - **용도:** 전체 프로젝트 목록 조회
  - **사용 위치:** 프로젝트 목록 표시
  - **백엔드 연동:** `GET /projects`

#### 2. 사용자 관련 API (`user.ts`)
- `getUserProjects(userId)`
  - **용도:** 로그인한 사용자의 프로젝트 목록 조회
  - **사용 위치:** 사용자 대시보드의 "내 프로젝트" 수 표시
  - **백엔드 연동:** `GET /users/{id}/projects`
- `getUserApplications(userId)`
  - **용도:** 로그인한 사용자의 지원서 목록 조회
  - **사용 위치:** 사용자 대시보드의 "지원서" 수 표시
  - **백엔드 연동:** `GET /users/{id}/applications`

### 주요 기능
- 전체 프로젝트 목록 표시
- 로그인한 사용자의 대시보드 표시 (내 프로젝트 수, 지원서 수 등)
- 프로젝트 검색 및 필터링
- OAuth 로그인/회원가입

## 📄 프로젝트 상세 페이지 (`/projects/[id]`)

**파일:** `frontend/src/app/projects/[id]/page.tsx`

### 사용하는 API

#### 1. 프로젝트 관련 API (`project.ts`)
- `getProject(id)`
  - **용도:** 특정 프로젝트의 상세 정보 조회
  - **사용 위치:** 프로젝트 상세 정보 표시
  - **백엔드 연동:** `GET /projects/{id}`
- `applyToProject(projectId, data)`
  - **용도:** 프로젝트에 지원
  - **사용 위치:** 지원하기 모달에서 지원서 제출
  - **백엔드 연동:** `POST /projects/{id}/applications`

### 주요 기능
- 프로젝트 상세 정보 표시 (제목, 설명, 기술 스택 등)
- 프로젝트 지원 기능 (기술 스택별 점수 입력 및 지원)
- 프로젝트 상태 표시 (모집중, 진행중, 완료)

## ➕ 프로젝트 생성 페이지 (`/projects/create`)

**파일:** `frontend/src/app/projects/create/page.tsx`

### 사용하는 API

#### 1. 프로젝트 관련 API (`project.ts`)
- `createProject(data)`
  - **용도:** 새 프로젝트 생성
  - **사용 위치:** 프로젝트 생성 폼 제출
  - **백엔드 연동:** `POST /projects`

### 주요 기능
- 새 프로젝트 생성 폼
- 기술 스택 추가/제거
- 팀 크기 및 프로젝트 기간 설정
- 입력 데이터 유효성 검사

## ⚙️ 내 프로젝트 관리 페이지 (`/projects/my-projects`)

**파일:** `frontend/src/app/projects/my-projects/page.tsx`

### 사용하는 API

#### 1. 프로젝트 관련 API (`project.ts`)
- `getUserProjects(userId)`
  - **용도:** 로그인한 사용자가 만든 프로젝트 목록 조회
  - **사용 위치:** 내 프로젝트 목록 표시
  - **백엔드 연동:** `GET /users/{id}/projects`
- `updateProjectStatus(projectId, status)`
  - **용도:** 프로젝트 상태 변경
  - **사용 위치:** 상태 변경 모달
  - **백엔드 연동:** `PATCH /projects/{id}/status`
- `updateProjectContent(projectId, content)`
  - **용도:** 프로젝트 내용 수정
  - **사용 위치:** 내용 수정 모달
  - **백엔드 연동:** `PATCH /projects/{id}/content`
- `deleteProject(projectId)`
  - **용도:** 프로젝트 삭제
  - **사용 위치:** 삭제 확인 모달
  - **백엔드 연동:** `DELETE /projects/{id}`
- `getProjectApplications(projectId)`
  - **용도:** 프로젝트에 대한 지원서 목록 조회
  - **사용 위치:** 지원서 조회 모달
  - **백엔드 연동:** `GET /projects/{id}/applications`

### 주요 기능
- 사용자가 만든 프로젝트 목록 표시
- 프로젝트별 통계 정보 표시
- 프로젝트 상태 변경
- 프로젝트 내용 수정
- 프로젝트 삭제
- 프로젝트 지원서 조회

## 📡 API 모듈별 연동 현황

### `project.ts`
| 함수명 | 백엔드 연동 | 구현 상태 | 용도 |
|--------|-------------|-----------|------|
| `createProject` | `POST /projects` | ✅ 구현완료 | 새 프로젝트 생성 |
| `getAllProjects` | `GET /projects` | ✅ 구현완료 | 전체 프로젝트 목록 조회 |
| `getProject` | `GET /projects/{id}` | ✅ 구현완료 | 특정 프로젝트 상세 조회 |
| `updateProjectStatus` | `PATCH /projects/{id}/status` | ✅ 구현완료 | 프로젝트 상태 변경 |
| `updateProjectContent` | `PATCH /projects/{id}/content` | ⚠️ 부분구현 | 프로젝트 내용 수정 |
| `deleteProject` | `DELETE /projects/{id}` | ⚠️ 부분구현 | 프로젝트 삭제 |
| `getProjectApplications` | `GET /projects/{id}/applications` | ⚠️ 부분구현 | 프로젝트 지원서 목록 조회 |
| `applyToProject` | `POST /projects/{id}/applications` | ⚠️ 부분구현 | 프로젝트 지원 |

### `user.ts`
| 함수명 | 백엔드 연동 | 구현 상태 | 용도 |
|--------|-------------|-----------|------|
| `registerUser` | `POST /users/register` | ✅ 구현완료 | 사용자 등록 |
| `getUserProjects` | `GET /users/{id}/projects` | ✅ 구현완료 | 사용자 프로젝트 목록 조회 |
| `getUserApplications` | `GET /users/{id}/applications` | ✅ 구현완료 | 사용자 지원서 목록 조회 |

### `auth.ts`
| 함수명 | 백엔드 연동 | 구현 상태 | 용도 |
|--------|-------------|-----------|------|
| `login` | `POST /auth/login` | ⚠️ 기본구현 | 로그인 |
| `logout` | `POST /auth/logout` | ⚠️ 기본구현 | 로그아웃 |
| `getCurrentUser` | `GET /auth/me` | ❌ 미구현 | 현재 로그인한 사용자 정보 조회 |
| `authenticateUser` | `POST /auth/login` | ❌ 미구현 | 실제 사용자 인증 |

### `application.ts`
| 함수명 | 백엔드 연동 | 구현 상태 | 용도 |
|--------|-------------|-----------|------|
| `getApplicationDetail` | `GET /applications/{id}` | ✅ 구현완료 | 지원서 상세 정보 조회 |
| `deleteApplication` | `DELETE /applications/{id}` | ✅ 구현완료 | 지원서 삭제 |
| `updateApplicationStatus` | `PUT /applications/{id}/status` | ❌ 미구현 | 지원서 상태 변경 |
| `createApplication` | `POST /applications` | ❌ 미구현 | 지원서 생성 |

### `analysis.ts`
| 함수명 | 백엔드 연동 | 구현 상태 | 용도 |
|--------|-------------|-----------|------|
| `getAnalysisResult` | `GET /analysis/application/{applicationId}` | ✅ 구현완료 | 지원서 분석 결과 조회 |
| `createAnalysisResult` | `POST /analysis/application/{applicationId}` | ✅ 구현완료 | 지원서 분석 결과 생성 |
| `createTeamRoleAssignment` | `POST /analysis/project/{projectId}/role-assignment` | ✅ 구현완료 | 프로젝트 팀 역할 분배 |

## 📝 참고사항

- ✅ **구현완료**: 백엔드와 프론트엔드 모두 구현이 완료된 기능
- ⚠️ **부분구현**: 백엔드 또는 프론트엔드 중 일부만 구현된 기능
- ❌ **미구현**: 아직 구현되지 않은 기능

백엔드 미구현 기능들은 프론트엔드에서는 UI만 구현되어 있으며, 실제 동작은 하지 않습니다. 해당 기능들을 사용하려면 백엔드 구현이 필요합니다.
