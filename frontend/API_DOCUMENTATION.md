# DevMatch API 명세서 (최신 버전)

## 개요
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

## 인증
OAuth2를 사용한 소셜 로그인(구글, 카카오, 네이버)을 지원합니다.
- 로그인 성공 시 `apiKey`와 `accessToken` 쿠키가 설정됩니다.
- 인증이 필요한 API는 쿠키에 `apiKey`와 `accessToken`이 있어야 합니다.

## API 엔드포인트

### 1. 인증 (Auth) API

#### 1.1 OAuth2 로그인
```
GET /oauth2/authorization/{provider}?redirectUrl={redirectUrl}
```
- `provider`: google, kakao, naver 중 하나
- `redirectUrl`: 로그인 성공 후 리다이렉트할 URL (Base64 URL-safe 인코딩 필요)

#### 1.2 로그아웃
```
DELETE /auth/logout
```

**응답:**
```json
{
  "resultCode": "200-1",
  "statusCode": 200,
  "msg": "로그아웃 되었습니다.",
  "data": null
}
```

### 2. 사용자 (User) API

#### 2.1 사용자의 프로젝트 목록 조회
```
GET /users/{id}/projects
```

**경로 매개변수:**
- `id` (long): 사용자 ID

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

#### 2.2 사용자의 지원서 목록 조회
```
GET /users/{id}/applications
```

**경로 매개변수:**
- `id` (long): 사용자 ID

**응답:**
```json
{
  "msg": "조회 성공",
  "data": [
    {
      "applicationId": 1,
      "user": {
        "id": 1,
        "username": "사용자아이디",
        "nickname": "사용자닉네임",
        "profileImgUrl": "프로필이미지URL"
      },
      "status": "PENDING",
      "appliedAt": "2024-01-01T10:00:00"
    }
  ]
}
```

### 3. 프로젝트 (Project) API

#### 3.1 프로젝트 생성
```
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
- `userId`: 필수, 최소 1
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

#### 3.2 프로젝트 전체 조회
```
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

#### 3.3 프로젝트 단일 조회
```
GET /projects/{id}
```

**경로 매개변수:**
- `id` (long): 프로젝트 ID

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

#### 3.4 프로젝트 상태 수정
```
PATCH /projects/{id}/status
```

**경로 매개변수:**
- `id` (long): 프로젝트 ID

**요청 본문:**
```json
{
  "status": "COMPLETED"
}
```

**응답:**
```json
{
  "msg": "프로젝트 상태 수정 성공",
  "data": {
    "id": 1,
    "title": "프로젝트 제목",
    "description": "프로젝트 설명",
    "techStacks": ["Java", "Spring", "React"],
    "teamSize": 4,
    "currentTeamSize": 2,
    "creator": "생성자명",
    "status": "COMPLETED",
    "content": "프로젝트 내용",
    "createdAt": "2024-01-01T10:00:00"
  }
}
```

#### 3.5 프로젝트 내용 수정
```
PATCH /projects/{id}/content
```

**경로 매개변수:**
- `id` (long): 프로젝트 ID

**요청 본문:**
```json
{
  "content": "수정된 프로젝트 내용"
}
```

**응답:**
```json
{
  "msg": "역할 배분 내용 수정 성공",
  "data": {
    "id": 1,
    "title": "프로젝트 제목",
    "description": "프로젝트 설명",
    "techStacks": ["Java", "Spring", "React"],
    "teamSize": 4,
    "currentTeamSize": 2,
    "creator": "생성자명",
    "status": "RECRUITING",
    "content": "수정된 프로젝트 내용",
    "createdAt": "2024-01-01T10:00:00"
  }
}
```

#### 3.6 프로젝트 삭제
```
DELETE /projects/{id}
```

**경로 매개변수:**
- `id` (long): 프로젝트 ID

**응답:**
```
HTTP/1.1 204 No Content
```

#### 3.7 프로젝트의 지원서 전체 목록 조회
```
GET /projects/{id}/applications
```

**경로 매개변수:**
- `id` (long): 프로젝트 ID

**응답:**
```json
{
  "msg": "프로젝트의 지원서 전체 목록 조회 성공",
  "data": [
    {
      "applicationId": 1,
      "user": {
        "id": 1,
        "username": "사용자아이디",
        "nickname": "사용자닉네임",
        "profileImgUrl": "프로필이미지URL"
      },
      "status": "PENDING",
      "appliedAt": "2024-01-01T10:00:00"
    }
  ]
}
```

