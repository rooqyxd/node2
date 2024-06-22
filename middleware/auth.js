const users = [
	{ id: 1, username: "user1", password: "password1" },
	{ id: 2, username: "user2", password: "password2" },
	{ id: 3, username: "user3", password: "password3" },
];

module.exports = (req, res, next) => {
	const { username, password } = req.headers;
	const user = users.find((u) => u.username === username && u.password === password);
	if (!username || !password) {
		return res.status(403).json({ error: "Only users can delete and update advertisements" });
	}
	if (!user) {
		return res.status(403).json({ error: "Access denied - YOU ARE NOT USER" });
	}

	req.user = user;
	next();
};
