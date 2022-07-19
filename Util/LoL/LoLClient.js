const { LolApi } = require("twisted")

module.exports = (client) => {
	client.apiLoL = new LolApi({
  		rateLimitRetry: true, //If api response is 429 (rate limits) try reattempt after needed time (default true)
 		rateLimitRetryAttempts: 1, //Number of time to retry after rate limit response (default 1)
  		concurrency: undefined, //Concurrency calls to riot (default infinity) Concurrency per method (example: summoner api, match api, etc)
  		key: '',//Riot games api key
  		debug: {//Debug methods
    		logTime: false,//Log methods execution time (default false)
    		logUrls: false,//Log urls (default false)
    		logRatelimit: false//Log when is waiting for rate limits (default false)
  		}
	})
}
