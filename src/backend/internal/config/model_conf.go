package config

type App struct {
	Database Database `mapstructure:"database"`
}

type Database struct {
	DSN string `mapstructure:"dsn"`
}
