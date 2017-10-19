# Project TG Back-end Application

프로젝트 TG 백엔드( 서버사이드 ) 어플리케이션 문서이다.

### 서버 빌드하기
본 프로젝트는 typescript로 구현되었기 때문에 javascript 로의 컴파일이 필요하다
```bash
$ npm build
```
서버를 빌드하면 `./dist/swagger.json` 이 생성되어 API 명세를 확인할 수 있다.

### 서버 실행
```bash
$ npm start
```

##### 참고 명령어

**DB테이블 생성쿼리 덤프하기(HOST: 127.0.0.1, DATABASE NAME: tg )**
```bash
$ mysqldump -uroot -h127.0.0.1 -p --no-data tg | sed -e 's/ AUTO_INCREMENT=[0-9]\+//' -e '/^--.*$/d'
```

**API 문서 생성하기**
```bash
$ npm run swagger-gen
```
`./dist/swagger.json` 파일이 생성된다.
swagger editor ( https://swagger.io/ ) 를 통해 내용을 확인할 수 있다.
