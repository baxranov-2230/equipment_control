# Equipment Control System — Backend

Tashkilot jihozlari aylanmasi tizimining backend qismi.

## Texnologiyalar

- **Python 3.11+**
- **FastAPI** — Web framework
- **PostgreSQL** — Database
- **SQLAlchemy 2.0** — Async ORM
- **Alembic** — Migrations
- **Pydantic v2** — Validation
- **JWT** — Authentication
- **Docker** — Containerization

## Loyiha strukturasi

```
backend/
├── app/
│   ├── api/v1/          # REST API endpointlar
│   ├── core/            # Config, DB, Security, Exceptions
│   ├── models/          # SQLAlchemy ORM modellari
│   ├── schemas/         # Pydantic DTOlar
│   ├── repositories/    # DB access layer
│   ├── services/        # Business logic
│   ├── dependencies/    # Auth, Roles, Pagination
│   ├── utils/           # Yordamchi funksiyalar
│   ├── db/              # DB init va seeding
│   └── main.py          # App entry point
├── alembic/             # Migration fayllar
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
└── .env
```

## Ishga tushirish

### Docker bilan

```bash
docker-compose up --build
```

### Lokal

```bash
# Virtual environment
python -m venv venv
source venv/bin/activate

# Dependencies
pip install -r requirements.txt

# Database migration
alembic upgrade head

# Server
uvicorn app.main:app --reload --port 8000
```

## Default foydalanuvchi

- **Username:** `admin`
- **Password:** `admin123`

## API Docs

Server ishga tushgandan so'ng:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
