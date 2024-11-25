test:
	go test -v ./... | ./colorize

cover:
	go test -cover ./... | ./colorize

cover-html:
	go test -coverprofile=c.out ./...
	go tool cover -html=c.out
