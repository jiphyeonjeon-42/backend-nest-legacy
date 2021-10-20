## run docker containers
docker-compose -f ~/backend/docker-compose.yml up --build -d

## set basic data to database
docker-compose -f ~/backend/docker-compose.yml exec backend npm run seed
docker-compose -f ~/backend/docker-compose.yml exec backend npm run bulk