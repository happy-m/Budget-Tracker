# budget-tracker

저축 중심 개인 가계부 시스템.

## 기능 (계획)

- 자산(계좌) 분리 관리: 생활비 / 여행 / 월급 / 모임통장 등
- 수입 / 지출 / 이체(자산간 이동) 구분 처리
- 연도별 / 월별 저축 추이 시각화
- 작년 대비 저축·소비 증감 비교 (YoY)
- 현재 페이스 기반 연말 저축액 예측
- 목표 기반 저축 (예: "유럽여행 500만원" 진행률)
- 고정 지출 자동 인식 (월세 등)

## 기술 스택

- Java 21
- Spring Boot 3.5.14
- Spring Data JPA, Spring Web, Spring Data Redis, Actuator, Validation
- PostgreSQL 16
- Redis 7
- Lombok
- Gradle

## 사전 요구

- JDK 21 (Eclipse Temurin)
- Docker Desktop
- Git

## 로컬 실행

### 1. 인프라(DB/Redis) 기동

```powershell
docker compose up -d
```

상태 확인:

```powershell
docker compose ps
```

### 2. 애플리케이션 실행

```powershell
.\gradlew bootRun
```

기본 포트: `http://localhost:8080`

헬스체크: `http://localhost:8080/actuator/health`

### 3. 종료

```powershell
docker compose down
```

데이터까지 삭제하려면:

```powershell
docker compose down -v
```

## 디렉토리 구조

```
budget-tracker/
├ src/main/java/com/example/budgettracker/   # 애플리케이션 코드
├ src/main/resources/application.yml         # 설정
├ src/test/                                   # 테스트
├ docker-compose.yml                          # PostgreSQL + Redis
└ build.gradle                                # 의존성·빌드
```

## DB 접속 정보 (로컬 개발용)

| 항목 | 값 |
|---|---|
| Host | localhost |
| Port | 5432 |
| Database | budget_tracker |
| User | budget |
| Password | budget |

## 주의

- `application.yml`의 DB 비밀번호는 로컬 개발용. 운영 환경에선 환경변수·시크릿으로 분리해야 함.
