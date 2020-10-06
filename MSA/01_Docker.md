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
- Linux
    ```
    curl -fsSL https://get.docker.com/ | sudo sh
    ```
- sudo 없이 사용하기
    ```bash
    sudo usermod -aG docker $USER # 현재 접속중인 사용자에게 권한주기
    sudo usermod -aG docker your-user # your-user 사용자에게 권한주기
    ```

