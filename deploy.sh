#/!bin/bash

set -e pipefail

echo "Welcome to the project part of 'Domain Driven Microservices on AWS in Practices'!"
echo ""
echo "This script will install all required dependencies and deploy the services to AWS."
echo ""

echo "Installing and deploying Reservation..."
cd code/Reservation/Reservation
npm install
npx sls deploy
cd .. && cd .. && cd ..

echo "Installing and deploying Display..."
cd code/Reservation/Display
npm install
npx sls deploy
cd .. && cd .. && cd ..

echo "Installing and deploying VerificationCode..."
cd code/Security/VerificationCode
npm install
npx sls deploy
cd .. && cd .. && cd ..

echo "Installing and deploying Analytics..."
cd code/Analytics/Analytics
npm install
npx sls deploy
cd .. && cd .. && cd ..

echo "Finished deploying all services!"
echo ""
echo "NOTE: One last fix you need to do is get the random 10-character API Gateway string for the Security service and place it in 'code/Reservation/SlotReservation/serverless.yml' and redeploy SlotReservation again."
