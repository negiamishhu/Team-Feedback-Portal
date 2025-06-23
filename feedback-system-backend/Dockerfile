FROM python:3.9-slim

WORKDIR /app

COPY requirement.txt .

RUN pip install --no-cache-dir -r requirement.txt

COPY . .

EXPOSE 5000

# Run migrations and seeder before starting the app
# RUN flask db upgrade
# RUN python seeder.py

CMD ["python", "app.py"] 

