# SQL Antipatterns

## 물리적 데이터베이스 설계 안티패턴

### 반올림 오류

- 목표: 정수 대신 소수 사용
  - float 칼럼을 추가했지만, 소수계산이 안 맞음
  - 소수 둘째 자리까지 표현하자
- 안티패턴: FLOAT데이터 타입 사용
  - 프로그래밍언어의 float처럼 IEEE 754표준에 따라 이진 형식으로 부호화
  - 필요에 의한 반올림
    - 1/3, 0.333...같은 순환소수 반올림해 표현
      - 1/3 + 1/3 + 1/3 = 1
      - 0.33 + 0.33 + 0.33 = 0.99
  - SQL에서 FLOAT 사용
    - DB 저장된 수 59.95에 10억을 곱하면
      - 기대값: 59950000000.000
      - 실제값: 59950000762.939
    - 59.95로 검색을 하면
      - 결과가 없음

        ```SQL
        SELECT * FROM Accounts WHERE hourly_rate = 59.95;
        ```

    - 오차가 금융의 복리계산처럼 중첩되면 차이가 커짐

- 안티패턴 인식 방법
  - FLOAT, REAL, DOUBLE PRECISION 데이터 타입 사용

- 안티패턴 사용이 합당한 경우
  - INTEGER나 NUMBER 타입의 지원범위 보다 큰 범위의 실수 사용
  - 과학계산용 애플리케이션
  - Orale의 FLOAT 정확한 자릿수 지님
    - BINARY_FLOAT타입이 IEEE 754 사용해 수치 표현

- 해법: NUMERIC 데이터 타입 사용
  - 고정 소수점 수에는 NUMERIC 또는 DECIMAL 타입 사용
  - 지정한 정도까지 수치를 정확히 표현
    - 정도: 츙 자릿수(아래 예의 정도는 9)
    - 스케일: 소수점 오른쪽 자릿수로 정도에 포함됨
    - 59.95를 저장하면 정확하게 59.95로 저장됨

    ```SQL
    ALTER TABLE Bugs ADD COLUMN hours NUMERIC(9,2);
    ALTER TABLE Accounts ADD COLUMN hourly_rate NUMERIC(9,2);
    ```

  > 가능하면 FLOAT 사용하지 말라

---

### 31가지 맛

- 목표: 칼럼을 특정 값으로 제한하기
  - 칼럼의 값을 고정된 값들로의 제한은 매우 유용
- 안티패턴: 칼럼 정의에 값 지정
  - 칼럼 정의
    - 칼럼 CHECK제약조건
    - MySQL ENUM 데이터 타입: 정렬시 알파벳 아닌 목록 서수 값으로 정렬
  - 중간에 있는 게 뭐지?
    - 칼럼 내 허용 데이터를 리스트오 출력
      - DISTINCT: 테이블에 존재하는 데이터만 출력하는 문제 발생
      - 칼럼 메타데이터 출력은 복잡하며, 결과도 문자열이라 값추출 코드 필요

        ```sql
        SELECT column_type
        FROM information_schema.columns
        WHERE table_schema = 'bugtracker_schema'
          AND table_name = 'bugs'
          AND column_name = 'status';
          -- 결과: ENUM('NEW’, 'IN PROGRESS’, 'FIXED’)
        ```

  - 새로운 맛 추가하기
    - ENUM이나 CHECK제약은 값 추가 삭제 불가하여 칼럼 재정의만 가능
    - 기존 허용 값 조회 필요
    - 데이터 존재 시, 테이블 재정의 불가 DB도 존재

  - 예전 맛은 절대 없어지지 않는다
    - 기존 값을 더 이상 사용하지 않게 만들면, 과거 데이터 훼손 발생
    - CHECK조건에 A입력을 제거할 경우
      - 과거 데이터는 삭제하나?
      - 새로운 입력만 불허하고, 과거 데이터 참조만 가능하게는 어떻게 하지?
  
  - 포팅이 어렵다
    - CHECK제약조건, ENUM 등 지원이 모든 DB에서 동일하지 않음
      - 제한하는 데이터 수가 DB마다 다름
    - 여러 DB 사용하는 경우 관리 어려움

- 안티패턴 인식 방법
  - 선택항목 추가는 DB를 잠시 멈춰야 해
  - 해당 칼럼의 값은 목록이 정해져 있고, 바뀌어서는 안 돼
  - 애플리케이션 코드 목록 값과 DB 비즈니스 규칙이 또 틀어졌어

