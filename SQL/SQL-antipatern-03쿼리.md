# SQL Antipatterns

## 쿼리 안티패턴

### 모르는 것에 대한 두려움(NULL)

- 목표: 누락된 값을 구분하기
  - NULL을 포함하는 칼럼에 대한 쿼리를 작성
- 안티패턴: NULL을 일반 값처럼 사용
  - 표준SQL과 대부분 DB제품에서 NULL은 특별한 값 취급
    - 단, Oracle과 Sybase에서는 길이 0인 문자열과 동일
      - 문자 이외의 데이터 타입은 다른 DB와 동일
  - 수식에서 NULL 사용
    - NULL과 숫자 연산하면 NULL 리턴
      - NULL + 10 = NULL
    - NULL과 문자 연결하면 NULL 리턴
      - '이름: ' + NULL = NULL
    - NULL과 불리언 판단하면 NULL 리턴
      - false AND NULL = NULL
  - NULL을 가질 수 있는 칼럼 검색
    - NULL과는 어떤 비교든 결과는 NULL
    - 아래는 NULL 리턴이 예상되나 NULL 리턴 없음

    ```SQL
    SELECT * FROM Bugs WHERE NOT (assigned_to = 123);
    -- IS NOT NULL
    ```

  - 쿼리 파라미터로 NULL 사용

    ```SQL
    SELECT * FROM Bugs WHERE assigned_to = ?; -- IS NULL
    ```

  - 문제 회피하기
    - NOT NULL 제약조건 설정후 NULL 대신 특정값 입력
    - NULL 이외 특정값은 SUM(), AVG() 같은 계산에 포함
      - NULL로 제외 되었을 값이 포함
      - 별도 처리 및 문서화 필요
    - 부모가 미정인 FK를 위해 
      - 별도의 특별 부모 데이터가 필요한 역설적 상황 발생
    - NOT NULL 제약은 NULL의 존재의미가 없는 경우에만 사용되어야 함

- 안티패턴 인식 방법
  - A칼럼에 아무 값도 없는 행을 어떻게 찾지?
  - DB에 데이터가 있는데 애플리케이션에서는 안 나와
    - NULL 연산 가능성 존재
  - 보고서 내용에 몇몇 데이터가 안 나와
  - 알 수 없음을 나타내는 문자 데이터 변경이 필요해

- 안티패턴 사용이 합당한 경우
  - NULL사용은 정상이지만, NULL을 일반값처럼 사용하면 안티 패턴
  - EXPORT, IMPORT
  - 애플리케이션에서 사용자 입력 중 NULL의미로 빈문자 받는 경우(변환 필요)
  - 알 수 없음을 다양하게 표현하는 경우

- 해법: 유일한 값으로 NULL을 사용하라
  - 스칼라 수식에서의 NULL
    |수식 |기대값 | 실제값| 이유 |
    |-|-|-|-|
    |NULL = 0 |TRUE | NULL |NULL은 0이 아니다.|
    |NULL = 12345 |FALSE | NULL| 지정된 값이 모르는 값과 같은지 알 수 없다.
    |NULL <> 12345 |TRUE | NULL| 또한 다른지도 알 수 없다.|
    |NULL + 12345 |12345 | NULL| NULL은 0이 아니다.|
    |NULL |'string'|'string' | NULL |NULL은 빈 문자열이 아니다.
    |NULL = NULL |TRUE | NULL | 모르는 값과 모르는 값이 같은지 알 수 없다
    |NULL <> NULL |FALSE | NULL | 또한 다른지도 알 수 없다.|

  - 불리언 수식에서의 NULL
    - NULL은 true도 false도 아님
    |수식 | 기대값 | 실제값 | 이유|
    |NULL  AND TRUE | FALSE | NULL | NULL은 false가아니다.|
    |NULL  AND FALSE | FALSE | FALSE | 어떤진리값이든 FALSE와 AND를하면 false다|
    |NULL  OR FALSE | FALSE | NULL | NULL은 false가아니다.|
    |NULL  OR TRUE | TRUE | TRUE | 어떤진리값이든 TRUE와 OR를하면 true다|
    |NOT (NULL) | TRUE | NULL | NULL은 false가아니다.|

  - NULL 검색하기
    - IS NULL
    - IS NOT NULL

    ```SQL
    -- DB제품에 따라 IS DISTINCT 제공
    SELECT * FROM Bugs WHERE assigned_to IS NULL OR assigned_to <> 1;
    SELECT * FROM Bugs WHERE assigned_to IS DISTINCT FROM 1; -- 위와 동일
    ```

  - 칼럼을 NOT NULL로 선언하기
    - NULL이 의미 없거나 금지인 경우에 사용

  - 동적 디폴트
    - COALESCE()사용해 NULL이 아닌 값 리턴 이용

    ```SQL
    SELECT
      first_name
      || COALESCE(' ' || middle_initial || ' ', ' ')
      || last_name AS full_name
      FROM Accounts;
    ```

