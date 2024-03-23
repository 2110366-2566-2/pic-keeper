VALUES_PATH := ./internal/config/values.yaml

.PHONY: document
document:
	swag init -g ./internal/cli/serve/serve.go	

.PHONY: serve
serve: document
	go run main.go serve -c $(VALUES_PATH)

.PHONY: install-third-party
install-third-party: swag air

.PHONY: swag
swag: 
	go install github.com/swaggo/swag/cmd/swag@latest

.PHONY: air
air: 
	go install github.com/cosmtrek/air@latest

.PHONY: initdb
initdb: initPostgres
	scripts/initdb.sh; sleep 5; go run main.go migrate up -c ./internal/config/values.yaml

.PHONY: initPostgres
initPostgres:
	cd ./internal/config; docker compose up -d

.PHONY: new-sql
new-sql:
	@read -p "Enter SQL File Name: " sqlname; \
	go run main.go migrate create-sql $$sqlname

.PHONY: clean
clean: 
	rm -rf ./internal/config/persistence-data; rm -rf ./bin; rm -rf ./tmp

.PHONY: up
up:
	air -c .air.toml

.PHONY: migrate
migrate: 
	go run main.go migrate up -c $(VALUES_PATH)