- 안티패턴 사용이 합당한 경우
  - 값의 집합이 변하지 않는다면 ENUM 사용 문제 없음
  - 예: LEFT/RIGHT, ACTIVE/INACTIVE, ON/OFF, INTERNAL/EXTERNAL

- 해법: 데이터로 값을 지정하기
  - 칼럼에 허용하는 데이터를 모은 색인 테이블 작성해 FK제약조건 설정

    ```SQL
    CREATE TABLE BugStatus (
      status VARCHAR(20) PRIMARY KEY
    );

    INSERT INTO BugStatus (status)
      VALUES ('NEW'), ('IN PROGRESS'), ('FIXED');

    CREATE TABLE Bugs (
      ...
      status VARCHAR(20),
      FOREIGN KEY (status) REFERENCES BugStatus(status)
      ON UPDATE CASCADE
    );
    ```

  - 값의 집합 쿼리하기
    - 색인 테이블 SELECT로 출력 가능
    - 예상가능한 정렬 가능

  - 색인 테이블의 값 갱신하기
    - 평범한 INSERT, DELETE, UPDATE문으로 갱신 가능
    - DB 운영중에도 실시간 변경 가능
    - 제약중인 현재 값을 알 필요 없음

  - 더 이상 사용하지 않는 값 지원하기
    - 더 이상 사용하지 않는 데이터는 active칼럼을 추가해 구분

    ```SQL
    -- 사용하는 값만 출력
    SELECT status FROM BugStatus WHERE active = 'ACTIVE';
    ```

  - 포팅이 쉽다
    - 색인 테이블의 FK제약조건은 표준 SQL 기능만 사용
    - 색인 테이블 내 관리 데이터 제한 없음

  > 고정된 값의 집합에 대한 유효성 확인은 메타데이터 사용  
    유동적 값의 집합에 대한 유효성 확인은 일반 데이터 사용

---

### 유령 파일

- 목표: 이미지 또는 벌크 미디어 저장

- 안티패턴: 파잉을 사용해야 한다고 가정한다
  - 개념적으로 이미지는 테이블의 속성(BLOB 저장 가능)
  - 이미지를 파일 시스템에 저장하고 그 경로만 VARCHAR로 DB 저장
  - DELETE 문제
    - DB의 이미지관련 행 삭제시, 실제 이미지 파일 삭제 설계 필요 
  - 트랜젝션 문제
    - DB 밖 파일 변경은 트랜젝션 제어 범위 밖
  - ROLLBACK 문제
    - 롤백으로 DB의 삭제 데이터는 복구되지만, 지워진 파일은 복구 불가
  - 백업 문제
    - DB제품은 백업도구를 지원하지만, 외부 파일 백업은 안 다룸
    - 파일 시스템 백업 도구의 별도 사용 필요
    - DB와 실제 파일의 백업 동기화 상태를 신뢰하기 어려움
  - SQL 접근 권한 문제
    - 파일 경로만 알면, SQL문 접근권한을 우회해서 파일 조작 가능
  - SQL 데이터 타입 문제
    - 경로는 문자열일 뿐으로 경로의 유효성 검사는 별도로 필요
    - 실제 파일의 이름 변경이나 삭제가 발생해도 DB 데이터는 변화 없음
    - DB의 정합성 유지 장점을 못 누리고, 애플이케이션 코드 필요

- 안티패턴 인식 방법
  - 모든 애플리케이션이 정확한 트랜잭션 관리나 SQL접근 제어가 필여하지는 않음
    - 백업 수행 시 DB 내리는 것도 괜찮은 방법
    - 그러나, 다음 질문에 대한 답이 없다면 잘못된 설계
  - 데이터 백업과 복원 절차는?
    - 백업 겅증 방법은?
    - 백업을 만든 서버 이외의 서버에서 데이터 복원 테스트 해보았나?
  - 이미지는 계속 쌓이는 가, 불필요 시 삭제하나?
    - 이미지 삭제 절차는?
    - 수작업인가, 자동화된 절차인가?
  - 애플리케이션 사용자별로 이미지 보는 권한이 있나?
    - 권한 확인은 어떻게?
    - 권한 없는 이미지 요청시 사용자 화면은?
  - 이미지에 대한 변경 취소 가능?
    - 그렇다면, 애플리케이션이 이전 상태의 이미지로 복원하나?

- 안티패턴 사용이 합당한 경우
  - 위의 단점 보다 아래 장점이 중요한 경우
    - (이미지 외부 저장이 맞는 경우도 있다)
  - 이미지가 없다면 DB가 훨씬 가벼움
  - 이미지 제외 시, DB 백업이 신속하며 적음
    - 별도의 백업으로 파일 시스템 이미지 복사가 필요하나, DB백업 보다 쉬움
  - DB 외부 파일에 이미지가 있으면, 일반적인 이미지 미리보기나 편집이 쉬움

