var http = require("http");
var server = http.createServer(function(req, res) {

    console.log("有人进来了")
    res.writeHead(200, {
        "Content-Type": 'text/html;charset="utf-8"'
    });
    res.write("abcd");
    res.end()
}).listen(8888)
console.log("服务器启动成功")