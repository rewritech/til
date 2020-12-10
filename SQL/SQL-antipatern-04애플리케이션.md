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

---

### 형식

- 목표
- 안티패턴
- 안티패턴 인식 방법
- 안티패턴 사용이 합당한 경우
- 해법