#### 3.8 프로젝트에 지원
```
POST /projects/{id}/applications
```

**경로 매개변수:**
- `id` (long): 프로젝트 ID

**요청 본문:**
```json
{
  "userId": 1,
  "techStacks": ["Java", "Spring"],
  "techScores": [8, 7]
}
```

**응답:**
```json
{
  "msg": "지원서 작성 성공",
  "data": {
    "applicationId": 1,
    "user": {
      "id": 1,
      "username": "사용자아이디",
      "nickname": "사용자닉네임",
      "profileImgUrl": "프로필이미지URL"
    },
    "status": "PENDING",
    "appliedAt": "2024-01-01T10:00:00"
  }
}
```

### 4. 지원서 (Application) API

#### 4.1 지원서 상세 조회
```
GET /applications/{id}
```

**경로 매개변수:**
- `id` (long): 지원서 ID

**응답:**
```json
{
  "msg": "1 번 지원서의 상세 정보 조회를 성공했습니다.",
  "data": {
    "applicationId": 1,
    "user": {
      "id": 1,
      "username": "사용자아이디",
      "nickname": "사용자닉네임",
      "profileImgUrl": "프로필이미지URL"
    },
    "status": "PENDING",
    "appliedAt": "2024-01-01T10:00:00"
  }
}
```

#### 4.2 지원서 삭제
```
DELETE /applications/{id}
```

**경로 매개변수:**
- `id` (long): 지원서 ID

**응답:**
```json
{
  "msg": "지원서의 삭제를 성공했습니다.",
  "data": null
}
```

#### 4.3 지원서 상태 업데이트
```
PATCH /applications/{id}/status
```

**경로 매개변수:**
- `id` (long): 지원서 ID

**요청 본문:**
```json
{
  "status": "APPROVED"
}
```

**응답:**
```json
{
  "msg": "지원서 상태를 업데이트했습니다.",
  "data": null
}
```

### 5. 분석 (Analysis) API

#### 5.1 지원서 분석 결과 조회
```
GET /analysis/application/{applicationId}
```

**경로 매개변수:**
- `applicationId` (long): 지원서 ID

**응답:**
```json
{
  "msg": "조회 성공",
  "data": {
    "id": 1,
    "applicationId": 1,
    "compatibilityScore": 75.50,
    "compatibilityReason": "React 우수하나 백엔드 부족"
  }
}
```

#### 5.2 지원서 분석 결과 생성
```
POST /analysis/application/{applicationId}
```

**경로 매개변수:**
- `applicationId` (long): 지원서 ID

**응답:**
```json
{
  "msg": "분석 결과 생성 성공",
  "data": {
    "id": 1,
    "applicationId": 1,
    "compatibilityScore": 75.50,
    "compatibilityReason": "React 우수하나 백엔드 부족"
  }
}
```

#### 5.3 프로젝트 팀 역할 분배
```
POST /analysis/project/{projectId}/role-assignment
```

**경로 매개변수:**
- `projectId` (long): 프로젝트 ID

**응답:**
```json
{
  "msg": "팀 역할 분배 완료",
  "data": "홍길동 - 프론트엔드 개발자\n김철수 - 백엔드 개발자"
}
```

## DTO 및 엔티티

### 1. 사용자 (User)

#### User 엔티티
| 필드명 | 타입 | 설명 |
|------|------|-----|
| id | Long | 사용자 ID |
| username | String | 사용자 아이디 (유니크) |
| password | String | 비밀번호 |
| nickname | String | 사용자 닉네임 |
| apiKey | String | API 키 (유니크) |
| profileImgUrl | String | 프로필 이미지 URL |

### 2. 프로젝트 (Project)

#### Project 엔티티
| 필드명 | 타입 | 설명 |
|------|------|-----|
| id | Long | 프로젝트 ID |
| title | String | 프로젝트 제목 |
| description | String | 프로젝트 설명 |
| techStack | String | 기술 스택 (쉼표로 구분된 문자열) |
| teamSize | Integer | 팀 규모 |
| currentTeamSize | Integer | 현재 팀원 수 |
| creator | User | 프로젝트 생성자 |
| status | ProjectStatus | 프로젝트 상태 |
| content | String | 프로젝트 내용 |
| durationWeeks | Integer | 프로젝트 기간 (주) |
| createdAt | LocalDateTime | 생성일시 |
| applications | List<Application> | 지원서 목록 |

