test: build
	@npm run test


dev: build migrate
	@bash -c 'npm run query-node:start & node --inspect -r dotenv/config lib/processors/index.js & wait'


process: migrate
	@npm run processor:start


build: codegen
	@npm run build


serve: build
	@npm run query-node:start


create-migration: build
	@npx squid-typeorm-migration generate


migrate: build
	@npm run db:migrate


codegen:
	@npx squid-typeorm-codegen


typegen:
	@npx squid-substrate-typegen typegen.json


up:
	@docker-compose up -d


down:
	@docker-compose down


clean:
	@npm run clean


.PHONY: build serve process migrate codegen typegen up down