- 해법: 필요한 경우에는 BLOB 데이터 타입을 사용하라
  - 안티패턴 모든 이유 해결
    - 이미지 로드용 별도 단계 불필요하며 경로가 틀릴 일도 없음
    - 행 삭제는 바로 이미지 삭제와 동일
    - 커밋 전까지 이미지 변경이 다른 클라이언트에게 안 보임
    - 트랜잭션 롤백으로 바로 이미지 복원 가능
    - 행 업데이트는 잠금 설정되어 다른 클라이언트 동시 업데이트 방지
    - DB백업에 모든 이미지 포함
    - SQL 권한은 행과 이미지 접근까지 제어
  - 보동 BLOB을 사용하나, DB 제품마다 이미지 관련 데이터 타입 지원
  - 몇몇 DB 제품은 외부 파일 읽어 들이는 함주 제공

  > DB 밖 리소스는 DB 관리 밖이다

---

### 인덱스 샷건

- 목표: 성능 최적화
  - 인덱스는 DB 성능 향상에 가장 좋은 방법

- 안티패턴: 무계획하게 인덱스 사용하기
  > 인덱스는 SQL표준이 아니므로 DB마다 공부해야하나 논리적 개념은 동일
  - 추측으로 인덱스 설정시 발생하는 실수
    - 인덱스가 불충분하거나 아예 없음
    - 인덱스가 너무 많거나 불필요한 정의가 생김
    - 어떤 인덱스도 도움이 될 수 없는 쿼리 실행
  - 없는 인덱스
    - 인덱스 유지는 오버헤드가 있으나 그 이상의 이득이 존재
    - 일반적인 애플리케이션은 한 데이터 업데이트 위해 수 많은 검색 필요
    - 인덱스는 원하는 행을 빨리 찾으므로 업데이트와 삭제에 도움
  - 너무 많은 인덱스
    - 사용되지 않은 인덱스는 아무 이득이 없다
    - 대부분 DB는 PK에 자동으로 인덱스 설정
      - PK칼럼에 인덱스 설정은 인덱스 중복으로 불필요한 오버헤드 발생
    - 긴 문자열 타입에 대한 인덱스는 크다(오버헤드? 용량?)
      - 보통 검색 및 정렬 대상이 아니다
    - 복합 인덱스는 이점이 많으나, 중복 및 미사용 복합 인덱스는 불필요
      - 검색 및 조인 조건, 정렬 순서에 맞춰 왼쪽부터 칼럼 나열
    - 쿼리에 도움되는 인덱스를 모르면 모든 칼럼과 조합으로 인덱스 생성
      - 엄청난 오버헤드 발생
  - 인덱스가 도움이 되지 않을 때
    - 아무런 인덱스를 사용할 수 없는 쿼리 실행은 실수
      - 홍 길동 이름검색에서 홍으로 찾는 것과 길동으로 찾는 차이
    - 예

      ```SQL
      CREATE INDEX TelephonBook ON Accounts(last_name, first_name);
      -- 복합 인덱스 순서와 반대
      SELECT * FROM Account ORDER BY first_name, last_name;

      -- 날짜는 연도로 시작, 월은 매년 있으므로 전 데이터 검색 필요
      SELECT * FROM Account WHERE MONTH(birth) = 4;

      -- 특정 이름을 가진 행 예측 불가
      SELECT * FROM Account
      WHERE first_name = 'Charles' OR last_name = 'Charles';

      -- 성 검색에는 도움되지만, 이름 검색에는 도움이 안 됨
      SELECT * FROM Account WHERE first_name = 'Charles';
      UNION
      SELECT * FROM Account WHERE last_name = 'Charles';

      -- 모든 문자열 검사하므로 인덱스 이점 없음
      SELECT * FROM Account WHERE first_name LIKE '%arl%';
      ```

- 안티패턴 인식 방법
  - 이게 내 쿼리인데 어떻게 빠르게 할 수 있을까
    - 테이블 설명, 인덱스, 데이터 크기, 성능 측정, 최적화 등 내용이 필요
  - 모든 필드에 인덱스를 걸었는데 왜 안 빠르지?
  - 인덱스가 DB성능을 낮춘다고 들어서 아예 안 써
  - 선택도(selectivity)가 낮은 인덱스
    - 테이블의 전체 행 수와 인덱스에서 구별되는 항목의 수의 비율
    - 구별되는 항목이 적으면, 인덱스는 비용만 들며 의미 없음

    ```SQL
    -- 데이터가 다양해야 인덱스의 이점을 누린다
    SELECT COUNT(DISTINCT status) / COUNT(status) AS selectivity FROM BUGS
    ```

