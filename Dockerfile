FROM python:3.11-slim

# Set environment variables for production performance
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000 \
    HOST=0.0.0.0

WORKDIR /app

# Install minimal dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project code
COPY . .

# Expose port (Cloud Run maps this automatically)
EXPOSE 8000

# Run the master server
CMD ["python", "server.py"]
