# traefik

## 1.为何使用 traefik

>*无须重启* 即可更新配置  
 *自动的服务发现与负载均衡*  
 与 docker 等编排工具完美集成，基于 container label 的配置 
 漂亮的 dashboard 界面  

## 核心概念
>Traefik 类似边缘路由器，可以作为整个平台的入口，根据逻辑和规则，处理并路由每个传入的请求。这些规则确定哪些服务处理哪些请求；传统的反向代理需要一个配置文件，其中包含路由到你服务的所有可能路由，而Traefik 会实时检测服务并自动更新路由规则，可以自动服务发现。

>Entrypoint 这是流量的入口，它们定义了接收请求的端口（HTTP或者TCP）。

>Providers 用来自动发现平台上的服务，可以是编排工具、容器引擎或者 key-value 存储等，比如 Docker、Kubernetes、File

>Routers 分析请求，负责将传入请求连接到可以处理这些请求的服务上去。

>Services 将请求转发给你的应用，负责配置如何获取最终将处理传入请求的实际服务。

>Middlewares 中间件，用来修改请求或者根据请求来做出一些判断（authentication, rate limiting, headers, ...），中间件被附件到路由上，是一种在请求发送到你的服务之前（或者在服务的响应发送到客户端之前）调整请求的一种方法。

## 3.快速开始

使用 traefik:v2.2 作为镜像启动服务。docker-compose.yaml 配置如下

```
version: '3'
services:
  traefik:
    container_name: traefik
    image: traefik:v2.2
    restart: always
    command: --configFile /etc/traefik.toml --api.insecure=true --providers.docker
    ports:
      - "80:80"
      - "8080:8080"
    networks: 
      - traefik
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik.toml:/etc/traefik.toml:ro
      - ./config/:/etc/traefik/config/:ro

networks:
  traefik:
    external: true
```

___

接下来启动两个node web服务，docker-compose.yaml 配置文件如下

```
version: "3"
services:
    node:
        image: tfnode:latest
        restart: always
        volumes:
            - "/Users/zhaoguanxin/CODE/OTHER/traefik/node:/app"
        labels:
            - "traefik.http.routers.node.rule=Host(`node.docker`)"
           
networks:
    default:
        external:
            name: traefik
```

```
version: "3"
services:
    nodedev:
        image: tfnodedev:latest
        restart: always
        volumes:
            - "/Users/zhaoguanxin/CODE/OTHER/traefik/nodedev:/app"
        labels:
            - "traefik.http.routers.nodedev.rule=Host(`nodedev.docker`)"
           
networks:
    default:
        external:
            name: traefik
```
## 自定义配置文件
Traefik 在启动的时候，会在一下位置中搜索名为 traefik.toml（或 traefik.yml、traefik.yaml）的文件：
* /etc/traefik/
* [$XDG_CONFIG_HOME/](https://blog.csdn.net/u014025444/article/details/94029895)
* $HOME/.config/
* . (工作目录)

traefik.toml
```
[global]
  checkNewVersion = false
  sendAnonymousUsage = false

[entryPoints]
  [entryPoints.http]
    address = ":80"

  [entryPoints.https]
    address = ":443"

[log]

[api]
  insecure = true
  dashboard = true

[ping]

[providers]
  [providers.docker]
  [providers.file]
    directory = "/etc/traefik/config"
    watch = true
```

rules.toml
```
[http]
  [http.routers]
    [http.routers.my-router]
      rule = "Host(`node.docker`)"
      service = "my-service"
    [http.routers.my-router2]
      rule = "Host(`nodedev.docker`)"
      service = "my-service2"
    [http.routers.my-router3]
      rule = "Host(`node.docker`) && Path(`/a`)"
      service = "my-service3"
    [http.routers.my-router4]
      rule = "Host(`nodedev.docker`) && Path(`/a`)"
      middlewares = ["my-mid"]
      service = "my-service"

  [http.middlewares]
    [http.middlewares.my-mid.replacePath]
      path = "/c"

  [http.services]
      [http.services.my-service.loadBalancer]
        [[http.services.my-service.loadBalancer.servers]]
          url = "http://172.20.0.3:2000"
          #url = "http://172.20.0.6:3000"
  
      [http.services.my-service2.loadBalancer]
        [[http.services.my-service2.loadBalancer.servers]]
          url = "http://172.20.0.6:3000"
          #url = "http://172.20.0.5:2000"
  
      [http.services.my-service3.loadBalancer]
        [[http.services.my-service3.loadBalancer.servers]]
          url = "http://172.20.0.4:2000"
        [[http.services.my-service3.loadBalancer.servers]]
          url = "http://172.20.0.3:3000"
```

使用 docker-compose up --scale node=4 对容器横向扩容


>基本配置文件可以通过 [traefik.sample.toml](https://raw.githubusercontent.com/containous/traefik/master/traefik.sample.toml) 获取


>[DEMO在这获取](https://github.com/GXZhao/traefik)










