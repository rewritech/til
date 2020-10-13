# 초보를 위한 도커 안내서
## [도커란 무엇인가?](https://subicura.com/2017/01/19/docker-guide-for-beginners-1.html)
- 이미지
    - 컨테이너 실행에 필요한 파일과 설정값등을 포함하고 있는 것
    - 상태값을 가지지 않고 변하지 않음(Immutable)
    - 도커 이미지 저장소
        - [Docker hub](https://hub.docker.com/)
        - [Docker Registry](https://docs.docker.com/registry/)
- 컨테이너
    - 이미지를 실행한 상태
    - 추가되거나 변하는 값은 컨테이너에 저장
    - 같은 이미지에서 여러개의 컨테이너를 생성 가능
    - 컨테이너 상태변화 및 삭제에도 이미지는 그대로 남음
- 레이어
    - 여러개의 레이어를 하나의 파일시스템으로 사용할 수 있게 해줌
    - 이미지는 여러개의 읽기 전용read only 레이어로 구성
    - 파일이 추가되거나 수정되면 새로운 레이어가 생성
    - 이미지A: (a + b + c)
    - 이미지AX: (a + b + c) + X
    - 이미지AX2: (a + b + c) + ~~X~~ X2

## [설치하고 컨테이너 실행하기](https://subicura.com/2017/01/19/docker-guide-for-beginners-2.html)
### 도커 설치하기
- winodws는 다운로드 설치 [link](https://hub.docker.com/editions/community/docker-ce-desktop-windows/)
    - Linux는 아래 명령어로 설치
        ```
        curl -fsSL https://get.docker.com/ | sudo sh
        ```
    - sudo 없이 사용하기
        ```bash
        sudo usermod -aG docker $USER # 현재 접속중인 사용자에게 권한주기
        sudo usermod -aG docker your-user # your-user 사용자에게 권한주기
        ```
    - Docker 버전확인
        ```bash
        docker version
        ```
- 자주 사용하는 옵션
    | 옵션  | 설명                                                   |
    |-------|--------------------------------------------------------|
    | -d    | detached mode 흔히 말하는 백그라운드 모드              |
    | -p    | 호스트와 컨테이너의 포트를 연결 (포워딩)               |
    | -v    | 호스트와 컨테이너의 디렉토리를 연결 (마운트)           |
    | -e    | 컨테이너 내에서 사용할 환경변수 설정                   |
    | –name | 컨테이너 이름 설정                                     |
    | –rm   | 프로세스 종료시 컨테이너 자동 제거                     |
    | -it   | -i와 -t를 동시에 사용한 것으로 터미널 입력을 위한 옵션 |
    | –link | 컨테이너 연결 [컨테이너명:별칭]                        |
- 각종 설치
    ```bash
    sudo apt update

    docker run ubuntu:16.04
    docker run -d -p 1234:6379 redis
    docker run -d -p 3306:3306 \
    -e MYSQL_ALLOW_EMPTY_PASSWORD=true \
    --name mysql \
    mysql:5.7
    ```


### 도커 기본 명령어

#### 컨테이너 관련

- 컨테이너 목록 확인: docker ps
    ```bash
    docker ps  # 실행중 컨테이너 목록
    docker ps -a  # 종료된 컨테이너까지 출력
    docker ps --all  # 상동
    ```

- 컨테이너 중지: docker stop [OPTIONS] CONTAINER [CONTAINER...]
    ```bash
    docker stop ${CONTAINER1_ID}
    docker stop ${CONTAINER2_ID} ${CONTAINER3_ID}  # 여러개 종료
    ```

- 컨테이너 삭제: docker rm [OPTIONS] CONTAINER [CONTAINER...]
    ```bash
    docker rm  ${CONTAINER1_ID}
    docker rm ${CONTAINER2_ID} ${CONTAINER3_ID}  # 여러개 삭제

    # 중지 컨테이너 일괄 삭제
    docker rm -v $(docker ps -a -q -f status=exited)
    ```

#### 이미지 관련

- 이미지 목록 확인: docker images [OPTIONS] [REPOSITORY[:TAG]]
    ```bash
    docker images
    ```

- 이미지 다운로드: docker pull [OPTIONS] NAME[:TAG|@DIGEST]
    - run: 자동으로 다운로드 후 실행
    - pull: 최식버전으로 다시 다운로드 시 사용
    ```bash
    docker pull
    ```

- 이미지 삭제: docker rmi [OPTIONS] IMAGE [IMAGE...]
    - 실행중 이미지 삭제 불가
    ```bash
    docker rmi ${IMAGE1_ID}
    ```

#### 컨테이너 로그 보기
- 로그 확인: docker logs [OPTIONS] CONTAINER
    - 표준 스트림(Standard streams) 중 stdout, stderr 수집
        - 컨테이너 내 실행 프로그램의 로그 설정을 파일이 아닌 표준출력으로 변경 필요
        - 출력 방식 변경만으로 모든 컨테이너는 같은 방식으로 로그 관리 가능
    - 로그파일은 json 방식으로 어딘가에 저장
        - 로그가 많으면 차지하는 용량이 커지므로 주의
        - 도커 지원 플러그인으로 json 외의 특정 로그 서비스에 스트림을 전달 가능
        - 앱 규모가 커지면 기본적인 방식 대신 로그 서비스를 이용 고려 필요
    ```bash
    docker logs ${CONTAINER1_ID}
    docker logs --tail 10 ${CONTAINER1_ID}  # 마지막 10줄 출력
    docker logs -f 10 ${CONTAINER1_ID}  # 실시간 생성로그 출력, ctrl + c로 종료
    ```

#### 컨테이너 명령어 실행하기 (exec)
> 실행중인 컨테이너에 들어가거나 컨테이너의 파일을 실행 필요. 컨테이너에 SSH 설치 비권장
- 컨테이너 명령어 실행: docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
    - run: 새로 컨테이너 만들어서 실행
    - exec: 실행중인 컨테이너에 명령어를 실행
    ```bash
    docker exec -it mysql /bin/bash  # 키보드 입력 위해 -it 옵션 추가
    ```

### 컨테이너 업데이트
1. 새 버전 이미지 다운(pull)
1. 기존 컨테이너 정지 삭제(stop, rm)
1. 새 이미지 기반 새 컨테이너 실행(run)
#### **컨테이너 삭제에도 쌓인 데이터 유지**
1. 외부 스토리지에 저장(Best예: 외부 클라우드 AWS)
2.  데이터 볼륨Data volumes을 컨테이너에 추가 사용
    - 해당 디렉토리는 컨테이너와 별도로 저장
    - -v 옵션
```bash
# before
docker run -d -p 3306:3306 \
  -e MYSQL_ALLOW_EMPTY_PASSWORD=true \
  --name mysql \
  mysql:5.7

# after
docker run -d -p 3306:3306 \
  -e MYSQL_ALLOW_EMPTY_PASSWORD=true \
  --name mysql \
  -v /my/own/datadir:/var/lib/mysql \ # <- volume mount
  mysql:5.7
  # 호스트 디렉토리: /my/own/datadir
  # 컨테이너 디렉토리: /var/lib/mysql
  # mysql 새 이미지 컨테이너도 기존 데이터 사용 가능
```

### Docker Compose
- 복잡한 명령어 관리
- Docker Compose: YAML방식 설정파일 이용
- 자동설치: Docker for Mac, Docker for Windows
    - Linux는 설치
        ```bash
        curl -L "https://github.com/docker/compose/releases/download/1.9.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
        # test
        docker-compose version
        ```
- 실행
    ```bash
    docker-compose up
    ```