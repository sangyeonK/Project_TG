# Project TG Back-end Application

프로젝트 TG 백엔드( 서버사이드 ) 어플리케이션 문서이다.


##### 참고 명령어

**DB테이블 생성쿼리 덤프하기(HOST: 127.0.0.1, DATABASE NAME: tg )**
```bash
$ mysqldump -uroot -h127.0.0.1 -p --no-data tg | sed -e 's/ AUTO_INCREMENT=[0-9]\+//' -e '/^--.*$/d'
```