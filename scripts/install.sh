#!/bin/bash

# رنگ‌ها برای خروجی
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}نصب پروژه برناهوش${NC}"
echo -e "${GREEN}==================================${NC}"

# بررسی root
if [ "$EUID" -eq 0 ]; then
  echo -e "${YELLOW}توجه: این اسکریپت با یوزر root در حال اجراست${NC}"
  echo -e "${YELLOW}پیشنهاد می‌شود از یوزر عادی استفاده کنید${NC}"
  read -p "آیا ادامه می‌دهید؟ (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# نصب Docker
echo -e "${GREEN}بررسی Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker نصب نیست. در حال نصب...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}✓ Docker نصب شد${NC}"
else
    echo -e "${GREEN}✓ Docker نصب است${NC}"
fi

# بررسی Docker Compose
if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}Docker Compose پلاگین نصب نیست!${NC}"
    exit 1
fi

# ساخت دایرکتوری پروژه
PROJECT_DIR="/opt/bornahoosh"
echo -e "${GREEN}ساخت دایرکتوری پروژه: ${PROJECT_DIR}${NC}"

if [ -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}دایرکتوری پروژه وجود دارد${NC}"
    read -p "آیا می‌خواهید آن را پاک کنید؟ (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        sudo rm -rf "$PROJECT_DIR"
        echo -e "${GREEN}✓ دایرکتوری قدیمی پاک شد${NC}"
    else
        echo -e "${RED}نصب لغو شد${NC}"
        exit 1
    fi
fi

sudo mkdir -p "$PROJECT_DIR"
sudo chown -R $USER:$USER "$PROJECT_DIR"

# کلون پروژه
echo -e "${GREEN}کلون کردن پروژه از GitHub...${NC}"
read -p "آدرس GitHub repository را وارد کنید: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo -e "${RED}آدرس repository خالی است!${NC}"
    exit 1
fi

git clone "$REPO_URL" "$PROJECT_DIR"
cd "$PROJECT_DIR"

# بررسی submodules
if [ -f .gitmodules ]; then
    echo -e "${GREEN}به‌روزرسانی submodules...${NC}"
    git submodule init
    git submodule update
fi

# ساخت دایرکتوری‌های مورد نیاز
echo -e "${GREEN}ساخت دایرکتوری‌های مورد نیاز...${NC}"
mkdir -p static media backups logs

# کپی .env
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ فایل .env ساخته شد${NC}"
        echo -e "${YELLOW}لطفاً فایل .env را ویرایش کنید:${NC}"
        echo -e "${YELLOW}nano .env${NC}"

        # تولید SECRET_KEY
        SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_urlsafe(50))')
        sed -i "s/your-secret-key-here-generate-new-one/$SECRET_KEY/" .env
        echo -e "${GREEN}✓ SECRET_KEY تولید شد${NC}"

    else
        echo -e "${RED}.env.example یافت نشد!${NC}"
        exit 1
    fi
fi

# پرسیدن اطلاعات دیتابیس
echo -e "${GREEN}تنظیمات دیتابیس:${NC}"
read -p "نام دیتابیس [bornahoosh_db]: " DB_NAME
DB_NAME=${DB_NAME:-bornahoosh_db}

read -p "نام کاربری دیتابیس [bornahoosh_user]: " DB_USER
DB_USER=${DB_USER:-bornahoosh_user}

read -sp "رمز دیتابیس: " DB_PASS
echo

if [ -z "$DB_PASS" ]; then
    DB_PASS=$(openssl rand -base64 32)
    echo -e "${YELLOW}رمز دیتابیس تولید شد: ${DB_PASS}${NC}"
fi

# به‌روزرسانی .env
sed -i "s/POSTGRES_DB=.*/POSTGRES_DB=$DB_NAME/" .env
sed -i "s/POSTGRES_USER=.*/POSTGRES_USER=$DB_USER/" .env
sed -i "s/POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=$DB_PASS/" .env

echo -e "${GREEN}✓ فایل .env تنظیم شد${NC}"

# ساخت و اجرای Docker containers
echo -e "${GREEN}ساخت Docker images...${NC}"
docker compose build

if [ $? -ne 0 ]; then
    echo -e "${RED}خطا در ساخت Docker images!${NC}"
    exit 1
fi

echo -e "${GREEN}اجرای containers...${NC}"
docker compose up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}خطا در اجرای containers!${NC}"
    exit 1
fi

# صبر برای ready شدن دیتابیس
echo -e "${YELLOW}صبر برای آماده شدن دیتابیس...${NC}"
sleep 10

# اجرای migrations
echo -e "${GREEN}اجرای migrations...${NC}"
docker compose exec -T django python manage.py migrate

# جمع‌آوری static files
echo -e "${GREEN}جمع‌آوری static files...${NC}"
docker compose exec -T django python manage.py collectstatic --noinput

# تنظیم دسترسی‌ها
echo -e "${GREEN}تنظیم دسترسی‌ها...${NC}"
sudo chown -R nobody:nogroup "$PROJECT_DIR/static"
sudo chown -R nobody:nogroup "$PROJECT_DIR/media"
sudo chmod -R 755 "$PROJECT_DIR/static"
sudo chmod -R 755 "$PROJECT_DIR/media"

# نمایش اطلاعات
echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}نصب با موفقیت انجام شد!${NC}"
echo -e "${GREEN}==================================${NC}"
echo
echo -e "${YELLOW}مراحل بعدی:${NC}"
echo
echo -e "1. ساخت superuser برای Django:"
echo -e "   ${GREEN}cd $PROJECT_DIR${NC}"
echo -e "   ${GREEN}docker compose exec django python manage.py createsuperuser${NC}"
echo
echo -e "2. تنظیم OpenLiteSpeed:"
echo -e "   - به پنل مدیریت بروید: https://your-ip:7080"
echo -e "   - Virtual Host برای bornahoosh.com را تنظیم کنید"
echo -e "   - Context های Proxy را اضافه کنید"
echo
echo -e "3. بررسی وضعیت:"
echo -e "   ${GREEN}docker compose ps${NC}"
echo -e "   ${GREEN}docker compose logs -f${NC}"
echo
echo -e "4. دسترسی به سرویس‌ها:"
echo -e "   - Django: http://localhost:8000"
echo -e "   - Next.js: http://localhost:3000"
echo -e "   - Django Admin: http://localhost:8000/admin/"
echo
echo -e "${YELLOW}فایل‌های مهم:${NC}"
echo -e "   - Environment: $PROJECT_DIR/.env"
echo -e "   - Logs: docker compose logs -f"
echo -e "   - Backups: $PROJECT_DIR/backups/"
echo
echo -e "${GREEN}دستورات مفید (با make):${NC}"
echo -e "   make help          - نمایش راهنما"
echo -e "   make logs          - مشاهده لاگ‌ها"
echo -e "   make restart       - راه‌اندازی مجدد"
echo -e "   make backup-db     - پشتیبان‌گیری"
echo
echo -e "${YELLOW}نکته امنیتی:${NC}"
echo -e "برای logout/login کنید تا تغییرات Docker group اعمال شود"
echo -e "یا این دستور را اجرا کنید: ${GREEN}newgrp docker${NC}"