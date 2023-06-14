#!/usr/bin/env bash

if [ "$1" = "--up" ]; then
    docker-compose up -d
fi

if [ "$1" = "--logs" ]; then
    docker-compose logs --follow
fi

if [ "$1" = "--stop" ]; then
    docker-compose stop
fi

if [ "$1" = "--rebuild" ]; then
    docker-compose up -d --force-recreate --no-deps --build
fi

if [ "$1" = "--destroy" ]; then
    docker-compose down --rmi local -v --remove-orphans
fi

[ -n "$1" -a \( "$1" = "--up" -o "$1" = "--logs" -o "$1" = "--stop" -o "$1" = "--rebuild" -o "$1" = "--destroy" \) ] \
    || { echo "usage: $0 --up | --logs | --stop | --rebuild | --destroy" >&2; exit 1; }
