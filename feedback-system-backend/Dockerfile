FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# For production deployment - handles migration state automatically
CMD python -c "from app import app, db; from sqlalchemy import text; app.app_context().push(); db.session.execute(text('DELETE FROM alembic_version')); db.session.commit(); db.create_all(); db.session.execute(text(\"INSERT INTO alembic_version (version_num) VALUES ('feb3bc8f6122') ON CONFLICT (version_num) DO NOTHING\")); db.session.commit(); print('Database ready')" && gunicorn app:app --bind 0.0.0.0:5000