- 안티패턴 사용이 합당한 경우
  - 어떤 쿼리를 최적화하는 것이 중요한지 모르는 상태
  - 하지만 회적의 추측을 해야 함

- 해법: 인덱스를 MENTOR하라
  - DB 분석해 인덱스 생성 이점이 있는지 판단
    - Measure, Explain, Nominate, Test, Optimize, Rebuild
  - 측정(Measure)
    - 대부분의 DB는 SQL 실행시간 로그 남김(SQL Server Profiler)
    - 많은 시간을 잡아먹는 쿼리 찾아서 집중 개선
    - 자주 실행되는 쿼리 개선
    - 쿼리 성능 측정 시, 쿼리 결과 캐싱 기능 비활성화 필요
    - 애플리케이션 디플로이 후 프로파일링하면 좋음
      - 다만, 오버헤드가 발생하니 측정 후 축소 및 비활성화 필요
  - 실행 계획 확인(Explain)
    - 위의 측정으로 찾은 고비용 쿼리의 느린 이유 찾기
    - 모든 DB는 옵티마이저(optimizer) 사용 분석결과를 리포트로 볼 수 있음
      - 쿼리 실행 계획(QEP, query execution plan)이라 부름
      - 쿼리 실행 계획 요청 문법
        | 데이터베이스 제품 | 쿼리 실행 계획 요청 문법 |
        |-|-|
        | IBM DB2 | EXPLAIN, db2expln 명령, Visual Explain |
        | Microsoft SQL Server|  SET SHOWPLAN_XML 또는 Display Execution Plan |
        | MySQL | EXPLAIN |
        | Oracle | EXPLAIN PLAN |
        | PostgreSQL|  EXPLAIN |
        | SQLite | EXPLAIN |
  - 지명(Nominate)
    - 쿼리 추적통계정보로 인덱스 추천하는 DB 기능 존재
      - IBM DB2 Design Advisor
      - Microsoft SQL Server Database Engine Tuning Advisor
      - MySQL Enterprise Query Analyzer
      - Oracle Automatic SQL Tuning Advisor
      - 오토메틱 어드바이저 없다면, DB문서 공부해 쿼리 실행 계획 리포트 해석
    - 커버링 인덱스
      - 결과에 불필요하지만 행 검색에 도움되는 칼럼에 인덱스 설정
      - 전화번호부 예
        - (이름, 전화번호)만 검색
        - (이름, **페이지**, 전화번호) 검색
      - 쿼리가 인덱스 구조 내 칼럼만 참조한다면, DB는 인덱스만 읽어 쿼리 결과 생성

        ```SQL
        CREATE INDEX BugCovering ON Bugs
          (status, bug_id, date_reported, reported_by, summary);

        SELECT status, bug_id, date_reported, summary
        FROM Bugs WHERE status = 'OPEN';
        ```

  - 테스트(Test)
    - 작업 결과가 올바른지 확인하는 중요한 작업
    - 상사에게 어필과 작업 정당화가 가능
      - 인덱스 추가로 쿼리 성능을 42% 향상 시켰습니다.
  - 최적화(Optimize)
    - 인덱스는 사용이 잦으니 캐시메모리에 보관해 디스크 보관 비교 수십배 성능 향상 가능
    - DB크기와 가용 시스템 메모리 양 보고 캐시 메모리 설정
    > SQL Server 한번 확인해보자
  - 재구성(Rebuild)
    - 시간이 지나며 데이터 축적정도가 변하니, 주기적으로 인덱스 재정비 필요
    - 테이블 변경, 데이터 양, 예상 향상도를 고려해 재정비 결정
    - 인덱스 최대 활용법은 DB마다 다르기에 연구 필요
      | 데이터베이스 제품 | 인덱스 정비 명령 |
      | ---- | ---- |
      | IBM DB2 | REBUILD INDEX |
      | Microsoft SQL | Server ALTER INDEX … REORGANIZE,
      | | ALTER INDEX … REBUILD, |
      | |또는 DBCC DBREINDEX |
      | MySQL | ANALYZE TABLE 또는 OPTIMIZE TABLE |
      | Oracle | ALTER INDEX … REBUILD |
      | PostgreSQL | VACUUM 또는 ANALYZE |
      | SQLite | VACUUM |

  > 데이터를 알고, 쿼리를 알고, 인덱스를 MENTOR하라