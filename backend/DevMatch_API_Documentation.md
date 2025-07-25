# DevMatch 프로젝트 API 명세서

## 프로젝트 개요
DevMatch는 개발자 프로젝트 매칭 플랫폼으로, 프로젝트 생성, 지원서 관리, 적합도 분석 기능을 제공합니다.

## 공통 응답 형식

모든 API는 다음과 같은 공통 응답 형식을 사용합니다:

```json
{
  "msg": "성공/실패 메시지",
  "data": "실제 데이터 (선택적)"
}
```

## 베이스 URL
```
http://localhost:8080
```

---

# API 엔드포인트

## 1. 인증 (Auth) API

### 1.1 로그인
```http
POST /auth/login
```

**응답:**
```json
{
  "msg": "login"
}
```

### 1.2 로그아웃
```http
POST /auth/logout
```

**응답:**
```json
{
  "msg": "logout"
}
```

---

## 2. 사용자 (User) API

### 2.1 사용자 등록
```http
POST /users/register
```

**요청 본문:**
```json
"사용자이름"
```

**응답:**
```json
{
  "msg": "사용자 등록 성공",
  "data": {
    "id": 1,
    "name": "사용자이름"
  }
}
```

### 2.2 사용자의 프로젝트 목록 조회
```http
GET /users/{id}/projects
```

**경로 매개변수:**
- `id` (long): 사용자 ID

**응답:**
```json
[
  {
    "id": 1,
    "title": "프로젝트 제목",
    "description": "프로젝트 설명",
    "techStacks": ["Java", "Spring", "React"],
    "teamSize": 4,
    "currentTeamSize": 2,
    "creator": "생성자명",
    "status": "RECRUITING",
    "content": "프로젝트 내용",
    "createdAt": "2024-01-01T10:00:00"
  }
]
```

### 2.3 사용자의 지원서 목록 조회
```http
GET /users/{id}/applications
```

**경로 매개변수:**
- `id` (long): 사용자 ID

**응답:**
```json
[
  {
    "id": 1,
    "user": {
      "id": 1,
      "name": "사용자명"
    },
    "project": {
      "id": 1,
      "title": "프로젝트명"
    },
    "status": "PENDING",
    "appliedAt": "2024-01-01T10:00:00",
    "skillScore": [],
    "analysisResult": null
  }
]
```

---

## 3. 프로젝트 (Project) API

### 3.1 프로젝트 생성
```http
POST /projects
```

**요청 본문:**
```json
{
  "userId": 1,
  "title": "프로젝트 제목",
  "description": "프로젝트 설명",
  "techStack": "Java,Spring,React",
  "teamSize": 4,
  "durationWeeks": 12
}
```

**유효성 검사:**
- `title`: 1-200자 필수
- `description`: 1-2000자 필수
- `techStack`: 1-500자 필수
- `teamSize`: 최소 1
- `durationWeeks`: 최소 1

**응답:**
```json
{
  "msg": "프로젝트 생성 성공",
  "data": {
    "id": 1,
    "title": "프로젝트 제목",
    "description": "프로젝트 설명",
    "techStacks": ["Java", "Spring", "React"],
    "teamSize": 4,
    "currentTeamSize": 0,
    "creator": "생성자명",
    "status": "RECRUITING",
    "content": "",
    "createdAt": "2024-01-01T10:00:00"
  }
}
```

### 3.2 프로젝트 전체 목록 조회
```http
GET /projects
```

**응답:**
```json
{
  "msg": "프로젝트 전체 조회 성공",
  "data": [
    {
      "id": 1,
      "title": "프로젝트 제목",
      "description": "프로젝트 설명",
      "techStacks": ["Java", "Spring", "React"],
      "teamSize": 4,
      "currentTeamSize": 2,
      "creator": "생성자명",
      "status": "RECRUITING",
      "content": "프로젝트 내용",
      "createdAt": "2024-01-01T10:00:00"
    }
  ]
}
```

### 3.3 프로젝트 단일 조회
```http
GET /projects/{id}
```

**경로 매개변수:**
- `id` (Long): 프로젝트 ID