#### ProjectCreateRequest DTO
| 필드명 | 타입 | 설명 | 유효성 검사 |
|------|------|-----|---------|
| userId | Long | 사용자 ID | @NotNull @Min(1) |
| title | String | 프로젝트 제목 | @NotNull @Size(min = 1, max = 200) |
| description | String | 프로젝트 설명 | @NotNull @Size(min = 1, max = 2000) |
| techStack | String | 기술 스택 | @NotNull @Size(min = 1, max = 500) |
| teamSize | int | 팀 규모 | @Min(1) |
| durationWeeks | int | 프로젝트 기간 | @Min(1) |

#### ProjectDetailResponse DTO
| 필드명 | 타입 | 설명 |
|------|------|-----|
| id | Long | 프로젝트 ID |
| title | String | 프로젝트 제목 |
| description | String | 프로젝트 설명 |
| techStacks | List<String> | 기술 스택 목록 |
| teamSize | Integer | 팀 규모 |
| currentTeamSize | Integer | 현재 팀원 수 |
| creator | String | 프로젝트 생성자 |
| status | String | 프로젝트 상태 |
| content | String | 프로젝트 내용 |
| createdAt | String | 생성일시 |

#### ProjectStatus ENUM
| 값 | 설명 |
|---|-----|
| RECRUITING | 모집중 |
| COMPLETED | 완료 |

### 3. 지원서 (Application)

#### Application 엔티티
| 필드명 | 타입 | 설명 |
|------|------|-----|
| id | Long | 지원서 ID |
| user | User | 지원자 |
| project | Project | 지원한 프로젝트 |
| status | ApplicationStatus | 지원서 상태 |
| appliedAt | LocalDateTime | 지원 일시 |
| skillScore | List<SkillScore> | 기술 점수 목록 |
| analysisResult | AnalysisResult | 분석 결과 |

#### ApplicationDetailResponseDto DTO
| 필드명 | 타입 | 설명 |
|------|------|-----|
| applicationId | Long | 지원서 ID |
| user | User | 지원자 정보 |
| status | ApplicationStatus | 지원서 상태 |
| appliedAt | LocalDateTime | 지원 일시 |

#### ApplicationStatusUpdateRequestDto DTO
| 필드명 | 타입 | 설명 | 유효성 검사 |
|------|------|-----|---------|
| status | ApplicationStatus | 상태 | @NotNull |

#### ApplicationStatus ENUM
| 값 | 설명 |
|---|-----|
| PENDING | 대기중 |
| APPROVED | 승인 |
| REJECTED | 거절 |

#### ProjectApplyRequest DTO
| 필드명 | 타입 | 설명 | 유효성 검사 |
|------|------|-----|---------|
| userId | Long | 사용자 ID | @NotNull @Min(1) |
| techStacks | List<String> | 기술 스택 목록 | @NotNull |
| techScores | List<Integer> | 기술 점수 목록 | @NotNull |

### 4. 기술 점수 (SkillScore)

#### SkillScore 엔티티
| 필드명 | 타입 | 설명 |
|------|------|-----|
| id | Long | 기술 점수 ID |
| application | Application | 소속 지원서 |
| techName | String | 기술명 |
| score | int | 점수 (1-10) |

### 5. 분석 결과 (AnalysisResult)

#### AnalysisResult 엔티티
| 필드명 | 타입 | 설명 |
|------|------|-----|
| id | Long | 분석 결과 ID |
| application | Application | 소속 지원서 |
| compatibilityScore | BigDecimal | 적합도 점수 |
| compatibilityReason | String | 적합도 이유 |

#### AnalysisResultResponse DTO
| 필드명 | 타입 | 설명 |
|------|------|-----|
| id | Long | 분석 결과 ID |
| applicationId | Long | 지원서 ID |
| compatibilityScore | BigDecimal | 적합도 점수 |
| compatibilityReason | String | 적합도 이유 |

## 오류 코드

| 코드 | HTTP 상태 | 메시지 | 설명 |
|-----|---------|-----|-----|
| 200-1 | 200 | 성공 | 요청 성공 |
| 201-1 | 201 | 생성됨 | 리소스 생성 성공 |
| 400-1 | 400 | 잘못된 요청 | 요청 데이터 형식 오류 |
| 401-1 | 401 | 인증 필요 | 로그인 필요 |
| 403-1 | 403 | 권한 없음 | 접근 권한 없음 |
| 404-1 | 404 | 찾을 수 없음 | 리소스 없음 |
| 409-1 | 409 | 충돌 | 이미 존재하는 리소스 |
| 500-1 | 500 | 서버 오류 | 내부 서버 오류 |
