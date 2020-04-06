up:
	docker-compose up -d redis postgres
	docker-compose run --rm gitinsights /bin/sh -c "yarn && yarn sequelize db:migrate"
	docker-compose up gitinsights

build:
	docker-compose build --pull gitinsights

test:
	docker-compose run --rm gitinsights yarn test

watch:
	docker-compose run --rm gitinsights yarn test:watch

destroy:
	docker-compose stop
	docker-compose rm -f

.PHONY: up build destroy test watch # let's go to reserve rules names