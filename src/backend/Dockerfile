FROM golang:1.22

WORKDIR /go/app

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .
RUN go build -o /go/bin/app . && app migrate up -c ./internal/config/values.yaml

CMD ["app serve -c ./internal/config/values.yaml"]




