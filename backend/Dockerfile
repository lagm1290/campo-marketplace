FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Create staticfiles directory
RUN mkdir -p staticfiles

# Expose port
EXPOSE 8000

# Start script that handles migrations gracefully
CMD sh -c "python manage.py migrate --noinput 2>/dev/null || echo 'Migration skipped' && gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 2 --timeout 120"