> 어떤 데이터 타입에 대해서든 누락된 값을 뜻하는 데는 NULL을 사용하라.

---

### 애매한 그룹

- 목표: 그룹당 최댓값을 가진 행 얻기
  - 그룹의 최댓값 및 대강 값을 찾은 행의 다른 속성도 포함하는 쿼리 작성

- 안티패턴: 그룹되지 않은 칼럼 참조
  - 단일 값 규칙(아래 두 쿼리의 그룹은 다름)

  ```sql
  SELECT product_id, MAX(date_reported) AS latest
  FROM Bugs JOIN BugsProducts USING (bug_id)
  GROUP BY product_id;

  SELECT product_id, MAX(date_reported) AS latest, bug_id
  FROM Bugs JOIN BugsProducts USING (bug_id)
  GROUP BY product_id;
  ```

  - 내 뜻대로 동작하는 쿼리
    - 특정 칼럼 최댓값을 취득 쿼리가 다른 칼럼 값도 최댓값이라는 착각
      - 두 데이터의 date칼럼이 동일한 최댓값일 경우, 최댓값 id는?
      - MAX()와 MIN()을 동시에 사용할 경우 id는?
      - AVG(), SUM() 등 집계 함수 리턴 값과 매치되는 행이 없는 경우 id는?

- 안티패턴 인식 방법
  - 단일 값 규칙 위반 쿼리에 대해 DB에러 발생

- 안티패턴 사용이 합당한 경우
  - MtSQL과 SQLite 경우, PK-FK관계에서 제한적 사용 가능
  - 허나, 개인 판단으로는 사용이 합당한 경우는 없다.

