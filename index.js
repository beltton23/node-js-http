'use strict';
const http = require('http');
const pug = require('pug');
const server = http
	.createServer((req, res) => {
		console.info('Requested by ' + req.connection.remoteAddress);
		res.writeHead(200, {
			'Content-Type': 'text/html; charset=utf-8'
		});
		switch(req.method){
			case 'GET':
				if(req.url === '/enquetes/yaki-shabu'){
					res.write(pug.renderFile('./form.pug', {
				    		path: req.url,
				    		firstItem: '焼肉',
				    		secondItem: 'しゃぶしゃぶ'
					}));
				}
				else if(req.url === '/enquetes/rice-bread'){
					res.write(pug.renderFile('./form.pug', {
				    		path: req.url,
				    		firstItem: 'ご飯',
				    		secondItem: 'パン'
					}));
				}
				res.end();
				break;
			case 'POST':
				let rawData = '';
				req.on('data', (chunk) => {
					rawData = rawData + chunk;
				}).on('end', () => {
				    const decoded = decodeURIComponent(rawData);
				    const qs = require('querystring');
				    const answer = qs.parse(decoded);
				    console.info('投稿: ' + answer['favorite'] + ' (' + answer['name'] + ')');
				    res.write('<!DOCTYPE html><html lang="ja"><body><h1>' +
					 answer['name'] + 'さんは' + answer['favorite'] + 'を投稿しました</h1></body></html>');
				    res.end();
				});
				break;
			case 'DELETE':
				res.write('DELETE ' + req.url);
				break;
			default:
				break;
		}
	})
	.on('error', e => {
		console.error('Server Error', e);
	})
	.on('clientError', e => {
		console.error('Client Error', e);
	});
const port = process.env.PORT || 8000;
server.listen(port, () => {
	console.info('Listening on ' + port);
});
