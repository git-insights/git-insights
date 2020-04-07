up:
	docker-compose up -d redis postgres
	docker-compose run --rm api yarn
	docker-compose up api front-end

build:
	docker-compose build --pull api front-end

destroy:
	docker-compose stop
	docker-compose rm -f

.PHONY: up build destroy test watch # let's go to reserve rules names