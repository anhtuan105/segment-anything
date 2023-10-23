# FROM ubuntu:latest

FROM python:3.10
RUN apt-get update && apt-get install -y python3-opencv
RUN apt update && apt install libegl1 -y

WORKDIR /main
COPY requirements.txt requirements.txt

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . /main




# ENTRYPOINT [ "uwsgi","--ini", "uwsgi.ini" ]

# EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
