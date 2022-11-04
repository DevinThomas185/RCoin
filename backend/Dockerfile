FROM python:3.9
WORKDIR /code
COPY . .
RUN sh -c "$(curl -sSfL https://release.solana.com/v1.5.7/install)"
RUN pip install --no-cache-dir --upgrade -r requirements.txt
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--log-config=\"logs/log.ini\""]