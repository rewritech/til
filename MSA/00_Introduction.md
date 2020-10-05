# MSA란?
## 개념소개 영상
1. https://www.youtube.com/watch?v=UsWrvBaQOA4SK 6분
1. https://www.youtube.com/watch?v=YX1FtOLEAZo동빈나 11분
1. https://www.youtube.com/watch?v=Vb8xo7VU04A기술노트with 알렉 11분

## 특징
- 기존 모놀리틱 서버는 모든 서비스 프로세스를 한 서버에서 실행
- MSA는 각각의 서비스가 자체 프로세스에서 실행
- 대부분 통신 HTTP기반 API (REST API 주로 사용)
- 비즈니스 기능 중심으로 구축
- 완전 자동화된 머신으로 독립적 배포 가능해야 함
- 중앙 집중식 관리 최소화
- 각각 다른 언어와 DB 사용 가능
- 서버가 죽을 수 있음을 가정하고 구축
## 분리구조 장점
- 장애 격리 복구 쉬움
- 적은 비용으로 서비스 증설이 쉬움
- 배포가 빠름
- 코드양이 적음
- 신기술 도입이 쉬움

<br>

# 선결과제
## 필요성 확인
- 잦은 수정 배포가 필요한가?
- 성능에 민감한 서비스인가?
- 분산 트랜젝션이 있는 서비스인가?
## DB
- 데이터 중복성을 허용
## 자동화
- 서비스 배포가 자동화 되어 있는가
- 도커 컨테이너 활용법을 이해했는가
    - 즉시 구동 가능한 서버 자체를 이미지화 -> 컨테이너로 즉시 배포
    - [초보를 위한 도커 안내서 (블로그)](https://subicura.com/2017/01/19/docker-guide-for-beginners-1.html)
    - [동빈나 도커부터 젠킨스 (Youtube)](https://www.youtube.com/watch?v=HbKCxBFT2wk&list=PLRx0vPvlEmdChjc6N3JnLaX-Gihh5pHcx)
    - [재즐보프 도커 (Youtube)](https://www.youtube.com/playlist?list=PLnIaYcDMsSczk-byS2iCDmQCfVU_KHWDk)
    - [가장 빨리 만나는 도커 (책)](http://pyrasis.com/private/2014/11/30/publish-docker-for-the-really-impatient-book)
- 젠킨스 사용법을 아는가
    - 젠킨스를 Git과 연동 -> Master Branch에 Push -> 젠킨스가 감지후 자동 배포
    - 젠킨스 배포도구로 어떤 상황에서 어떠한 방식으로 배포할 수 있도록 도움
## 문화
- MSA에 맞는 팀원과 팀문화인가?
    - 중앙 집중적이지 않고 개발자간 분업구조 필요
    - 애자일
    - 규모가 큰 서비스
    - 복잡한 서비스
    - 다수의 개발자 작업