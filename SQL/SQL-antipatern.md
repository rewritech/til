# 안티패턴

## 개요

---

### 안티패턴: 널리 사용되지만 실제로는 좋지 않은 패턴

- 어떤 문제를 해결하려는 의도로 사용하지만 실제로는 더 많은 문제를 유발하는 패턴

### 구성

- 논리적 데이터베이스 설계 안티패턴: 저장 정보, DB관계 정리
- 물리적 데이터베이스 설계 안티패턴: 효율적 데이터 관리로 index, DDL 정리
- 쿼리 안티패턴: 데이터 입력조회 DML
- 애플리케이션 개발 안티패턴: java, python 등 다른 언어 애플리케이션 내 사용되는 SQL

### 안티패턴의 구조

- 목표
  - 해결하려는 작업이자만 안티패턴 사용으로 더 많은 문제 발생
- 안티패턴
  - 흔한 해법의 속성과 이를 안티패턴으로 만드는 예상외 결과
- 안티패턴 인식 방법
  - 안티패턴 단서 찾기
- 안티패턴 사용이 합당한 경우
  - 예외가 있기 마련
- 해법
  - 안티패턴을 막으며 원래 목표 달성 해법

---

## 논리적 데이터베이스 설계 안티패턴

---

### 무단횡단

> 다대다 교차테이블 피하기 위해 쉼표 구분 데이터를 사용하는 것

- 목표
  - 담당자와 제품의 다대일 관계를 일대다 관계도 지원하기
    - 해법(상현, 은태): 중간 테이블 생성 (중간에 FK 삭제 가능?) OK
    - 해법(형주): FK없는 다대다 관계 생성
- 안티패턴
  - 쉼표로 구분된 목록에 저장
    - 특정 담당자의 제품을 찾으려면 REGEXP 패턴매칭이 필요
      - 잘못된 결과 리턴 가능
      - 인덱스 활용 불가
      - 패턴매칭은 DB 제품 마다 다름 (벤더 중립적이지 못함)
    - 주어진 제품에 대한 계정 정보 조회 불편
      - 인덱스 활용 조인 불가
    - 집계 쿼리 사용 불가 count(), sum(), avg() 등
      - 대체 로직 작성이 필요하나, 부정확하며 난해함
    - 특정 제품에 대한 계정 갱신 불편
      - 새 아이디 추가는 가능하나 정렬된 상태가 아님
      - 한 아이디 삭제 위해 큰 비용
        - 목록을 일기 -> 대상 아이디만 제거 -> 나머지 아이디 붙여서 업데이트
    - 아이디 유효성 검증 불가
      - 숫자인 아이디 경우 'banana' 같은 문자도 입력 가능
    - 구분자 문자를 포함한 데이터 문제
    - 데이터 길이 제한 varchar(30), varchar(60) ...
- 안티패턴 인식 방법
  - 이 목록이 지원하는 최대 항목 수는?
    - varchar 최대 길이 확인 위한 질문
  - SQL에서 단어 경계를 어떻게 알지?
    - 문자열 일부 검색 위한 질문
  - 이 목록에서 절대 안 나올 문자는?
    - 구분자 사용위한 질문
- 안티패턴 사용이 합당한 경우
  - 구분자 사용은 반정규화의 일종
    - 정규화가 먼저, 반정규화는 보수적으로 접근
  - 애플리케이션에서 구분자 형식의 데이터가 필요한 경우
  - 목록 내 개별 항목에 접근 필요 없는 경우
  - 다른 DB 구분자 형식 항목을 그대로 사용하며, 분리 불필요 경우
- 해법: 교차 테이블 생성
  - Contacts 테이블로 Products와 Accounts사이 다대다 관계 구현
    - FK(product_id), FK(account_id)
    - FK로 두 테이블 참조: 교차테이블
      - 영어: join table, many-to-many table, mapping table
  - Contacts 테이블 조인으로 계정 및 제품 조회 가능
  - Group By로 집계 쿼리 가능
  - 특정 제품에 대한 계정 갱신
    - Contacts 테이블 행 추가 및 삭제
  - 제품 아이디 유효성 검증
    - FK참조로 존재하는 데이터만 입력 가능
    - 데이터 타입으로 제한 가능
  - 구분자 문자 선택 필요 없음
  - 목록길이 제한이 필요하다면 애플리케이션에서 항목 수로 제한
  - 교차테이블의 다른 장점
    - 인덱스 활용으로 성능 향상
      - FK선언 칼럼: 내부적 인덱스 생성(각 DB문서 확인 필요)
    - 칼럼 추가로 다른 정보 저장 가능

---

### 순진한 트리

- 목표: 계층구조 저장 및 조회하기
  - 트리 데이터 구조에서 각 항목은 노드라 부름
    - 노드: 여라 자식과 한 부모를 지님
    - Root(뿌리): 부모가 없는 최상위 노드
    - Leaf(종말노드): 가장 아래 자식이 없는 노드
    - non-leaf(노드): 중간에 있는 노드
  - 실제 사례
    - 조직도: 직원과 관리자 관계
    - 글타래: 답글과 답글의 답글
    - 부품도: 부품 속 부품

- 안티패턴: 항상 부모에 의존하기(인접목록)
  - parent_id 칼럼으로 같은 테이블 내 다른 글 참조
    - 인접 목록(Adjacency)라고 부름
    - 계층 데이터에 흔한 설계

  - 인접 목록에서 트리 조회하기
    - 자식 조회는 가능하나, 자식 아래 후손은 조회 불가
    - 집계 함수로 총량 등 계산 불가
    - 모든 행을 가져와 애플리케이션으로 계층구조 생성 필요

  - 인접 목록에서 트리 유지하기
    - 노드 추가 쉬움 parent_id 지정
    - 노드 혹은 서브트리 이동은 쉬움 parent_id 변경
    - **노드 삭제는 어려움**
      - 여러번 쿼리 날려 모든 자손 찾음
      - 가장 아래 자손부터 차례로 삭제
      - 혹은 ON DELETE CASCADE 옵션으로 자손 일괄 삭제
      - 삭제 노드의 자식을 부모에 붙이기 까다로움
        - 자식**들**의 parent_id 변경후, 삭제

