.PHONY: help build up down restart logs clean migrate collectstatic backup restore

help: ## نمایش راهنما
	@echo "دستورات موجود:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

setup: ## راه‌اندازی اولیه پروژه
	@echo "راه‌اندازی پروژه..."
	cp .env.example .env
	mkdir -p static media backups logs
	sudo chown -R $(USER):$(USER) .
	@echo "✓ فایل .env را ویرایش کنید و سپس 'make build' را اجرا کنید"

build: ## ساخت Docker images
	@echo "ساخت Docker images..."
	docker compose build

up: ## اجرای containerها
	@echo "اجرای containerها..."
	docker compose up -d
	@echo "✓ سرویس‌ها در حال اجرا هستند"
	@echo "Django: http://localhost:8000"
	@echo "Next.js: http://localhost:3000"

down: ## متوقف کردن containerها
	@echo "متوقف کردن containerها..."
	docker compose down

restart: ## راه‌اندازی مجدد
	@echo "راه‌اندازی مجدد..."
	docker compose restart

logs: ## نمایش لاگ‌ها
	docker compose logs -f

logs-django: ## نمایش لاگ Django
	docker compose logs -f django

logs-nextjs: ## نمایش لاگ Next.js
	docker compose logs -f nextjs

shell-django: ## وارد شدن به shell Django
	docker compose exec django python manage.py shell

bash-django: ## وارد شدن به bash Django
	docker compose exec django bash

bash-nextjs: ## وارد شدن به bash Next.js
	docker compose exec nextjs sh

migrate: ## اجرای migrations
	@echo "اجرای migrations..."
	docker compose exec django python manage.py migrate

makemigrations: ## ساخت migrations جدید
	docker compose exec django python manage.py makemigrations

collectstatic: ## جمع‌آوری static files
	@echo "جمع‌آوری static files..."
	docker compose exec django python manage.py collectstatic --noinput

createsuperuser: ## ساخت superuser
	docker compose exec django python manage.py createsuperuser

test-django: ## اجرای تست‌های Django
	docker compose exec django python manage.py test

test-nextjs: ## اجرای تست‌های Next.js
	docker compose exec nextjs npm test

backup-db: ## پشتیبان‌گیری از دیتابیس
	@echo "پشتیبان‌گیری از دیتابیس..."
	mkdir -p backups
	docker compose exec -T postgres pg_dump -U bornahoosh_user bornahoosh_db > backups/db_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✓ پشتیبان ذخیره شد"

restore-db: ## بازیابی دیتابیس (استفاده: make restore-db FILE=backups/db_xxx.sql)
	@if [ -z "$(FILE)" ]; then \
		echo "خطا: فایل مشخص نشده. مثال: make restore-db FILE=backups/db_xxx.sql"; \
		exit 1; \
	fi
	@echo "بازیابی دیتابیس از $(FILE)..."
	docker compose exec -T postgres psql -U bornahoosh_user bornahoosh_db < $(FILE)
	@echo "✓ دیتابیس بازیابی شد"

clean: ## پاکسازی volumes و containerها
	@echo "آیا مطمئن هستید؟ این عملیات تمام داده‌ها را پاک می‌کند! (y/N)"
	@read answer; if [ "$$answer" = "y" ]; then \
		docker compose down -v; \
		echo "✓ پاکسازی انجام شد"; \
	else \
		echo "عملیات لغو شد"; \
	fi

ps: ## نمایش وضعیت containerها
	docker compose ps

stats: ## نمایش آمار مصرف منابع
	docker stats

update: ## به‌روزرسانی و راه‌اندازی مجدد
	@echo "به‌روزرسانی از Git..."
	git pull
	@echo "ساخت مجدد images..."
	docker compose build
	@echo "راه‌اندازی مجدد..."
	docker compose up -d
	@echo "اجرای migrations..."
	docker compose exec django python manage.py migrate
	@echo "جمع‌آوری static files..."
	docker compose exec django python manage.py collectstatic --noinput
	@echo "✓ به‌روزرسانی کامل شد"

prune: ## پاکسازی Docker (images, containers, volumes استفاده نشده)
	docker system prune -a --volumes