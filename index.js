// This is where the application starts

// Initialize the express framework so we can use it to handle routes
const opentracing = require('opentracing');

const app = require('express')();

const initTracer = require('jaeger-client').initTracer;

const PrometheusMetricsFactory = require('jaeger-client').PrometheusMetricsFactory;

const promClient = require('prom-client');

const metrics = new PrometheusMetricsFactory(promClient, 'test');

const config = {
	serviceName: 'JSAPI',
	sampler: {
		type: 'const',
		param: 1
	},
	reporter:{
		logSpans: true
		// agentHost: 'localhost',
		// agentPort: 5775
	}
};
const options = {
	logger: {
		info(msg) {
			console.log("INFO", msg)
		},
		error(msg) {
			console.log("ERROR", msg)
		}
	},
	tags: {
	  'JSAPI.version': '0.0.1',
	},
	metrics: metrics,
};

let tracer = initTracer(config, options);

console.log(tracer);

// Body Parser allows us to get stuff out of Post requests
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.status(200).send('reguler')
});
//const context = tracer.extract(opentracing.FORMAT_HTTP_HEADERS, headers);

// Basic get Route
app.get('/hello', (req, res) => {
	// req is the request and res is the response.
	let span = tracer.startSpan('JSAPI');
	
	span.finish();

	console.log('What');

	// End the route with a response
	tracer.close();
	res.status(200).send('Hello');
});

// Basic Post Route
app.post('/addNewItem', (req, res) => {
	// req is the request and res is the response.

	console.log('Post Request received');

	// Get the name of the item from the request body
	let itemToBeAdded = req.body.itemName;

	console.log('Item to be added:', itemToBeAdded);

	// End the route with a response
	res.status(200).send('Good Post Request');
});

// Starts the app listening on port 3000
app.listen(3000, () => {
	console.log('Listening on port 3000');
});
