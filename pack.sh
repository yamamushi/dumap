#!/bin/bash

while getopts ":rp" opt; do
  case ${opt} in
    r ) # release (public zip)
        rm du-map.zip
        zip -r du-map.zip ./* -x "pack.sh" -x "README.md" -x ".*" -x "config.php" -x "TODO" -x "*.php" -x "config.php.example"
        exit 0
      ;;
    p ) # production (Website)
        rm du-map.zip
        zip -r du-map.zip ./* -x "pack.sh" -x "README.md" -x ".*" -x "config.php" -x "TODO" -x "*.html" -x "config.php.example"
        exit 0
      ;;
    \? ) echo "Usage: pack.sh [-r] [-p]"
      ;;
  esac
done

