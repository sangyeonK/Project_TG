# Docker Build Context For Project TG

프로젝트 TG 에서 사용하는 docker 이미지 를 생성하고 사용하는 방법에 대한 가이드 를 제시하는 문서이다.

사용하는 docker 어플리케이션 이미지:
 - mysql
 - nginx

### mysql
1. mysql 이미지 빌드
```bash
$ docker build -t tg_mysql ./mysql
```

2. tg_mysql 컨테이너 실행
```bash
$ docker run -d -v /storage/mysql:/var/lib/mysql -p 3306:3306 -h tg-mysql --name tg_mysql tg_mysql
```

### nginx
1. nginx 이미지 빌드
```bash
$ docker build -t tg_nginx ./nginx
```

2. tg_nginx 컨테이너 실행
```bash
$ docker run -d -p 80:80 -p 443:443 -p 8080:8080 -h tg-nginx --name tg_nginx tg_nginx
```

##### 참고 명령어

**실행중인 컨테이너 종료하고 삭제하기 (i.e. tg_mysql)**
```bash
$ docker stop tg_mysql && docker rm tg_mysql
```
컨테이너를 새로 실행하려고 할 때 이미 사용중인 이름을 사용하려면 기존의 컨테이너를 삭제한 후 실행해야 한다.
그외에도 이름을 변경해서 사용해도 가능하다.

**<none>태그가 붙은 이미지 삭제하기**
```bash
$ docker images | awk '/<none>/ {print $3}' | xargs docker rmi
```
해당 이미지를 사용중인 컨테이너가 있다면 이미지를 삭제할 수 없다. 컨테이너 들을 정리한 후 다시 사용해야 한다.

**사용중인 컨테이너 삭제하기**
```bash
$ docker rm $(docker ps -aq)
```

**실행중인 컨테이너의 IP주소 얻기 (i.e. tg_mysql)**
```bash
$ docker inspect -f '{{ .NetworkSettings.IPAddress }}' tg_mysql
```