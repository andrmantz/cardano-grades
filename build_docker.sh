#!/bin/sh
docker rm -f cardano_grades
docker build -t cardano_grades .
docker run --env-file ./.env --name=cardano_grades --rm -p3000:3000 -it cardano_grades