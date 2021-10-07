#!/bin/sh
git add *

echo "What is the commit message: "
read -r message

git commit -m "$message"

git push origin master