- 안티패턴 인식 방법
  - 트리에서 얼마나 깊은 단계를 지원해야 하지?
    - 재귀적 쿼리 미사용 증거로, 제한된 깊이 질문
  - 트리 데이터 구조 관리 코드 수정이 겁나
  - 트리 내 고아 노드 정리 스크립트를 주기적으로 돌려야해
    - 자식이 있는 노드 삭제로 연결이 끊긴 고아 노드
    - 데이터 구조 유지 위한 트리거와 FK 제약조건 뒤에 소개

- 안티패턴 사용이 합당한 경우
  - 부모 자식 노드로 충분한 경우(새 노드 추가도 쉬움)
    - **한 단계 깊이로 충분하다면, 복잡하게 만들 필요 없다**
    - 인접 목록 형식 계층구조 지원 DBMS존재
    - SQL-99 표준 재귀적 쿼리 문법 정의
      - WITH 키워드에 CTE(Common Table Expression) 사용

      ```sql
      WITH CommentTree
        (comment_id, bug_id, parent_id, author, comment, depth)
      AS (
        SELECT *, 0 AS depth FROM Comments
        WHERE parent_id IS NULL
        UNION ALL
        SELECT c.*, ct.depth+1 AS depth FROM CommentTree ct
        JOIN Comments c ON (ct.comment_id = c.parent_id)
      )
      SELECT * FROM CommentTree WHERE bug_id = 1234;
      ```

      - SQL Server 2005, Oracle 11g, IBM DB2, PostgreSQL 8.4 CTE사용 재귀적 쿼리 지원
      - Oracle 9i, 10g는 START WITH와 CONNECT BY PRIOR 전용문법으로 재귀적 쿼리 구현 가능

      ```SQL
      SELECT * FROM Comments
      START WITH Comment_id = 9876
      CONNECT BY PRIOR parent_id = comment_id;
      ```

- 해법: 대안 트리 모델 사용
  - 대안 3개: 경로 열거(Path Enumeration), 중첩 집합(Nested Sets), 클로저 테이블(Closure Table)
  - 경로 열거(Path Enumeration)
    - 조상 경로를 각 노드 속성으로 저장
    - parent_id 대신 path(VARCHAR) 칼럼 정의해 트리 Root부터 현재 행까지 저장(/구분자 사용OK)
    - LIKE로 조상 및 후손 찾기

      ```SQL
      -- 조상 찾기
      SELECT *
      FROM Comments AS c
      WHERE '1/4/7/10' LIKE c.path || '%';  -- 변수와 칼럼 위치 변경이 새롭다
      -- 매치: 1/4/7/%, 1/4/%, 1/%

      -- 후손 찾기
      SELECT *
      FROM Comments AS c
      WHERE c.path LIKE '1/4/' LIKE c.path || '%';
      -- 매치: 1/4/5/, 1/4/6/, 1/4/6/7/
      ```

    - GROUP BY로 집계하기

      ```sql
      SELECT COUNT(*)
      FROM Comments AS c
      WHERE c.path LIKE '1/4/' LIKE c.path || '%';
      GROUP BY c.author;
      ```

    - 노드 추가
      - 부모 경로 복사해 새 노드 아이디 덧붙임
      - PK자동 생성되는 경우, 행 추가 후 경로 갱신
    - 단점
      - 올바른 경로 형성 및 실제 노드 대응을 강제 못함
      - 경로 문자열 유지는 애플리케이션 코드에 종속되며, 검증 비용이 큼
      - 문자열 길이 만큼 트리 깊이 제한됨

  - 중첩 집합(Nested Sets)
    - 자손 집합에 대한 정보 저장
      - nsleft: 모든 자손의 nsleft 보다 작아야 함
      - nsright: 모든 자손의 nsright 보다 커야 함  
      ![01-02-중첩집합](./img/01-02-중첩집합.PNG)

      ```sql
      -- 자손: 현재 노드#4의 nsleft와 nsright 사이의 nsleft 검색
      SELECT c2.*
      FROM Comments AS c1
      JOIN Comments AS c2
        ON c2.nsleft BETWEEN c1.nsleft AND c1.nsright
      WHERE c1.comment_id = 4;

      -- 조상: 현재 노드#6의 nsleft와 nsright 사이의 nsleft 검색
      SELECT c2.*
      FROM Comments AS c1
      JOIN Comments AS c2
        ON c1.nsleft BETWEEN c2.nsleft AND c2.nsright
      WHERE c1.comment_id = 6;
      ```

      - 자식 노드 삭제시 그 자손은 자식 노드가 됨(값 간격 문제 없음)
    - 단점
      - 부모 자식 찾기 어려움  
      ![01-02-중첩집합-부모자식SQL](./img/01-02-중첩집합-부모자식SQL.PNG)
      - 데이터 추가가 어려움
        - 새 노드의 왼쪽 값보다 큰 모든 노드의 왼쪽, 오른쪽 값 재계산 필요  
        ![01-02-중첩집합-NS재계산SQL](./img/01-02-중첩집합-NS재계산SQL.PNG)
    - 서브트리 조회에 적절하며, 잦은 노드추가에는 부적절

  - 클로저 테이블(Closure Table)
    - 트리 모든 경로를 별도 테이블에 저장
      - ancestor, descendant: Comments테이블 id 참조(자기참조도 저장)  
      ![01-02-클로져테이블](./img/01-02-클로져테이블.PNG)
      - JOIN과 ancestor, descendant칼럼 이용해 조상/자손 검색
      - 노드#5 새로운 자식 추가
        - 자기 참조 행 추가
        - 노드#5가 자식인 모든 노드 복사해 descendent에 새 노드 아이디 입력
      - 노드#7 삭제
        - 노드#7가 descendent인 모든 경로 정보 삭제
        - 실제 노드가 삭제 되는 것은 아님에 유의(제품일람표, 조직도에 유용)
      - 노드 이동
        - 모든 조상 노드와의 관계 삭제
        - 자신과 후손 관계는 유지  
        ![01-02-클로져테이블-추가용삭제SQL](./img/01-02-클로져테이블-추가용삭제SQL.PNG)
        - 새 위치의 조상들에 자손으로서 행 추가
          - CROSS JOIN으로 모든 노드 대응  
          ![01-02-클로져테이블-추가용CrossJoinSQL](./img/01-02-클로져테이블-추가용CrossJoinSQL.PNG)
      - path_length 속성 추가로 깊이 검색 개선
        - **path_length는 어떻게 추가하나?**
    - 단점: 계산을 줄이는 대신 많은 저장공간 필요
  
  - 대안 비교  
    ![01-02-계층적_데이터모델_비교](./img/01-02-계층적_데이터모델_비교.PNG)

---

### 아이디가 필요해

- 목표: PK 관례 확립
  - PK는  중요하고 필요한 테이블의 일부
  - 모든 행이 유일함을 보장
    - 각 행 접근 논리적 메커니즘
    - 중복 행 저장 방지
    - FK 참조
    - PK가 없는 것은 제목 없이 음악을 저장하는 것과 같음
  - PK 칼럼 선정이 까다로움
    - 보통 데이터는 중복 가능성 존재
    - PK용 칼럼 지정도 방법
      - 다른 칼럼 중복 허용하며 특정 행에 유일한 접근 가능
      - 명칭: 가상키(pseudokey), 대체키(surrogate key)
      - 가상키는 유용하나, PK 선언에 유일한 방법은 아님

- 안티패턴: 만능키
  - 모든 테이블이 갖는 PK 칼럼 관례
    - PK 칼럼 이름은 id
    - 데이터 타입은 정수
    - 자동 생성
    - 모든 테이블 id칼럼 추가는 그 사용을 이상하게 만드는 몇 가지 효과 초래
  - 중복 키 생성
    - 다른 칼럼이 PK로 사용돌 수 있는 상황에서도 id PK키 생성
  - 중복 행 허용
    - 두 칼럼 이상의 조합인 복합키가 유일성을 나타내는 상황
      - id PK를 사용하면 조합 칼럼이 중복되어 저장 가능
      - 복합 칼럼에 UNIQUE 제약을 건다면 id PK 불필요
  - 모호한 키의 의미
    - id는 너무 일반적 이름으로 의미가 불명확
      - office_id, account_id와 같이 엔터티 타입의 실마리 제공 필요
    - JOIN시 문제 발생
  - USING 사용
    - 모든 PK이름이 id라면 USING문 사용 불가

    ```SQL
    SELECT * FROM Bugs AS b
      JOIN BugsProducts AS bp ON (b.bug_id = bp.bug_id);

    -- 위와 동일
    SELECT * FROM Bugs AS JOIN USING (bug_id);

    -- 모든 PK가 id인 경우
    SELECT * FROM Bugs AS b
      JOIN BugsProducts AS bp ON (b.id = bp.bug_id);
    ```

  - 어려운 복합키
    - 복합PK가 필요하면 복합PK를 사용해야 한다
    - 참조FK 자신도 복합FK가 되어야 함

- 안티패턴 인식 방법
  - 테이블 PK칼럼명에 id가 지나치게 많은 경우
    - 의미 있는 이름 대신 id를 선호할 이유는 없다.
  - 이 테이블에서는 PK가 없어도 될 것 같다
    - 모든 테이블은 중복 해 방지 위해 PK 제약 필요
  - 다대다 연결에서 왜 중복이 있지?
    - FK칼럼 묶어 PK제약 혹은 최소 UNIQUE 제약 필요
  - 값 참조위해 매번 id로 조인하고 싶지 않아
    - 정규화에 대한 오해로 정규하는 가상키와 상관 없음

- 안티패턴 사용이 합당한 경우
  - 객체-관계 프레임워크에서 정수 id인 PK를 제공
    - 하지만 모든 테이블에 가상키가 필요치 않음
    - 모든 가상키가 id일 필요도 없음
  - 지나치게 긴 자연키 대체용으로 적절
    - 파일경로는 좋은 자연키로 가능하나, 인덱스 유지 비용이 높음
    - 옮긴이: 다수 칼럼 조합의 경우도 대체키 사용이 나음

