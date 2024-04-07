# /bin/bash

# BUILD DOCKER
docker build -t birthday-counter .

# RUN DOCKER
docker run -d --name birthdays --network=host birthday-counter