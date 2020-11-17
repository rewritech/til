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

---

### 형식

- 목표
- 안티패턴
- 안티패턴 인식 방법
- 안티패턴 사용이 합당한 경우
- 해법