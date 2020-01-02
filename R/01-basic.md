R 프로그램 - 시즌 1
===

> link: [R 프로그램, 통계](https://www.youtube.com/playlist?list=PLupRxDNsA2DRBX3yJf9SL0r35-zzbLuLC)

## 1. 소개 및 인스톨

> Youtube: [R 프로그램 1_인스톨 및 소개
](https://www.youtube.com/watch?v=tCtfgfexOyc&list=PLupRxDNsA2DRBX3yJf9SL0r35-zzbLuLC)

### 1. 소개

1. R프로그램 컴퓨터 언어 중 하나
1. 통계, 데이터 분석에 좋은 언어
1. 경쟁 프로그램음 세스, 파이선이지만 R이 대세
    * 세스는 비쌈
    * 파이선도 같이 배우면 좋음
1. R은 배우기 쉬움
1. R은 무료

### 2. 인스톨

1. R언어: [다운로드](https://cran.r-project.org/)
1. R스튜디오: [다운로드](https://rstudio.com/)
    * 제일 많이 사용
    * 화면 분할이 좋음
    * 여러 줄의 코드를 실행 가능

## 2. value 지정

> Youtube: [R 프로그램 2_value 지정
](https://www.youtube.com/watch?v=H9bIm742fwg&list=PLupRxDNsA2DRBX3yJf9SL0r35-zzbLuLC&index=2)

1. 변수 <- 값
1. 변수 = 값 (위와 동일)
1. 값 -> 변수 (반대도 가능)
1. 사칙연산
    * '+' : 덧셈
    * '-' : 뺄셈
    * '*' : 곱셈
    * '/' : 나눗셈

```R
x <- 2
y = 5
z <- x*y
z # 10
```

## 3. demo, vector, length

> Youtube: [R 프로그램 3_demo, value, length
](https://www.youtube.com/watch?v=C-EAjg5TODM&list=PLupRxDNsA2DRBX3yJf9SL0r35-zzbLuLC&index=3)

### 1. demo

1. demo(persp): 지형 그림
1. demo(graphics): 도표 표시

### 2. vector

1. vector: 한 변수에 여러 값 할당
    * c(1,2,3)
    * 한가지 자료형만 입력
1. vector끼리 연산 가능
    * 두 vector의 길이는 배수관계 필요
1. length: 길이 반환

```R
x <- c(1,2,3)
x # 1 2 3
y <- c(2,3,4)
x*y # 2  6 12

z <- 9
x*z # 9 18 27

a <- c(1,2)
x*a # error: 두 객체의 길이가 서로 배수관계에 있지 않습니다.

length(x) # 3
length(z) # 1
length(a) # 2
```

## 3. data type, boolean

> Youtube: [R 프로그램 4_data type, true, false](https://www.youtube.com/watch?v=B9oXCeM_QVE&list=PLupRxDNsA2DRBX3yJf9SL0r35-zzbLuLC&index=4)

### 1. data type

1. str(): 데이터 타입 파악

```R
x <- c(1,2,3)
y <- c('2','3','4')

x*y # Error: 이항연산자에 수치가 아닌 인수입니다

str(x) # num [1:3] 1 2 3
str(y) # chr [1:3] "2" "3" "4"
```

### 2. boolean

1. boolean
    * true: 참
    * false: 거짓
1. 데이터 타입 상관 없이 비교가능

```R
1+2==3 # TRUE
1+2==5 # FALSE

x <- c(1,2,3)
y <- c('1','2','4')
x==y # TRUE  TRUE FALSE
```
