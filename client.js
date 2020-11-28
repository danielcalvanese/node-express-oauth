const express = require("express")
const bodyParser = require("body-parser")
const axios = require("axios").default
const { randomString, timeout } = require("./utils")

const config = {
	port: 9000,

	clientId: "my-client",
	clientSecret: "zETqHgl0d7ThysUqPnaFuLOmG1E=",
	redirectUri: "http://localhost:9000/callback",

	authorizationEndpoint: "http://localhost:9001/authorize",
	tokenEndpoint: "http://localhost:9001/token",
	userInfoEndpoint: "http://localhost:9002/user-info",
}
let state = ""

const app = express()
app.set("view engine", "ejs")
app.set("views", "assets/client")
app.use(timeout)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/user-info", (req, res) => {
	if (!req.headers.authorization) {
		res.status(401).send("Error: client unauthorized")
		return
	}

	const authToken = req.headers.authorization.slice("bearer ".length)
	let userInfo = null
	try {
		userInfo = jwt.verify(authToken, config.publicKey, {
			algorithms: ["RS256"],
		})
	} catch (e) {
		res.status(401).send("Error: client unauthorized")
		return
	}
	if (!userInfo) {
		res.status(401).send("Error: client unauthorized")
		return
	}

	const user = users[userInfo.userName]
	const userWithRestrictedFields = {}
	const scope = userInfo.scope.split(" ")
	for (let i = 0; i < scope.length; i++) {
		const field = scope[i].slice("permission:".length)
		userWithRestrictedFields[field] = user[field]
	}

	res.json(userWithRestrictedFields)
})

const server = app.listen(config.port, "localhost", function () {
	var host = server.address().address
	var port = server.address().port
})

// for testing purposes

module.exports = {
	app,
	server,
	getState() {
		return state
	},
	setState(s) {
		state = s
	},
}
