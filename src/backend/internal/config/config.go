package config

import (
	"bytes"
	_ "embed"
	"fmt"
	"strings"

	"github.com/pkg/errors"
	"github.com/spf13/viper"
)

//go:embed template.yml
var configTemplate []byte

func MustReadMultipleAppConfigFiles(listOfOverrideConfigFilePath []string) *App {
	config, err := ReadMultipleAppConfigFiles(listOfOverrideConfigFilePath)
	if err != nil {
		panic(fmt.Errorf("could not read config files: %s", err.Error()))
	}

	return config
}

func ReadMultipleAppConfigFiles(listOfOverrideConfigFilePath []string) (*App, error) {
	baseViper := viper.New()
	baseViper.SetConfigType("yaml")
	baseViper.AutomaticEnv()
	baseViper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	// Read template config
	if err := baseViper.ReadConfig(bytes.NewBuffer(configTemplate)); err != nil {
		return nil, errors.Wrap(err, "could not read template config")
	}

	// Read each config files
	for _, configFilePath := range listOfOverrideConfigFilePath {
		overrideViper := viper.New()
		overrideViper.SetConfigFile(configFilePath)
		if err := overrideViper.ReadInConfig(); err != nil {
			return nil, errors.Wrap(err, fmt.Sprintf("could not read config file %s", configFilePath))
		}

		if err := baseViper.MergeConfigMap(overrideViper.AllSettings()); err != nil {
			return nil, errors.Wrap(err, "could not merge config map")
		}

	}
	config := new(App)
	if err := baseViper.Unmarshal(config); err != nil {
		return nil, errors.Wrap(err, "could not unmarshal config")
	}
	return config, nil
}
