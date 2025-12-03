# پروژه برناهوش

پروژه وب‌سایت شرکت برناهوش با استفاده از Django (Backend) و Next.js (Frontend)

## پیش‌نیازها

- Ubuntu Server (20.04 یا بالاتر)
- Docker و Docker Compose
- OpenLiteSpeed
- دسترسی root یا sudo
- Git

## نصب و راه‌اندازی

### 1. کلون کردن پروژه

```bash
cd /opt
sudo git clone https://github.com/your-username/bornahoosh-app.git bornahoosh
sudo chown -R $USER:$USER bornahoosh
cd bornahoosh
```

اگر از submodule استفاده کرده‌اید:
```bash
git submodule init
git submodule update
```

### 2. تنظیمات اولیه

```bash
# کپی فایل .env
cp .env.example .env

# ویرایش فایل .env
nano .env

# ساخت دایرکتوری‌های مورد نیاز
mkdir -p static media backups logs
```

### 3. تولید SECRET_KEY برای Django

```bash
python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

خروجی را در فایل `.env` قرار دهید.

### 4. ساخت و اجرای Docker Containers

با استفاده از Makefile:
```bash
make build    # ساخت images
make up       # اجرای containerها
make logs     # مشاهده لاگ‌ها
```

یا مستقیماً با Docker Compose:
```bash
docker compose build
docker compose up -d
docker compose logs -f
```

### 5. راه‌اندازی Django

```bash
# اجرای migrations
make migrate

# ساخت superuser
make createsuperuser

# جمع‌آوری static files
make collectstatic
```

### 6. تنظیم OpenLiteSpeed

#### روش 1: از طریق پنل مدیریت

1. ورود به پنل: `https://your-ip:7080`
2. رفتن به **Virtual Hosts** → انتخاب `bornahoosh.com`
3. اضافه کردن Context ها:

**Django API:**
- Type: Proxy
- URI: `exp:^/(api|admin)/`
- Address: `http://127.0.0.1:8000`

**Static Files:**
- Type: Static
- URI: `/static/`
- Location: `/opt/bornahoosh/static/`

**Media Files:**
- Type: Static
- URI: `/media/`
- Location: `/opt/bornahoosh/media/`

**Next.js:**
- Type: Proxy
- URI: `/`
- Address: `http://127.0.0.1:3000`

#### روش 2: تنظیم دستی

ویرایش فایل: `/usr/local/lsws/conf/vhosts/bornahoosh.com/vhconf.conf`

```apache
# اضافه کردن این بخش‌ها به فایل کانفیگ
extprocessor django_backend {
  type                    proxy
  address                 http://127.0.0.1:8000
  maxConns                100
}

extprocessor nextjs_frontend {
  type                    proxy
  address                 http://127.0.0.1:3000
  maxConns                100
}

context exp:^/(api|admin)/ {
  type                    proxy
  handler                 django_backend
}

context /static/ {
  type                    static
  location                /opt/bornahoosh/static/
}

context /media/ {
  type                    static
  location                /opt/bornahoosh/media/
}

context / {
  type                    proxy
  handler                 nextjs_frontend
}
```

راه‌اندازی مجدد OpenLiteSpeed:
```bash
sudo systemctl restart lsws
```

### 7. تنظیم دسترسی‌ها برای OpenLiteSpeed

```bash
# دسترسی به static و media files
sudo chown -R nobody:nogroup /opt/bornahoosh/static
sudo chown -R nobody:nogroup /opt/bornahoosh/media
sudo chmod -R 755 /opt/bornahoosh/static
sudo chmod -R 755 /opt/bornahoosh/media
```

## دستورات مفید (با Makefile)

```bash
make help              # نمایش تمام دستورات
make up                # اجرای سرویس‌ها
make down              # متوقف کردن سرویس‌ها
make restart           # راه‌اندازی مجدد
make logs              # مشاهده لاگ‌ها
make logs-django       # مشاهده لاگ Django
make logs-nextjs       # مشاهده لاگ Next.js
make shell-django      # Django shell
make bash-django       # Bash در container Django
make migrate           # اجرای migrations
make makemigrations    # ساخت migrations
make collectstatic     # جمع‌آوری static files
make backup-db         # پشتیبان‌گیری از دیتابیس
make update            # به‌روزرسانی کامل پروژه
make ps                # وضعیت containerها
make stats             # آمار مصرف منابع
```

## به‌روزرسانی پروژه

```bash
cd /opt/bornahoosh
make update
```

یا به صورت دستی:
```bash
git pull
docker compose build
docker compose up -d
docker compose exec django python manage.py migrate
docker compose exec django python manage.py collectstatic --noinput
```

## پشتیبان‌گیری

### پشتیبان از دیتابیس
```bash
make backup-db
```

### بازیابی دیتابیس
```bash
make restore-db FILE=backups/db_20240101_120000.sql
```

### پشتیبان کامل
```bash
# پشتیبان از کل پروژه
tar -czf bornahoosh-backup-$(date +%Y%m%d).tar.gz /opt/bornahoosh
```

## عیب‌یابی

### مشاهده لاگ‌ها
```bash
# لاگ Docker
docker compose logs -f

# لاگ Django
docker compose logs -f django

# لاگ Next.js
docker compose logs -f nextjs

# لاگ OpenLiteSpeed
sudo tail -f /usr/local/lsws/logs/error.log
```

### بررسی وضعیت سرویس‌ها
```bash
docker compose ps
curl http://localhost:8000/api/health/
curl http://localhost:3000/
```

### راه‌اندازی مجدد
```bash
make restart
```

## امنیت

- فایل `.env` را به Git اضافه نکنید
- رمزهای قوی برای دیتابیس استفاده کنید
- SSL/TLS را در OpenLiteSpeed فعال کنید
- فایروال را تنظیم کنید

```bash
# فقط portهای مورد نیاز را باز کنید
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 7080/tcp  # پنل OpenLiteSpeed (فقط IP مشخص)
sudo ufw enable
```

## ساختار پروژه

```
/opt/bornahoosh/
├── backend/           # Django Backend
├── frontend/          # Next.js Frontend
├── static/            # Static files
├── media/             # Media files
├── backups/           # Database backups
├── logs/              # Log files
├── docker-compose.yml
├── .env
├── Makefile
└── README.md
```

## لینک‌های مفید

- [Django Documentation](https://docs.djangoproject.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)
- [OpenLiteSpeed Documentation](https://openlitespeed.org/kb/)

## پشتیبانی

برای گزارش مشکل یا پیشنهاد، به بخش Issues در GitHub مراجعه کنید.