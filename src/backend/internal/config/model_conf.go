package config

type App struct {
	Database     Database     `mapstructure:"database"`
	SecretKey    string       `mapstructure:"secretKey"`
	OAuth2Google OAuth2Google `mapstructure:"oauth2_google"`
}

type Database struct {
	Postgres BaseConfig `mapstructure:"postgres"`
	MongoDB  BaseConfig `mapstructure:"mongodb"`
}

type BaseConfig struct {
	DSN string `mapstructure:"dsn"`
}

type OAuth2Google struct {
	ClientId     string `mapstructure:"client_id"`
	ClientSecret string `mapstructure:"client_secret"`
	RedirectURL  string `mapstructure:"redirect_url"`
}
