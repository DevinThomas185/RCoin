FROM python:3.9
WORKDIR /code
COPY . .
RUN pip install --no-cache-dir --upgrade -r requirements.txt
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "main:app", "--bind", "0.0.0.0:8000"]