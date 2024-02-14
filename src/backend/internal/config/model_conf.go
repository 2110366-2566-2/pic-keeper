package config

type App struct {
	Database                 Database     `mapstructure:"database"`
	SecretKey                string       `mapstructure:"secretKey"`
	AdministratorSecretKey   string       `mapstructure:"administrator_secretKey"`
	AdministratorPhysicalIPs []string     `mapstructure:"administrator_ip"`
	OAuth2Google             OAuth2Google `mapstructure:"oauth2_google"`
}

type Database struct {
	Postgres BaseConfig `mapstructure:"postgres"`
	MongoDB  BaseConfig `mapstructure:"mongodb"`
	Redis    BaseConfig `mapstructure:"redis"`
}

type BaseConfig struct {
	DSN string `mapstructure:"dsn"`
}

type OAuth2Google struct {
	ClientId     string `mapstructure:"client_id"`
	ClientSecret string `mapstructure:"client_secret"`
	RedirectURL  string `mapstructure:"redirect_url"`
}