- 해법: 칼럼을 모호하게 사용하지 않기
  - 함수 종속인 칼럼만 쿼리하기
    - 모호한 칼럼 SELECT에서 제거

  - 상호 연관된 서브쿼리 사용하기
    - 서브쿼리 및 조인으로 검색(성능 안 좋음)
    ```SQL
    SELECT bp1.product_id, b1.date_reported AS latest, b1.bug_id
    FROM Bugs b1
    JOIN BugsProducts bp1 USING (bug_id)
    WHERE NOT EXISTS ( -- EXISTS공부 필요
      SELECT * FROM Bugs b2
      JOIN BugsProducts bp2 USING (bug_id)
      WHERE
        bp1.product_id = bp2.product_id
        AND b1.date_reported < b2.date_reported
    );
    ```

  - 유도 테이블 사용하기(성능 안 좋음)
    - 유도 테이블(derived table) 사용해 조인
    - 확장적응성이 좋은 대안
    ```sql
    SELECT m.product_id, m.latest, b1.bug_id
    FROM Bugs b1 JOIN BugsProducts bp1 USING (bug_id)
    JOIN (
      SELECT bp2.product_id, MAX(b2.date_reported) AS latest -- MAX()가 동일한 데이터가 있으면?
      FROM Bugs b2 JOIN BugsProducts bp2 USING (bug_id)
      GROUP BY bp2.product_id
    ) m
    ON (bp1.product_id = m.product_id AND b1.date_reported = m.latest);
    ```

  - 조인 사용하기(이해 난이도 높음)
    - 확장적응성이 뛰어남
    ```SQL
    SELECT bp1.product_id, b1.date_reported AS latest, b1.bug_id
    FROM Bugs AS b1
    JOIN BugsProduct AS bp1
      ON (b1.bug_id = bp1.bug_id)
    LEFT OUTER JOIN (
      Bugs AS b2
      JOIN BugsProducts AS bp2
        ON (b2.bug_id = bp2.bug_id)
    )
    ON (
      bp1.product_id = bp2.product_id
      AND (
        b1.date_reported < b2.date_reported
        OR b1.date_reported = b2.date_reported AND b1.bug_id < b2.bug_id
      )
    )
    WHERE b2.bug_id IS NULL;
    ```

  - 다른 칼럼에 집계 함수 사용하기
    - bug_id가 크면 보고순서가 나중일 경우
    ```sql
    SELECT product_id, MAX(date_reported) AS latest, MAX(bug_id) AS latest_bug_id
    FROM Bugs JOIN BugsProducts USING (bug_id)
    GROUP BY product_id;
    ```

  - 각 그룹에 대해 모든 값을 연결하기
    - MySQL, SQLite에서 GROUP_CONCAT()함수 제공
      - 쉼표로 구분된 문자열 만듬
      - SQL표준 아님
      - 어떤 bug_id가 최신인지 알 수 없음
        |product_id| latest| bug_id_list|
        |-|-|-|-|
        |1| 2010-06-01| 1234, 2248|
        |2| 2010-02-16| 3456, 4077, 5150|

> 모호한 쿼리 결과를 피하기 위해 단일 값 규칙을 따라라.

---

### 임의의 선택

- 목표: 샘플 행 가져오기
  - 애플리케이션에 모든 데이터 읽어 샘플 선정보다 DB샘플 검색이 유리

- 안티패턴: 데이터를 임의로 정렬하기
  - 임의로 정렬한 후 첫 행 고르기
    ```sql
    SELECT * FROM Bugs ORDER BY RAND() LIMIT 1;
    ```
    - 인덱스 사용 불가, 데이터 많은 경우 정렬이 매우 느려짐
    - 첫 행 뒤에 수많은 행은 의미가 없으나, 임의의 값 선택위한 정렬로 성능 저하

- 안티패턴 인식 방법
  - SQL에서 임의의 행 리턴은 정말 느려
  - 임의의 행 선택위해 모든 행을 가져와야 하는데, 애플리케이션 사용 메모이 어떻게 늘리지?
  - 어떤 항목이 자주 나오는 거 같은데? 랜덤 같지 않아

- 안티패턴 사용이 합당한 경우
  - 데이터 집합이 적을 경우
    - 예: 미국 50개 주 중 임의의 하나 고르기
    - 데이터도 적고, 늘어날 가능성도 적음

