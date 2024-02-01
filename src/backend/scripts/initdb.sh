until [ "`docker inspect -f {{.State.Running}} postgresql`"=="true" ]; do
    sleep 0.1;
done;

go run main.go migrate up -c ./internal/config/values.yaml