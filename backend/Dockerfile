# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt ./

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Install gunicorn and python-dotenv
RUN pip install gunicorn python-dotenv

# Copy source files into application directory
COPY --chown=app:app . /app

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Collect static files
RUN python manage.py collectstatic --noinput

# Run the application
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000", "--timeout", "120"]