- 해법: 테이블 전체 정렬 피하기
  - 1과 max 사이에서 임의의 키 값 고르기
    - PK값이 1부터 빈 값 없이 연속으로 존재할 경우
    ```sql
    SELECT * FROM Bugs
    WHERE bug_id = (
      SELECT CEIL(RAND() * MAX(bug_id)) FROM Bugs
      -- SQL Server: CEILING(RAND() * MAX(bug_id))
      -- CEIL: Return the smallest integer value
    );
    ```

  - 다음으로 큰 키 값 고르기
    - 1과 최댓값 사이에 빈틈이 있는 경우 사용 가능
      - 단점: 빈 공간 바로 위의 숫자가 비교적 자주 선택됨
      - 빈틈이 드물며, 동일한 빈도 선택이 덜 중요시 좋음
      ```sql
      SELECT b1.*
      FROM Bugs AS b1
      WHERE b1.bug_id >= (
        SELECT CEIL(RAND() * (SELECT MAX(bug_id) FROM Bugs)
      )
      ORDER BY b1.bug_id
      LIMIT 1;
      ```

  - 모든 키 값의 목록을 구한 다음, 임의로 하나 고르기
    - 애플리케이션 코드로 DB 모든 키 값 읽고, 랜덤으로 하나 선택
    - 테이블 정렬을 히파고, 각 키 값을 거의 같은 확률로 선택 가능
    - 단점
      - 모든 키 값을 가져오니 크기가 큼(메모리 자원을 넘을 수 있음)
      - 쿼리를 두 번 해야 함(PK목록 생성, 임의의 행 선택)
      - 쿼리가 복잡하고 비용이 크다면 부적합
    - 추천
      - 결과 집합 크기가 적당하며, 임의의 행 선택 쿼리가 단순
      - 불연속적인 목록에서 값 선택할 경우

  - 오프셋을 이용해 임의로 고르기
    1. DB 행 개수를 센다 COUNT(*)
    1. 0과 COUNT(*) 사이 임의의 수 고름
    1. 쿼리 오프셋으로 사용
    ```SQL
    SELECT * FROM Bugs LIMIT 1 OFFSET :offset
    ```
    - LIMIT: MySQL, PostgreSQL, SQLite
    - ROW_NUMBER(): Oracle, Microsoft SQL Server, IBM DB2
    - 키 값이 비연속적이며, 각 행 선택 확률을 같게 하는 경우 사용

  - 벤더 종속적인 방법
    - Microsoft SQL Server 2005: TABLESAMPLE
      ```SQL
      SELECT * FROM Bugs TABLESAMPLE (1 ROWS);
      ```
    - Oracle: SAMPLE
      - 테이블에서 1% 행만 가져온 다음, 임의의 순서 정렬 후 한 행 리턴
      ```SQL
      SELECT * FROM (
        SELECT *
        FROM Bugs SAMPLE (1)
        ORDER BY dbms_random.value
      ) WHERE ROWNUM = 1;
      ```
    - DB제품 기능은 보통 제한이 있으므로 사용전 문서 확인 필수

> 어떤 쿼리는 최적화할 수 없다. 이 경우에는 다른 접근방법을 취해야 한다.

---

### 가난한 자의 검색 엔진

- 목표: 전체 텍스트 검색

- 안티패턴: 패턴 매칭 사용
  - LIKE 연산자 사용
  - 정규표현식 사용(REGEXP)
  - 위의 패턴 매칭은 성능이 나쁨
    - 인덱스 사용 불가로 모든 행 스캔 필요
    - 문자열 패턴 매칭 자체가 비용이 큼
    - 원치 않는 결과 매칭
      - 예) %one% -> money, phone ...

- 안티패턴 인식 방법
  - LIKE 사용시 두 와일드카드 사이에 변수를 어떻게 넣지?
  - 주어진 단어 및 변형의 포함을 확인하는 정규 표현식 어떻게 작성하지?
  - 문서가 많이 추가되니 검색 기능이 느려

- 안티패턴 사용이 합당한 경우
  - 사용 빈도가 낮은 경우

