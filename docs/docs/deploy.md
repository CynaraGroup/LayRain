# 部署实例

## 系统要求
- Python 3.6+ 
- MySQL 5.7+

## 开始部署

### 克隆源码

``` git
git clone git@github.com:CynaraGroup/LayRain.git
```

### 环境准备

#### 创建虚拟环境 (可选但推荐)
创建并激活虚拟环境：
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/MacOS
python3 -m venv venv
source venv/bin/activate
```

#### 安装依赖包
进入项目目录，安装项目依赖：
```bash
pip install -r requirements.txt
```

### 数据库配置

#### 创建数据库
登录 MySQL 并创建数据库：
```bash
mysql -u root -p
```

在 MySQL 命令行中执行：
```sql
CREATE DATABASE IF NOT EXISTS leirain CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'leirain'@'localhost' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON leirain.* TO 'leirain'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 项目配置

修改 `api.py` 文件中的数据库连接信息：
```python:/api.py
# 请修改为你的MySQL连接信息
hitokoto = HitokotoSystem(
    host='169.254.43.14',  # 修改为您的MySQL主机地址
    user='leirain',         # 修改为您的MySQL用户名
    password='123456',      # 修改为您的MySQL密码
    database='leirain'      # 修改为您的数据库名称
)
```

### 运行项目

```bash
python api.py
```

服务将运行在 `http://[::1]:5000`。

### 部署到服务器 (可选)

#### 配置 Nginx 反向代理
安装 Nginx 并创建配置文件：
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

sudo nano /etc/nginx/sites-available/leirain
```

添加以下配置：
```nginx
server {
    listen 80;
    server_name your_domain.com;  # 替换为您的域名

    location / {
        proxy_pass http://[::1]:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置并重启 Nginx：
```bash
sudo ln -s /etc/nginx/sites-available/leirain /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 项目结构说明
```
LeiRain/
├── api.py         # Flask API 主文件
├── main.py        # 一言系统核心逻辑
├── requirements.txt  # 项目依赖
├── docs/          # 文档目录
└── public/        # 静态文件目录
```