package config

type App struct {
	Database  Database `mapstructure:"database"`
	SecretKey string   `mapstructure:"secretKey"`
}

type Database struct {
	Postgres BaseConfig `mapstructure:"postgres"`
	MongoDB  BaseConfig `mapstructure:"mongodb"`
}

type BaseConfig struct {
	DSN string `mapstructure:"dsn"`
}