- 해법: 직업에 맞는 올바른 도구 사용하기
  - 벤더 확장기능 사용(상세 내용은 문서 확인 필요)
    - MySQL에서의 전체 텍스트 검색
      ```sql
      ALTER TABLE Bugs ADD FULLTEXT INDEX bugfts (summary, description);
      SELECT * FROM Bugs WHERE MATCH(summary, description) AGAINST ('crash');
      SELECT * FROM Bugs WHERE MATCH(summary, description) AGAINST ('+crash -save' IN BOOLEAN MODE);
      ```

    - Oracle에서의 텍스트 인덱싱
      - CONTEXT
        - 한 텍스트 칼럼에 이 인덱스 설정
        - 인덱스를 주기적으로 재구성(rebuild)해줘야 함
        ```sql
        CREATE INDEX BugsText ON Bugs(summary) INDEXTYPE IS CTSSYS.CONTEXT;
        SELECT * FROM Bugs WHERE CONTAINS(summary, 'crash') > 0;
        ```

      - CTXCAT
        - 동일 테이블 다른 칼럼 함께 사용 특화
        - 테이블 데이터가 변경에도 일관적 상태 유지하는 인덱스
        ```sql
        CTX_DDL.CREATE_INDEX_SET('BugsCatalogSet');
        CTX_DDL.ADD_INDEX('BugsCatalogSet', 'status');
        CTX_DDL.ADD_INDEX('BugsCatalogSet', 'priority');

        CREATE INDEX BugsCatalog ON Bugs(summary)
          INDEXTYPE IS CTSSYS.CTXCAT
          PARAMETERS('BugsCatalogSet');

        SELECT * FROM Bugs WHERE CATSEARCH(summary, '(crash save)', 'status = "NEW"') > 0;
        ```

      - CTXXPATH
        - XML 문서 검색 특화
        ```sql
        CREATE INDEX BugTestXml ON Bugs(testoutput) INDEXTYPE IS CTSSYS.CTXXPATH;
        SELECT * FROM Bugs
        WHERE testoutput.existsNode('/testsuite/test[@status="fail"]') > 0;
        ```

      - CTXRULE
        - 문서를 분석해 분류하는 규칙을 설계할 수 있음
        - 이 예제는 이책의 범위를 넘음

    - MS MQL에서의 전체 텍스트 검색
      - 먼저 전체 텍스트 기능을 활성화하고, 데이터베이스에 카탈로그를 정의
        ```
        EXEC sp_fulltext_database 'enable'
        EXEC sp_fulltext_catalog 'BugsCatalog', 'create'
        ```
      - Bugs 테이블 전체 텍스트 인덱스 정의, 인덱스에 칼럼 추가, 인덱스 활성화
        ```
        EXEC sp_fulltext_table 'Bugs', 'create', 'BugsCatalog', 'bug_id'
        EXEC sp_fulltext_column 'Bugs', 'summary', 'add', '2057'
        EXEC sp_fulltext_column 'Bugs', 'description', 'add', '2057'
        EXEC sp_fulltext_table 'Bugs', 'activate'
        ```
      - 전체 텍스트 인덱스 자동 동기화 기능 활성화
      - 인덱스 칼럼 데이터 변경 내용이 인덱스에 전달
      - 인덱스 띄울 프로세스 시작
        ```
        EXEC sp_fulltext_table 'Bugs', 'start_change_tracking'
        EXEC sp_fulltext_table 'Bugs', 'start_background_updateindex'
        EXEC sp_fulltext_table 'Bugs', 'start_full'
        ```
      - CONTAINS() 연산자 사용
        ```sql
        SELECT * FROM Bugs WHERE CONTAINS(summary, '"crash"');
        ```

    - PostgreSQL에서의 전체 텍스트 검색
      - TSVECTOR 데이터 타입 칼럼 생성 후
      - TSVECTOR 칼럼 동가화용 트리거 설정
      - GIN 인덱스 생성
      - @@ 연산자로 검색
        ```sql
        CREATE TABLE Bugs (
          bug_id SERIAL PRIMARY KEY,
          summary VARCHAR(80),
          description TEXT,
          ts_bugtext TSVECTOR
          ...
        );

        CREATE TRIGGER ts_bugtext BEFORE INSERT OR UPDATE ON Bugs
        FOR EACH ROW EXECUTE PROCEDURE
        tsvector_update_trigger(ts_bugtext, 'pg_catalog.english', summary, description);

        CREATE INDEX bugs_ts ON Bugs USING GIN(ts_bugtext);

        SELECT * FROM Bugs WHERE ts_bugtext @@ to_tsquery('crash');
        ```

    - SQLite
      - 생략

  - 서드파티 검색 엔진
    - Sphinx Search
      - 오픈소스
      - MySQL, PostgreSQL와 잘 통합됨(다른 DB통합성 확인 필요)
      - 인덱싱과 검색이 빠름
      - 분산 쿼리 지원
      - 업데이트가 드물고, 검색이 잦은 애플리케이션에 적합
      - 실제 사용시 다시 공부하자
    - Apache Lucene
      - Java 애플리케이션용 검색엔진
      - DB 행 수정, 삽입, 삭제에 따른 Lucene 인덱스 변경 필요

  - **직접 만들기**<트리거와 프로시져 공부후 다시 보자>
    - 전치 인덱스(inverted index)
      - 검색할 모든 단어의 목록
      - 다대다 관계에서 인덱스는 단어들과 각 단어를 포함한 텍스트 항목을 연관 시킴
    - 테이블 정의
      - Keywords 테이블: 사용자가 검색할 키워드 목록
      - BugsKeywords 테이블: 교차 테이블
      - Bug의 설명 텍스트의 모든 매치 키워드 BugsKeywords에 추가
        - 최초 등록 비용이 크나, 이후 검색은 빨라짐
    - 저장 프로시저 작성
      - 단어 검색 이력이 있다면, 해당 키워드의 문서 목록이 BugsKeywords에 존재하므로 쿼리가 빠름
      - 검색 이력이 없는 키워드는 어려운 방법으로 텍스트 항목의 집합 검색 필요
      ```sql
      CREATE TABLE Keywords (
        keyword_id SERIAL PRIMARY KEY,
        keyword VARCHAR(40) NOT NULL,
        UNIQUE KEY (keyword)
      );

      CREATE TABLE BugsKeywords (
        keyword_id BIGINT UNSIGNED NOT NULL,
        bug_id BIGINT UNSIGNED NOT NULL,
        PRIMARY KEY (keyword_id, bug_id),
        FOREIGN KEY (keyword_id) REFERENCES Keywords(keyword_id),
        FOREIGN KEY (bug_id) REFERENCES Bugs(bug_id)
      );
      ```

    - 프로시저와 트리거 공부 필요


