### 읽을 수 있는 패스워드

- 목표: 패스워드를 복구하거나 저장하기
- 안티패턴: 패스워드를 평문으로 저장
  - 패스워드 저장
    - 문자열 칼럼 password에 평문으로 저장
      - 공격ㅈ가 SQL문 가로채 읽을 수 있음
      - 클라이언트 애플리케이션에서 DB서버 전송 내트워크 패킷 가로채 SQL문 확인
      - DB서버에서 쿼리 로그 검색 가능(DB 접근 권한 필요)
      - 백업 파일 데이터에서 읽기 가능

  - 패스워드 인증
    - 사용자 입력 패스워드를 SQL 평문에 사용 시, 공격자에게 노출 위험
      ```SQL
      SELECT
        CASE
          WHEN password = 'opensesame' THEN 1
          ELSE 0
          END AS password_matches
      FROM Accounts
      WHERE account_id = 123;
      ```
      - 위 예는 패스워드 실패인지 아이디 부재인지 알 수 있음
      - 1: 로그인 성공
      - 0: 패스워드 오류
      - 결과없음: 아이디 부재

  - 이메일로 패스워드 보내기
    - 이메일을 해커가 가로챈 경우 패스워드 노출

- 안티패턴 인식 방법
  - 패스워드 평문 저장
  - 역변환 가능 암호화 기법 사용
  - 패스워드 복구 기능 설계는 정중히 거절
  - 참고자료
    - 책: 『19 Deadly Sins of Software Security』(HLV05)
    - [Open Web Application Security Project](http://owasp.org)

- 안티패턴 사용이 합당한 경우
  - 애플리케이션에서 패스워드 접근 필요한 경우
    - 애플리케이션 내 암호화 기법 필요
    - 정직하고 협조적인 소수와 사용하는 애플리케이션
      - 인증(authentication): 자신이 원하는 누구로든 인증
      - 신원확인(identification): 그 사람이 맞는지를 증명

- 해법: 패스워드의 소금 친 해시 값을 저장
  - 해시 함수 이해하기
    - 입력 문자열을 해시로 변환해 문자열 길이조차 모르게 함
    - 해시 값은 역으로 원래 입력 값 알기 어려움
    - SHA-1, MD5(): 과거 인기 있었으나 해시 값에서 입력 문자 추론 가능
    - SHA-256, SHA-384, SHA-512 이상 사용 권장
  - SQL에서 해시 사용하기
    - SHA-256 패스워드 해시 값 문자 길이는 항상 64(CHAR64 고정)
    - MySql: 해시 값 리턴 함수 SHA2() 제공
  - 해시에 소금 추가하기
    - 공격자가 DB 접근시, [단어:해시] 사전 테이블 이용해 패스워드 탐색 가능
      ```SQL
      CREATE TABLE DictionaryHashes (
        password VARCHAR(100),
        password_hash CHAR(64)
      );

      SELECT a.account_name, h.password
      FROM Accounts AS a
      JOIN DictionaryHashes AS h
        ON a.password_hash = h.password_hash;
      ```
    - 패스워드 뒤에 임의의 바이트를 덧붙여 해시 값 생성
      - 인쇄불가능한 바이트도 가능
      - 예
        - 패스워드salt
        - 패스워salt드
        - 패스salt워드
        - 패salt스워드
        - salt패스워드
        - salt패스salt워드salt
      ```bash
      SHA2('password') = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
      SHA2('password-0xT!sp9') = '7256d8d7741f740ee83ba7a9b30e7ac11fcd9dbd7a0147f4cc83c62dd6e0c45b'
      ```
  - SQL에서 패스워드 숨기기
  - 패스워드 복구가 아닌 패스워드 재설정 사용하기

> 당신이 패스워드를 읽을 수 있다면, 해커도 읽을 수 있다.

---

### SQL 인젝션

- 목표: 동적 SQL 쿼리 작성하기
- 안티패턴: 검증되지 않은 입력을 코드로 실행하기
  - 사고는 발생할 것이다
  - 최고의 웹 보안 위협
  - 치료를 위한 탐구
    - 값을 이스케이프하기
    - 쿼리 파라미터
    - 저장 프로시저
    - 데이터 접근 프레임워크

- 안티패턴 인식 방법

- 안티패턴 사용이 합당한 경우
  - 없다

- 해법: 아무도 믿지 마리
  - 입력 값 필터링
  - 파라미터를 통한 값 전달
  - 동적 값 인용하기
  - 사용자의 입려을 코드와 격리하기
  - 코드 검토를 함께할 동료 구하기

> 사용자가 값을 입력하게 하라. 그러나 코드를 입력하게 해서는 안 된다.

### 형식

- 목표
- 안티패턴
- 안티패턴 인식 방법
- 안티패턴 사용이 합당한 경우
- 해법
