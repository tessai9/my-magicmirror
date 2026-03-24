/* Config Sample
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/configuration/introduction.html
 * and https://docs.magicmirror.builders/modules/configuration.html
 *
 * You can use environment variables using a `config.js.template` file instead of `config.js`
 * which will be converted to `config.js` while starting. For more information
 * see https://docs.magicmirror.builders/configuration/introduction.html#enviromnent-variables
 */
let config = {
	address: "localhost",	// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/",	// The URL path where MagicMirror² is hosted. If you are using a Reverse proxy
									// you must set the sub path here. basePath must end with a /
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],	// Set [] to allow all IP addresses
									// or add a specific IPv4 of 192.168.1.5 :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
									// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false,			// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "",	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "",	// HTTPS Certificate path, only require when useHttps is true

	language: "ja",
	locale: "ja-JP",   // this variable is provided as a consistent location
			   // it is currently only used by 3rd party modules. no MagicMirror code uses this value
			   // as we have no usage, we  have no constraints on what this field holds
			   // see https://en.wikipedia.org/wiki/Locale_(computer_software) for the possibilities

	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
	timeFormat: 24,
	units: "metric",

	modules: [
		{
			module: "alert",
		},
		{
			module: "updatenotification",
			position: "top_bar"
		},
		{
			module: "clock",
			position: "top_left",
			config: {
				timeFormat: 24,
				displaySeconds: true
			}
		},
		{
			module: "calendar",
			headers: "予定",
			position: "top_left",
			config: {
				calendars: [
					{
						symbol: "calendar",
						url: "https://calendar.google.com/calendar/ical/e887241cc2b7151ace19b56d969f9bf511273fd87b23747e15c660dc5a5835f6%40group.calendar.google.com/private-ad680cc44853604d81391db0adf0491e/basic.ics",
					}
				]
			},
		},
		{
			module: "tesao_negoto",
			position: "lower_third"
		},
		{
			module: "weather",
			position: "top_right",
			header: "今の天気",
			config: {
				weatherProvider: "openmeteo",
				type: "current",
				lat: 34.691,
				lon: 135.197
			}
		},
		{
			module: "weather",
			position: "top_right",
			header: "天気予報",
			config: {
				weatherProvider: "openmeteo",
				type: "forecast",
				lat: 34.691,
				lon: 135.197
			}
		},
		{
			module: "tesao_newsfeed",
			position: "bottom_bar",
			config: {
				feeds: [
					{
						title: "GIGAZINE",
						url: "https://gigazine.net/news/rss_2.0/"
					},
					{
						title: "KOBE Journal",
						url: "https://kobe-journal.com/feed"
					},
					{
						title: "Publickey",
						url: "https://publickey1.jp/atom.xml"
					}
				],
				showSourceTitle: true,
				showPublishDate: true,
				updateInterval: 10000,
				qrSize: 80
			}
		},
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }
