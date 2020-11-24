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

### 형식

- 목표
- 안티패턴
- 안티패턴 인식 방법
- 안티패턴 사용이 합당한 경우
- 해법
