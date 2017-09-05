let express = require("express");
let app = express();
let server = require("http").createServer(app);
let io = require("socket.io").listen(server);
let port = process.env.PORT || 3000;
server.listen(port, () => {
	console.log("Server : http://localhost:%d", port);
});

app.get("/chat", (req, res) => {
	res.render("formchat.jade");
});
