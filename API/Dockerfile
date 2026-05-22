# Backend: FastAPI + TensorFlow model server
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies (needed for some Python packages)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (Docker layer caching: deps change less often than code)
COPY API/requerment.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the API code and the trained model
COPY API/ /app/API/
COPY saved_model/ /app/saved_model/

# Fix the relative path in main.py so it works inside the container
WORKDIR /app/API

# Expose the FastAPI port
EXPOSE 8000

# Run the FastAPI server
CMD ["python", "main.py"]
