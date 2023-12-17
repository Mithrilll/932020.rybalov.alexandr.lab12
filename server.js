const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    
    if (req.url.includes('calculate')) {

        const chunks = [];
        let data;
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
            data = JSON.parse(Buffer.concat(chunks).toString());
            
            if (data == undefined) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('No data\n');
            } else {
                let result = calculate(data.firstValue, data.secondValue, data.operator);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(!result ? '' : result.toString());
            }
        });

    } else if (req.url.match(/.css/)) {
        
        let css = path.join(__dirname, req.url);
        fs.readFile(css, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found\n');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(data);
            }
        });

    } else if (req.url.match(/.js/)) {
        const url = req.url.split('/');
        const file = url[url.length - 1]; 
        let js = path.join(__dirname, "services", file);

        fs.readFile(js, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found\n');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/javascript' });
                res.end(data);
            }
        });
    } else if (req.url.includes("Calc")) { 

        const url = req.url.split('/');
        const file = url[url.length - 1];
        fs.readFile(`pages/${file}.html`, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found\n');
            } else {
                res.setHeader('Content-Type', "text/html");
                res.end(data);
            }
        })

    } else {

        fs.readFile('pages/index.html', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found\n');
            } else {
                res.setHeader('Content-Type', "text/html");
                res.end(data);
            }
        });

    }
});

function calculate(firstValue, secondValue, operator) {
    let result;
    switch (operator) {
        case '+':
            result = parseFloat(firstValue) + parseFloat(secondValue);
            break;
        case '-':
            result = parseFloat(firstValue) - parseFloat(secondValue);
            break;
        case '*':
            result = parseFloat(firstValue) * parseFloat(secondValue);
            break;
        case '/':
            if (secondValue == 0) {
                result = undefined;
            } else {
                result = (parseFloat(firstValue) / parseFloat(secondValue)).toFixed(5);
            }
            break;
        default:
            result = null;
            break;
    }
    return result;
}

server.listen(3000, () => {
    console.log('listening on PORT 3000');
});