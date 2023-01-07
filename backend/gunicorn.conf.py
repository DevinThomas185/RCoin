import multiprocessing

wsgi_app = "main:app"
bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"
# logconfig = "logs/log.ini"
accesslog = "logs/access.log"
errorlog = "logs/error.log"
loglevel = "debug"
capture_output = True
keyfile = "/etc/nginx/certs/SSL/site.key"
certfile = "/etc/nginx/certs/SSL/site.crt"
