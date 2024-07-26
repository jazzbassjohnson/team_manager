# Use an official Python runtime as a parent image
FROM python:3.10-slim
RUN pip install gunicorn

# Set the working directory in the container
WORKDIR /

# Copy the requirements file into the container
COPY requirements.txt ./

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Install python-dotenv
RUN pip install python-dotenv

# Copy the current directory contents into the container at /app
COPY . .

# Ensure the .env file is copied into the container (if needed)
# COPY .env .env

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Collect static files
RUN python manage.py collectstatic --noinput

# Run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