- 해법: 상황에 맞추기
  - 있는 그대로 말하기
    - 예로 Bug 테이블 PK는 bug_id
      - FK가 아닌 한 동일 PK명 다른 테이블에서 금지
      - FK는 연결의 본질을 표현하는 이름 사용 가능
        - FOREIGN KEY (reported_by) REFERENCES Accounts(accoint_id)
      - 테이블 칼럼 이름 짓기 책: [Joe Celko's SQL Programming Style](https://www.amazon.co.jp/Programming-Kaufmann-Management-Systems-English-ebook/dp/B006L21AO6/ref=tmm_kin_swatch_0?_encoding=UTF8&qid=1603721497&sr=8-1)
  - 관례에서 벗어나기
    - 프레임워크 지원 id 재설정 방법 탐구(루비)
  - 자연키와 복합기 포용
    - 유일성과 Not Null이 보장되는 칼럼을 PK로 지정
      - 꼭 가상키를 사용할 필요는 없음
    - 복합키가 적절할 시에는 복합키를 사용
      - 복합PK 참조 FK 또한 복합키가 되어야 함

---

### 키가 없는 엔트리

- 목표: 데이터베이스 아키텍처 단순화
  - FK제약조건은 부모 테이블에 PK 또는 유일키 존재 필수
  - FK무시하라는 말들
    - 데이터 업데이트 시 제약조건과 충돌 가능
    - 참조 정합성 제약조건 지원불가인 융통성 있는 DB설계 사용
    - DB가 자동생성하는 FK의 인덱스로 성능에 영향을 받는다는 생각
    - FK 미지원 DB 사용

- 안티패턴: 제약조건 무시
  - 무결점 코드
    - 애플리케이션 코드로 참조 데이터 존재여부 확인 후 등록 및 삭제 실시
      - 등록하려는 데이터의 부모 데이터가 있는가
      - 삭제하려는 데이터의 자녀 데이터가 있는가
    - 참조 데이터 존재여부 확인부터 해당 테이블을 잠금
      - 동시성(concurrency)과 확장적응성(scalability)이 낮아짐
  - 오류 확인
    - 참조 정합성이 안 맞는 데이터 찾는 비용 발생
      - 찾아도 처리방법에 대한 문제(삭제? DEFAULT 표시?)

      ```sql
      SELECT b.bug_id, b.status
      FROM Bugs b LEFT OUTER JOIN BugStatus s
        ON (b.status = s.status)
      WHERE s.status IS NULL;
      ```

  - 데이터 조작에 대한 확신 불가
    - 모든 DB 데이터 조작 코드는 완벽하지 않음
    - 스크립트로 DB를 직접 수정하여 오차 발생 가능
  - 진퇴양난 업데이트
    - 추가 및 삭제는 부모 및 자식 데이터를 조작하여 가능
    - 부모 자식 동시 업데이트 불가
      - 부모 업데이트 전, 자식 업데이트 불가
      - 자식 업데이트 전, 부모 업데이트 불가
- 안티패턴 인식 방법
  - 한 테이블에는 있지만 다른 테이블에는 없는 값은 어떻게 찾지?
    - 고아 데이터 찾기
  - 데이트 등록시 다른 테이블에 값이 있는 지 확인 방법이 뭐지?
    - 부모행 존재 확인
  - FK는 DB 성능을 떨어뜨리는데?
    - FK가 없으면 오히려 문제를 키운다
- 안티패턴 사용이 합당한 경우
  - FK 미지원 DB 사용
  - 극단적인 유연한 DB 설계
    - 하지만, 이는 엔터티-속성-값 및 다형성 관계 안티패턴의 강한 징후이다

- 해법: 제약조건 선언하기
  - FK제약 선언으로 처음부터 잘못된 데이터 입력 방지
    - 데이터 검증 코드 불필요
    - DB변경에도 모든 코드가 동일 제약조건 따름을 확신
    - 개발, 디버킹, 보수 시간 감소
      - 코드 1000줄에 15~20개 버그는 소프트웨어 업계 평균수치
  - 여러 테이블 변경 지원
    - 단계적 업데이트(cascading update)
    - 자식 테이블 추가 시 FK에 단계적 동작 기술

      ```SQL
      FOREIGN KEY (status) REFERENCES BugStatus(status)
        ON UPDATE CASCADE    -- 부모따라 자동 업데이트
        ON DELETE SET DEFAULT
        --ON DELETE RESTRICT  -- 부모 행 삭제 억제
      ```

  - 오버헤드는 다른 대안에 비해 오하려 적다
    - INSERT, UPDATE, DELETE 전에 데이터 확인용 SELECT 불필요
    - 여러 테이블 변경 위해 데이블 잠금 불필요
    - 고아 데이터 정정 위해 품질 제어 스크립트 실행 불필요
  - FK는 쉬운 사용, 성능 향상, 참조 정합성 유지의 장점이 있다

---

### 엔터티-속성-값(EAV)

- 목표: 가변 속성 지원
  - 테이블은 속성집합으로 객체를 나타낼 수 있음
  - 현대 객체지향 프로그램은 상속 등으로 확장 가능
  - 확장된 객체 정보를 테이블 행으로 저장하고 싶음

- 안티패턴: 범용 속성 테이블 사용
  - 엔터티-속성-값: 각 행이 속성을 나타내는 설계
    - 엔터티: (보통)한 엔터티에 한 행을 가지는 부모 테이블에 대한 FK칼럼
    - 속성: 일반 테이블에서 칼럼명을 나태내나, 이 설계에서는 각 행마다 속성이 들어감
    - 값: 각 속성에 대한 값

      ```SQL
      CREATE TABLE Issues (
        issue_id SERIAL PRIMARY KEY
      );

      CREATE TABLE IssueAttributes (
        issue_id BIGINT UNSIGNED NOT NULL,
        attr_name VARCHAR(100) NOT NULL,
        attr_value VARVHAR(100),
        PRIMARY KEY (issue_id, attr_name)
        FOREIGN KEY (issue_id) REFERENCES Issues(issue_id)
      );
      ```

  - 보이는 이득
    - 두 테이블 모두 적은 칼럼 소유
    - 새 속성은 칼럼 추가 없이 행 추가로 가능
    - 비사용 속성을 NULL로 표시한 칼럼 없어도 됨
    - 그러나, 사용이 어려움(개선된 설계로 보이지만)
  - 속성 조회
    - SELECT 칼럼명으로 끝날 일을 WHERE 속성명 지정으로 복잡하게 수행
  - 데이터 정합성 지원
    - 필수 속성 사용 불가
      - 칼럼입력을 NOT NULL로 강제 불가
      - 행에 대한 입력 강제이기에 애플리케이션 코드 작성 필요
    - SQL 데이터 타입 사용 불가
      - DATE, INT 등 상제 불가
    - 참조 정합성 강제 불가
      - 색인 테이블에 대한 FK정의로 입력 범위 제한 불가

        ```SQL
        FOREIGN KEY (status) REFERENCES BugStatus(status)
        ```

    - 속성 이름 강제 불가
      - 같은 의미 데이터를 date_reported 혹은 report_date로 저장 가능
      - 서브 커리로 집계 가능하나 이도 불확실
      - attr_name칼럼이 칼럼명 테이블을 참조하는 FK제약 가능하나, 속성명 추가제한 발생

        ```SQL
        SELECT date_reported, COUNT(*) AS bugs_per_date
        FROM (SELECT DISTINCT issue_id, attr_value AS date_reported
        FROM IssueAttributes
        WHERE attr_name IN ('date_reported', 'report_date'))
        GROUP BY date_reported;
        ```

  - 행 재구성하기
    - 한 행의 일부로 속성검색은 많은 조인 필요

      ```SQL
      SELECT i.issue_id,
        i1.attr_value AS "date_reported",
        i2.attr_value AS "status",
        i3.attr_value AS "priority",
        i4.attr_value AS "description"
      FROM Issues AS i
        LEFT OUTER JOIN IssueAttributes AS i1
          ON i.issue_id = i1.issue_id AND i1.attr_name = 'date_reported'
        LEFT OUTER JOIN IssueAttributes AS i2
          ON i.issue_id = i2.issue_id AND i2.attr_name = 'status'
        LEFT OUTER JOIN IssueAttributes AS i3
          ON i.issue_id = i3.issue_id AND i3.attr_name = 'priority';
        LEFT OUTER JOIN IssueAttributes AS i4
          ON i.issue_id = i4.issue_id AND i4.attr_name = 'description';
      WHERE i.issue_id = 1234;
      ```

    - CASE문 사용시 여러 조인 없이 가능하나, 모든 칼럼명 파악과 복잡 쿼리 문제가 남음

      ```SQL
      SELECT issue_id, MAX(date_reported), MAX(status), MAX(priority), MAX(description)
      FROM (
        SELECT issue_id,
          CASE WHEN attr_name='date_reported' THEN attr_value END date_reported,
          CASE WHEN attr_name='status' THEN attr_value END status,
          CASE WHEN attr_name='priority' THEN attr_value END priority,
          CASE WHEN attr_name='description' THEN attr_value END description
        FROM IssueAttributes
        WHERE issue_id=1234
      ) t
      GROUP BY issue_id;
      ```

    - 결국 쿼리 비용이 높음

- 안티패턴 인식 방법
  - 이 DB는 메타데이터 변경 없이 런타임에 새 속성 정의할 수 있어
    - 관계형DB는 이 정도의 유연성을 제공하지 않음
  - 한 쿼리에 최대 가능 조인은 몇 번이지?
    - DB의 한계를 초과하는 조인회수는 EAV의 흔한 문제
  - 우리 서비스는 리포트를 어떻게 생성해야 할지 모르겠어
    - EAV설계 소프트웨어는 일반적인 리포트 생성이 매우 복잡하거나 비현실적

- 안티패턴 사용이 합당한 경우
  - 관계형DB에서 EAV 안티패턴을 합리화하기 어려움
  - 동적 속성을 지원하는 일부 애플리케이션에서는 필요
    - 애플리케이션엣서 동적 속성이 필요한 테이블은 최대 2-3개
    - 숙련 DB컨설턴트는 EAV시스템이 1년 내 다루기 어려워진다 함
  - 비관계형 데이터 관리가 필요하다면 비관계형 기술을 사용
    - Berkeley DB: 키-값(key-value)저장소
    - Cassandra: Facebook 개발 분산 칼럼지향 데이터베이스(Apache 프로젝트로 공개)
    - CouchDB: 문서지향 데이터베이스로 JSON을 사용해 분산 키-값 데이터 표현
      - MongoDB도 마찬가지
      - Redis: 문서지향 메모리 데이터베이스
    - Hadoop과 HBase:
      - 대규모 반구조적(semistructured) 데이터 저장소에 대한 분산 쿼리를 위한 Google의 MapReduce 알고리즘에서 영감을 받아 작성된 오픈 소스 DBMS다.
    - Tokyo Cabinet: 키-값 저장소로, POSIX DBM, GNU GDBM 또는 Berkeley DB 스타일로 설계
  - 그러나, 메타데이터가 유동적이면 간단한 쿼리작성도 데이터 구조 발견 및 적응에 큰 비용 발생

- 해법: 서브타입 모델링
  - 단일 테이블 상속(Single Table Inheritance)
    - 관련 모든 속성을 한 테이블에 저장
      - 속성 하나는 행의 서브타입을 나타내는 데 사용(예: issue_type)
      - 특정 속성 미적용 객체는 해당 속성 칼럼에 NULL 저장
      - 새로운 객체 타입 발생시, 해당 속성 칼럼 추가
      ```SQL
      CREATE TABLE Issues (
        issue_id SERIAL PRIMARY KEY,
        reported_by BIGINT UNSIGNED NOT NULL,
        version_resolved VARCHAR(20),
        issue_type VARCHAR(10),       -- BUG 또는 FEATURE
        severity VARCHAR(20),         -- '버그'에서만 사용
        version_affected VARCHAR(20), -- '버그'에서만 사용
        sponsor VARCHAR(50),          -- '기능요청'에서만 사용
        FOREIGN KEY (reported_by) REFERENCES Accounts(account_id)
      );
      ```
    - 사용 한계
      - 테이블 칼럼 최대 수만큼 속성 수 제한
      - 어떤 속성이 어떤 서브타입 객체에 속하는지 정의하는 메타데이터 부재
        - 속성의 적용 서브타입은 추적 및 제한 필요(애플리케이션)
    - 사용이 적합한 경우
      - 서브타입과 그 서브타입에만 속하는 속성 개수가 적을 때
      - 액티브 레코드와 같은 단일 테이블 데이터베이스 접근 패턴을 사용해야 할 때
        - 액티브 레코드: 관계형데이터베이스(RDBMS)의 테이블을 객체로 연결(ORM : Object Relational Mapping)해서 네이티브 데이터베이스 SQL을 사용하지 않고도 데이터를 조작할 수 있도록 다양한 메소드가 제공되는 패턴

  - 구체 테이블 상속(Concrete Table Inheritance)
    - 서브타입별로 별도의 테이블 생성(모든 테이블이 공통 속성을 공유)

      ```SQL
      CREATE TABLE Bugs (
        issue_id SERIAL PRIMARY KEY,
        reported_by BIGINT UNSIGNED NOT NULL,
        severity VARCHAR(20),         -- '버그'에서만 사용
        version_affected VARCHAR(20), -- '버그'에서만 사용
        FOREIGN KEY (reported_by) REFERENCES Accounts(account_id)
      );
      CREATE TABLE FeatureRequests (
        issue_id SERIAL PRIMARY KEY,
        reported_by BIGINT UNSIGNED NOT NULL,
        sponsor VARCHAR(50),           -- '기능요청'에서만 사용
        FOREIGN KEY (reported_by) REFERENCES Accounts(account_id)
      );
      ```

    - 장점(단일 테이블 상속에 비해)
      - 행의 서브타입을 나타내는 속성 불필요(예: issue_type)
      - 서브타입에 필요한 속성만 저장 제한 가능

        ```SQL
        INSERT INTO FeatureRequests (issue_id, severity)  -- 에러
        ```

    - 단점
      - 서브타입 속성 테이블을 보고 고옹 속성 파악 어려움
      - 공통 속성 추가시 모든 서브타입 테이블 변경 필요
      - 객체와 저장 서브타입 테이블에 관한 메타데이터 부재로 관계 파악 어려움
      - 서브타입 상관없이 모든 객체 보기 복잡(UNION으로 묶은 뷰 필요)

        ```SQL
        CREATE VIEW Issues AS
          SELECT b.*, 'bug' AS issue_type
          FROM Bugs AS b
            UNION ALL
          SELECT f.*, 'feature' AS issue_type
          FROM FeatureRequests AS f;
        ```

    - 사용이 적합한 경우
      - 모든 서브타입 일괄 조회가 거의 불필요한 경우

  - 클래스 테이블 상속(Class Table Inheritance)
    - 객체지향 클래스같이 상속 흉내
      - 공통 속성용 베이스 타입 테이블 생성
      - 각 서브타입 테이블 생성
      - 서브타입 테이블 PK는 동시에 베이스 테이블에 대한 FK
      - 메타데이터에 의해 일대일 관계 강제

        ```SQL
        CREATE TABLE Issues (
          issue_id SERIAL PRIMARY KEY,
          reported_by BIGINT UNSIGNED NOT NULL,
          version_resolved VARCHAR(20),
          FOREIGN KEY (reported_by) REFERENCES Accounts(account_id)
        );

        CREATE TABLE Bugs (
          issue_id BIGINT UNSIGNED PRIMARY KEY,
          severity VARCHAR(20),
          version_affected VARCHAR(20),
          FOREIGN KEY (issue_id) REFERENCES Issues(issue_id)
        );

        CREATE TABLE FeatureRequests (
          issue_id BIGINT UNSIGNED PRIMARY KEY,
          sponsor VARCHAR(50),
          FOREIGN KEY (issue_id) REFERENCES Issues(issue_id)
        );
        ```

      - 서브타입 개수가 적다면, 조인으로 서브타입 일괄 출력 가능(VIEW후보)
        - ***개인 생각: Bugs이면서 FeatureRequests인 경우 제어 필요?***

        ```SQL
        SELECT i.*, b.*, f.*
        FROM Issues AS i
          LEFT OUTER JOIN Bugs AS b USING (issue_id)
          LEFT OUTER JOIN FeatureRequests AS f USING (issue_id);
        ```

    - 사용이 적합한 경우
      - 모든 서브타입 조회 및 공통칼럼 참조가 많은 경우

  - 반구조적 데이터(Semistructured Data)
    - 데이터의 속성 이름과 값을 TEXT(CLOB) 칼럼으로 저장
      - XML 또는 JSON 형식으로 부호화
      - Martin Fowler는 이 패턴을 직렬화된 LOB(Serialized LOB)라 부름

      ```SQL
      CREATE TABLE Issues (
        issue_id SERIAL PRIMARY KEY,
        reported_by BIGINT UNSIGNED NOT NULL,
        version_resolved VARCHAR(20),
        issue_type VARCHAR(10), -- BUG 또는 FEATURE
        attributes TEXT NOT NULL, -- 모든 동적 속성을 저장
        FOREIGN KEY (reported_by) REFERENCES Accounts(account_id)
      );
      ```

    - 장점
      - 새 속성은 TEXT 칼럼에 저장으로 쉽게 추가 가능
      - 서브타입 추가 새 행 추가로 쉽게 가능

    - 단점
      - 특정 속성에 접근하는 SQL이 거의 미지원
      - TEXT 내 각 속성에 대한 제한을 행 기반으로 변경 필요
      - 집계 및 정렬이 어려움
      - TEXT를 칼럼 내 특정 속성만 출력 어려움
      - 속성을 해석하는 애플리케이션 코드 필요

    - 사용이 적합한 경우
      - 서브타입 개수를 제한이 불가한 경우
      - 언제든 새 속성 정의가 필요한 경우

  - 사후 처리: EAV 설계를 사용할 수밖에 없는 경우
    - 안티패턴에서 설명한 문제를 이해하고, EAV 수반 부가작업 예상 및 계획 필수
    - 엔터티 조회시 관련 속성을 한 행씩 꺼내 처리
      | issue_id |  attr_name | attr_value |
      | --- |  --- | --- |
      | 1234 |  date_reported |  2009-06-01 |
      | 1234 |  description |  저장 기능 동작 안 함 |
      | 1234 |  priority  |  HIGH |
      | 1234 |  product |  Open FoundFile |
      | 1234 |  reported_by |  Bill |
      | 1234 |  severity  |  loss of functionality |
      | 1234 |  status  |  NEW |

      ```php
      $objects = array();

      $stmt = $pdo->query(
        "SELECT issue_id, attr_name, attr_value
          FROM IssueAttributes
          WHERE issue_id = 1234");

      while ($row = $stmt->fetch()) {
        $id = $row['issue_id'];
        $field = $row['attr_name'];
        $value = $row['attr_value'];

        if (!array_key_exists($id, $objects)) {
          $objects[$id] = new stdClass();
        }

        $objects[$id]->$field = $value;
      }
      ```

> 메타데이터를 위해서는 메타데이터를 사용하라.
---

### 다형성 연관

- 목표: 여러 부모 참조
  - 자식 테이블 comments이 테이블 Bugs 또는 FeatureRequests과 대응한다.
  - 즉, comments의 한 행은 Bugs과 FeatureRequests를 동시에 대응하지 않는다.

- 안티패턴: 이중 목적의 FK 사용
  - 다형성 연관(Polymorphic Associations) 정의
    - 자식 테이블에 부모테이블 이름 저장 칼럼 추가(예: issue_type)
    - issue_type칼럼에는 Bugs 또는 FeatureRequests만 저장 가능
    - 부모 테이블을 보는 issue_id에 FK제거
      - **부모테이블 값과 대응 강제 불가(정합성 불보장)**
      - issue_type칼럼 데이타와 테이블 이름의 대응확인 메타데이터 부재

    ```SQL
    CREATE TABLE Comments (
      comment_id SERIAL PRIMARY KEY,
      issue_type VARCHAR(20), -- "Bugs" 또는 "FeatureRequests"
      issue_id BIGINT UNSIGNED NOT NULL,
      author BIGINT UNSIGNED NOT NULL,
      comment_date DATETIME,
      comment TEXT,
      FOREIGN KEY (author) REFERENCES Accounts(account_id)
    );
    ```

  - 다형성 연관에서의 조회
    - Comments 테이블 issue_id 값은 Bugs와 FeatureRequests 양쪽 PK에 존재 가능
      - issue_type 지정 필요

      ```SQL
      -- 한 테이블만 조회하는 경우
      SELECT *
      FROM Bugs AS b JOIN Comments AS c
        ON (b.issue_id = c.issue_id AND c.issue_type = 'Bugs')
      WHERE b.issue_id = 1234;
      ```

    - **Bugs와 FeatureRequests 모두 issue_id가 존재시 문제 발생**
      - 조인 테이블 모두 명시 필요

      ```SQL
      -- 두 테이블 외부조인으로 조회(미매칭 필드는 NULL)
      SELECT *
      FROM Comments AS c
        LEFT OUTER JOIN Bugs AS b
          ON (b.issue_id = c.issue_id AND c.issue_type = 'Bugs')
        LEFT OUTER JOIN FeatureRequests AS f
          ON (f.issue_id = c.issue_id AND c.issue_type = 'FeatureRequests');
      ```

  - 비 객체지향 예제
    - 두 부모 테이블이 서로 관련 없을 떄도 사용 가능
      - 예: 전자상거래 시스템 Users, Orders, Addesses
      - 배송지 주소와청구지 주소 구별 칼럼 필요
        - 다른 부모 테이블도 위와 같은 **특별한 표시가 무수히 발생 가능**

        ```SQL
        CREATE TABLE Addresses (
          address_id SERIAL PRIMARY KEY,
          parent VARCHAR(20),         -- ”Users” 또는 ”Orders”
          parent_id BIGINT UNSIGNED NOT NULL,
          users_usage VARCHAR(20),    -- ”billing” 또는 ”shipping”
          orders_usage VARCHAR(20),   -- ”billing” 또는 ”shipping”
          address TEXT
        );
        ```

- 안티패턴 인식 방법
  - 이 스키마는 DB 내 어떤 리소스에도 태그 달 수 있다
  - 우리 DB설계에서는 FK선언이 불가능해
  - entity_type칼럼이 부모 테이블을 알려주는 칼럼이야?
  > Ruby on Rails 프래임워크 액티브 레코드 클래스 polymorphic 속성 선언으로 다형성 가능  
    Java는 Hibemate 프레임워크가 다형성 연관 지원

    ```ruby
    class Comment < ActiveRecord::Base
    belongs_to :commentable, :polymorphic => true
    end
    class Bug < ActiveRecord::Base
    has_many :comments, :as => :commentable
    end
    class FeatureRequest < ActiveRecord::Base
    has_many :comments, :as => :commentable
    end
    ```

- 안티패턴 사용이 합당한 경우
  - 기본적으로 다형성 연관 안티패턴 사용하지 말자
    - FK제약조건을 사용해 참조 정합성을 보장하자
    - 다형성 연관은 애플리케이션 코드에 지나친 의존한다
  - 객체-관계 프로그래밍 프레임워크 사용하는 경우 이 안티패선 사용 가능
    - 참조 정합성 유지용 래플리케이션 로직을 캡슐화해 다형성 연관 위험 완화 가능

- 해법: 관계 단순화
  > DB 재설계가 나음
  - [1] 역 참조: 다형성 연관의 관계방향이 거꾸로라는 본질 이해
    - 교차 테이블 생성
      - 자식 테이블(Comments)과 각 부모 테이블(Bugs, Features)용 교차 테이블 작성
      - Comments.issue_type 칼럼 불필요
      - 관계 관리 위한 애플리케이션 코드 불필요
      - 연관 관계 정합성을 메타데이터로 강제 가능

      ```SQL
      CREATE TABLE BugsComments (
        issue_id BIGINT UNSIGNED NOT NULL,
        comment_id BIGINT UNSIGNED NOT NULL,
        PRIMARY KEY (issue_id, comment_id),
        FOREIGN KEY (issue_id) REFERENCES Bugs(issue_id),
        FOREIGN KEY (comment_id) REFERENCES Comments(comment_id)
      );
      CREATE TABLE FeaturesComments (
        issue_id BIGINT UNSIGNED NOT NULL,
        comment_id BIGINT UNSIGNED NOT NULL,
        PRIMARY KEY (issue_id, comment_id),
        FOREIGN KEY (issue_id) REFERENCES FeatureRequests(issue_id),
        FOREIGN KEY (comment_id) REFERENCES Comments(comment_id)
      );
      ```

    - 신호등 설치
      - 교차 테이블은 보통 다대다 관계에 사용
        - 특정 댓글이 복수 버그 및 기능요청과 연관 가능
        - 각 댓글은 **하나**의 버그 또는 기능요청과 관계 필요
        - 각 교차테이블의 comment_id 칼럼에 UNIQUE 제약조건 선언으로 강제
        - **다만, 특정 댓글의 양쪽 교차테이블 참조방지는 애플리케이션 코드 필요**

    - 양쪽 다 보기
      - 특정 버그 또는 기능요청에 대한 **댓글**은 교차 테이블 이용 조회(예: Bugs)

      ```SQL
      -- 한 테이블만 조회하는 경우
      SELECT *
      FROM BugsComments AS b
        JOIN Comments AS c USING (comment_id)  --  c.issue_type = 'Bugs' 불필요
      WHERE b.issue_id = 1234;
      ```

    - 특정 댓글에 대한 **버그나 기능요청**은 두 교차 테이블 외부조인으로 조회
      - 조인 테이블 모두 명시 필요

      ```SQL
      -- 두 테이블 외부조인으로 조회(미매칭 필드는 NULL)
      SELECT *
      FROM Comments AS c
        LEFT OUTER JOIN (BugsComments JOIN Bugs AS b USING (issue_id))
          USING (comment_id)  --  c.issue_type = 'Bugs' 불필요
        LEFT OUTER JOIN (FeaturesComments JOIN FeatureRequests AS f USING (issue_id))
          USING (comment_id)  --  c.issue_type = 'FeatureRequests' 불필요
      WHERE c.comment_id = 9876;
      ```

    - 차선 통합
      - 여러 부모 테이블에 대한 조회 결과를 한번에 출력하는 2가지 방법
      - 쿼리가 복잡하므로 뷰 생성해서 사용을 추천
      - (1) UNION
        - 한쪽 테이블이 존재하지 않는 칼럼은 NULL로 자리를 만듬
        - 칼럼 순서 동일하게 맞춤

        ```SQL
        SELECT b.issue_id, b.description, b.version_affected, NULL AS sponsor
          FROM Comments AS c
            JOIN (BugsComments JOIN Bugs AS b USING (issue_id))
              USING (comment_id)
          WHERE c.comment_id = 9876;
        UNION
          SELECT f.issue_id, f.description, NULL AS version_affected, f.sponsor
          FROM Comments AS c
            JOIN (FeaturesComments JOIN FeatureRequests AS f USING (issue_id))
              USING (comment_id)
          WHERE c.comment_id = 9876;
        ```

      - (2) COALESCE()
        - COALESCE()는 처음으로 NULL이 아닌 값을 지닌 인자 리턴
          - 예제 실습: [SQL확인](https://www.w3schools.com/sql/trysqlserver.asp?filename=trysql_func_sqlserver_coalesce2)

          ```SQL
          SELECT
            COALESCE(NULL, 1, 2) as a
            , COALESCE(NULL, 2, 1) as b;
            -- a:1, b:2 리턴
          ```

          - Bugs 관계 댓글은 모든 FeatureRequests 칼럼 데이터가 NULL
          - FeatureRequests 관계 댓글은 모든 Bugs 칼럼 데이터가 NULL
          - 부모테이블에 없는 칼럼은 NULL 
          - COALESCE() 내 동일한 테이블 순서 필요 (Bugs, FeatureRequests)
        -

        ```SQL
        SELECT c.*,
          COALESCE(b.issue_id, f.issue_id ) AS issue_id,
          COALESCE(b.description, f.description) AS description,
          COALESCE(b.reporter, f.reporter ) AS reporter,
          COALESCE(b.priority, f.priority ) AS priority,
          COALESCE(b.status, f.status ) AS status,
          b.severity,          -- FeatureRequests 출력시 NULL
          b.version_affected,  -- FeatureRequests 출력시 NULL
          f.sponsor            -- Bugs 출력시 NULL
        FROM Comments AS c
          LEFT OUTER JOIN (BugsComments JOIN Bugs AS b USING (issue_id))
            USING (comment_id)
          LEFT OUTER JOIN (FeaturesComments JOIN FeatureRequests AS f USING (issue_id))
            USING (comment_id)
        WHERE c.comment_id = 9876;  -- c.comment_id는 PK로 유일값
        ```

  - [2] 공통 수퍼테이블 생성
    - 객체지향 다형성은 서브타입이 공통 수퍼타입을 공유해 두 서브타입을 비슷하게 참조 가능
    - 조상 테이블을 사용하면 FK를 통해 데이터베이스 정합성을 강제할
    - 베이스 테이블(base table) 생성해 다형성 연관 안티피턴에 없는 공통 수퍼타입 대응
      - 모든 부모 테이블이 베이스 테이블(base table) 상속
      - 자식 테이블(Comments)에도 베이스 테이블 참조 FK추가(issue_id 칼럼 불필요)
      - **베이스 테이블(조상 테이블) 사용으로 FK 통해 DB 정합성 강제 가능**
      - ERD  
        ![01-07-다형성연관-베이스테이블연관](./img/01-07-다형성연관-베이스테이블연관.PNG)

      - SQL
        - Bugs와 FeatureRequests의 issue_id 칼럼은 PK인 동시에 FK
        - issue_id는 Issues 테이블의 PK 참조

        ```SQL
        CREATE TABLE Issues (
          issue_id SERIAL PRIMARY KEY
        );
        CREATE TABLE Bugs (
          issue_id BIGINT UNSIGNED PRIMARY KEY,
          FOREIGN KEY (issue_id) REFERENCES Issues(issue_id),
          ...
        );
        CREATE TABLE FeatureRequests (
          issue_id BIGINT UNSIGNED PRIMARY KEY,
          FOREIGN KEY (issue_id) REFERENCES Issues(issue_id),
          ...
        );
        CREATE TABLE Comments (
          comment_id SERIAL PRIMARY KEY,
          issue_id BIGINT UNSIGNED NOT NULL,
          author BIGINT UNSIGNED NOT NULL,
          comment_date DATETIME,
          comment TEXT,
          FOREIGN KEY (issue_id) REFERENCES Issues(issue_id),
          FOREIGN KEY (author) REFERENCES Accounts(account_id),
        );
        ```

        - Issues 테이블에 속성이 없다면 쿼리에 추가 불필요
        - Comments는 Bugs 또는 FeatureRequests와 직접 조인 가능 (Issues PK 이용)

        ```SQL
        -- 두 테이블 조인
        SELECT *
        FROM Comments AS c
          LEFT OUTER JOIN Bugs AS b USING (issue_id)
          LEFT OUTER JOIN FeatureRequests AS f USING (issue_id)
        WHERE c.comment_id = 9876;

        -- 특정 버그 관련 댓글 조회
        SELECT *
        FROM Bugs AS b
          JOIN Comments AS c USING (issue_id)
        WHERE b.issue_id = 1234;
        ```

  > 모든 테이블 관계에는 참조하는 테이블 하나, 참조되는 테이블 하나가 있음

---

### 형식

- 목표: 
  - 
- 안티패턴
  - 
- 안티패턴 인식 방법
  - 
- 안티패턴 사용이 합당한 경우
  - 
- 해법
  - 
