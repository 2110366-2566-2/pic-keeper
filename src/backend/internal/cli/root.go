package cli

import (
	"github.com/Roongkun/software-eng-ii/internal/cli/serve"
	"github.com/spf13/cobra"
)

func init() {
	RootCmd.PersistentFlags().BoolP("debug", "d", false, "Run in debug mode")
	RootCmd.PersistentFlags().StringSliceP("config-file", "c", []string{}, "Path to configuration file")
	RootCmd.AddCommand(serve.ServeCmd)
}

var RootCmd = &cobra.Command{
	Use:   "pickeeper-backend",
	Short: "Backend service of Pickeeper Application",
}
