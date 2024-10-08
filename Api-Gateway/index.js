/** @format */

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

const routes = {
	'/api/auth': 'http://localhost:8080',
	'/api/users': 'http://localhost:8080',
	'/api/msgs': 'http://localhost:3030',
};

for (const route in routes) {
	const target = routes[route];
	app.use(route, createProxyMiddleware({ target, changeOrigin: true }));
}

const PORT = 8083;

app.listen(PORT, () => {
	console.log(`api gateway started listening on port : ${PORT}`);
});
