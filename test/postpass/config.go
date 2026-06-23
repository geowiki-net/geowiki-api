package postpass

/* config stuff
 * should go into commandline arguments
 */
const (
	Host                 = "db"
	Port                 = 5432
	User                 = "readonly"
	Password             = "readonly"
	DBName               = "osm"
	QuickMediumThreshold = 150
	MediumSlowThreshold  = 150000
	ListenPort           = 8081
)
