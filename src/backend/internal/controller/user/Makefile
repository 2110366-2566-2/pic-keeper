.PHONY: test
test:
	dsn=$(DSN) go test -v -coverpkg=./... -coverprofile cover.out

.PHONY: report
report:
	go tool cover -html cover.out -o cover.html

.PHONY: open
open:
	open cover.html

