#!/bin/bash

rm du-map.zip
zip -r du-map.zip ./* -x "pack.sh" -x "du-map.zip" -x "README.md" -x ".*" -x "config.php" -x "TODO" -x "index.php" -x "config.php.example"
