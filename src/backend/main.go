package main

import (
	"log"
	"time"

	"github.com/Roongkun/software-eng-ii/internal/cli"
)

func init() {
	time.Local = time.UTC
}

func main() {
	if err := cli.RootCmd.Execute(); err != nil {
		log.Fatal(err.Error())
	}

}