**응답:**
```json
{
  "msg": "프로젝트 단일 조회 성공",
  "data": {
    "id": 1,
    "title": "프로젝트 제목",
    "description": "프로젝트 설명",
    "techStacks": ["Java", "Spring", "React"],
    "teamSize": 4,
    "currentTeamSize": 2,
    "creator": "생성자명",
    "status": "RECRUITING",
    "content": "프로젝트 내용",
    "createdAt": "2024-01-01T10:00:00"
  }
}
```

---

## 4. 지원서 (Application) API

### 4.1 지원서 상세 조회
```http
GET /applications/{id}
```

**경로 매개변수:**
- `id` (Long): 지원서 ID

**응답:**
```json
{
  "msg": "1 번 지원서의 상세 정보 조회를 성공했습니다.",
  "data": {
    "id": 1,
    "user": {
      "id": 1,
      "name": "지원자명"
    },
    "status": "PENDING",
    "appliedAt": "2024-01-01T10:00:00"
  }
}
```

### 4.2 지원서 삭제
```http
DELETE /applications/{id}
```

**경로 매개변수:**
- `id` (Long): 지원서 ID

**응답:**
```json
{
  "msg": "지원서의 삭제를 성공했습니다.",
  "data": null
}
```

**HTTP 상태 코드:** 204 No Content

---

## 5. 분석 (Analysis) API

### 5.1 지원서 분석 결과 조회
```http
GET /analysis/application/{applicationId}
```

**경로 매개변수:**
- `applicationId` (Long): 지원서 ID

**응답:**
```json
{
  "msg": "조회 성공",
  "data": {
    "id": 1,
    "applicationId": 1,
    "compatibilityScore": 85.5,
    "compatibilityReason": "Java와 Spring 기술 스택이 매우 적합하며, 팀워크 경험이 풍부합니다."
  }
}
```

### 5.2 지원서 분석 결과 생성
```http
POST /analysis/application/{applicationId}
```

**경로 매개변수:**
- `applicationId` (Long): 지원서 ID

**응답:**
```json
{
  "msg": "분석 결과 생성 성공",
  "data": {
    "id": 1,
    "applicationId": 1,
    "compatibilityScore": 85.5,
    "compatibilityReason": "Java와 Spring 기술 스택이 매우 적합하며, 팀워크 경험이 풍부합니다."
  }
}
```

**HTTP 상태 코드:** 201 Created

### 5.3 팀 역할 분배 생성
```http
POST /analysis/project/{projectId}/role-assignment
```

**경로 매개변수:**
- `projectId` (Long): 프로젝트 ID

**응답:**
```json
{
  "msg": "팀 역할 분배 완료",
  "data": "역할 분배 결과 문자열"
}
```

**HTTP 상태 코드:** 201 Created

---

# 데이터 모델 (DTO)

## Request DTOs

### ProjectCreateRequest
```json
{
  "userId": 1,
  "title": "프로젝트 제목 (1-200자)",
  "description": "프로젝트 설명 (1-2000자)",
  "techStack": "기술 스택 (1-500자)",
  "teamSize": 4,
  "durationWeeks": 12
}
```

## Response DTOs

### UserRegisterDto
```json
{
  "id": 1,
  "name": "사용자명"
}
```

### ProjectDetailResponse
```json
{
  "id": 1,
  "title": "프로젝트 제목",
  "description": "프로젝트 설명",
  "techStacks": ["Java", "Spring", "React"],
  "teamSize": 4,
  "currentTeamSize": 2,
  "creator": "생성자명",
  "status": "RECRUITING | COMPLETED",
  "content": "프로젝트 내용",
  "createdAt": "2024-01-01T10:00:00"
}
```

