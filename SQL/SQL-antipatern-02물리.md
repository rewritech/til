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

### 형식

- 목표
- 안티패턴
- 안티패턴 인식 방법
- 안티패턴 사용이 합당한 경우
- 해법