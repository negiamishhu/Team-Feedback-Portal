FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# For development (with seeding and migrations)
CMD flask db upgrade && python seeder.py && python app.py

# For production, you might use:
# CMD flask db upgrade && python seeder.py && gunicorn app:app --bind 0.0.0.0:5000

