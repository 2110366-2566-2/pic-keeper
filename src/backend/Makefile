VALUES_PATH := ./internal/config/values.yaml

.PHONY: serve
serve:
	go run main.go serve -c $(VALUES_PATH)


.PHONY: initdb
initdb: initPostgres
	go run main.go migrate up -c $(VALUES_PATH)

.PHONY: initPostgres
initPostgres:
	cd ./internal/config; docker compose up -d

.PHONY: new-sql
new-sql:
	@read -p "Enter SQL File Name: " sqlname; \
	go run main.go migrate create-sql $$sqlname

.PHONY: clean
clean: 
	rm -rf ./internal/config/persistence-data; rm -rf ./bin

.PHONY: up
up: 
	air -c .air.toml