### ApplicationDetailResponseDto
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "name": "지원자명"
  },
  "status": "PENDING | APPROVED | REJECTED",
  "appliedAt": "2024-01-01T10:00:00"
}
```

### AnalysisResultResponse
```json
{
  "id": 1,
  "applicationId": 1,
  "compatibilityScore": 85.5,
  "compatibilityReason": "분석 결과 설명"
}
```

---

# 엔티티 관계도 (ERD)

## 엔티티 구조

### User (사용자)
```
users
├── id (PK, Long) - 사용자 ID
└── name (String, 1-50자) - 사용자 이름
```

### Project (프로젝트)
```
projects
├── id (PK, Long) - 프로젝트 ID
├── title (String) - 프로젝트 제목
├── description (String) - 프로젝트 설명
├── techStack (String) - 기술 스택
├── teamSize (Integer) - 팀 크기
├── currentTeamSize (Integer) - 현재 팀 크기
├── creator_id (FK → User.id) - 생성자 ID
├── status (ProjectStatus) - 프로젝트 상태
├── content (String) - 프로젝트 내용
├── durationWeeks (Integer) - 진행 기간(주)
└── createdAt (LocalDateTime) - 생성 일시
```

### Application (지원서)
```
application
├── application_id (PK, Long) - 지원서 ID
├── user_id (FK → User.id) - 지원자 ID
├── project_id (FK → Project.id) - 프로젝트 ID
├── application_status (ApplicationStatus) - 지원서 상태
├── appliedAt (LocalDateTime) - 지원 일시
└── analysisResult_id (FK → AnalysisResult.id) - 분석 결과 ID
```

### SkillScore (기술 점수)
```
skillScore
├── skillScore_id (PK, Long) - 기술 점수 ID
├── application_id (FK → Application.id) - 지원서 ID
├── skillScore_techName (String) - 기술명
└── skillScore_score (int) - 점수 (1-10)
```

### AnalysisResult (분석 결과)
```
analysis_results
├── id (PK, Long) - 분석 결과 ID
├── application_id (FK → Application.id) - 지원서 ID
├── compatibility_score (double) - 적합도 점수
└── compatibilityReason (TEXT) - 적합도 이유
```

## 관계 설명

1. **User ↔ Project**: 1:N 관계
   - 한 사용자는 여러 프로젝트를 생성할 수 있음
   - `Project.creator_id` → `User.id`

2. **User ↔ Application**: 1:N 관계
   - 한 사용자는 여러 지원서를 작성할 수 있음
   - `Application.user_id` → `User.id`

3. **Project ↔ Application**: 1:N 관계
   - 한 프로젝트에 여러 지원서가 제출될 수 있음
   - `Application.project_id` → `Project.id`

4. **Application ↔ SkillScore**: 1:N 관계
   - 한 지원서에 여러 기술 점수가 기록될 수 있음
   - `SkillScore.application_id` → `Application.id`

5. **Application ↔ AnalysisResult**: 1:1 관계
   - 한 지원서에 하나의 분석 결과가 대응됨
   - `AnalysisResult.application_id` → `Application.id`

## 열거형 (Enums)

### ProjectStatus
```java
public enum ProjectStatus {
    RECRUITING,  // 모집중
    COMPLETED    // 완료
}
```

### ApplicationStatus
```java
public enum ApplicationStatus {
    PENDING,   // 대기중
    APPROVED,  // 승인
    REJECTED   // 거절
}
```

---

# HTTP 상태 코드

| 상태 코드 | 설명 | 사용 케이스 |
|-----------|------|-------------|
| 200 OK | 성공 | GET 요청 성공 |
| 201 Created | 생성 성공 | POST 요청으로 리소스 생성 |
| 204 No Content | 내용 없음 | DELETE 요청 성공 |
| 400 Bad Request | 잘못된 요청 | 유효성 검사 실패 |
| 404 Not Found | 리소스 없음 | 존재하지 않는 리소스 요청 |
| 500 Internal Server Error | 서버 에러 | 서버 내부 오류 |

---

# 개발 참고사항

## 유효성 검사
- 모든 Request DTO는 `@Valid` 어노테이션으로 검증
- Jakarta Validation 어노테이션 사용 (`@Size`, `@Min`, `@NotNull` 등)

## 연관관계 관리
- JPA 양방향 연관관계 사용
- Lazy Loading 적용으로 성능 최적화
- Cascade 옵션과 orphanRemoval 활용

## 보안
- 세션 기반 인증 + CSRF 토큰 사용
- 현재 AuthController는 기본 구현만 제공

## 데이터베이스
- MySQL/MariaDB 사용 권장
- JPA Auditing으로 생성/수정 시간 자동 관리
- 인덱스 설정: `projects.creator_id`

이 문서는 프론트엔드 개발자가 DevMatch API를 사용하여 클라이언트 애플리케이션을 개발할 때 필요한 모든 정보를 포함하고 있습니다.