> 모든 문제를 SQL로 풀어야 하는 것은 아니다

---

### 스파게티 쿼리

- 목표: SQL 쿼리 줄이기
- 안티패턴: 복잡한 문제를 한 번에 풀기
  - 의도하지 않은 제품
    - 카테시안 곱 발생: 쿼리의 두 테이블에 관계 조건 없을 시 발생
    - 한 쿼리로 여러 작업을 처리하려 하면 카테시안 곱 발생확률 높음

  - 그래도 충분하지 않다면
    - 스파게티 쿼리는 작성, 수정, 디버깅이 어려우며, 틀린 결과 생성 가능
    - 조인, 서브쿼리, 연산이 많은 만큼 SQL 실행 비용이 지수적으로 증가
    - 여러개의 단순한 쿼리 사용이 경제적

- 안티패턴 인식 방법
  - 합계와 개수가 왜 이렇게 크지?
  - 괴물 같은 SQL야
  - 쿼리에 DISTINCT 추가해 볼까?
- 안티패턴 사용이 합당한 경우
- 해법: 분할해서 정복하기
  - 한 번에 하나씩
  - UION 연산
  - 상사의 문제 해결하기
  - SQL을 이용한 SQL 자동 생성

> 하나의 SQL로 복잡한 문제를 풀 수 있을 것처럼 보이더라도,  
  확실치 못한 방법의 유혹에 넘어가면 안 된다.

---

### 형식

- 목표
- 안티패턴
- 안티패턴 인식 방법
- 안티패턴 사용이 합당한 경우
- 해법
