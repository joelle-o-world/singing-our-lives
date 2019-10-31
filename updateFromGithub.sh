#!/bin/sh

# fetch branches from 
git fetch origin master
if git diff origin/master
then 
  echo "Applying update from github...";
  git pull;
  npx webpack;
  pm2 restart "singing-our-lives"
else
  echo "No changes on github."
fi