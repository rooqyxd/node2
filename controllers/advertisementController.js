const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../data/advertisements.json");

const readDataFromFile = () => {
	if (!fs.existsSync(dataFilePath)) {
		fs.writeFileSync(dataFilePath, JSON.stringify([]));
	}
	const data = fs.readFileSync(dataFilePath);
	return JSON.parse(data);
};

const writeDataToFile = (data) => {
	fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

exports.createAdvertisement = (req, res) => {
	const advertisements = readDataFromFile();
	const newAd = {
		id: Date.now().toString(),
		...req.body,
		author: req.user.username,
		date: new Date().toISOString(),
	};
	advertisements.push(newAd);
	writeDataToFile(advertisements);
	res.status(201).json(newAd);
};

exports.getAdvertisementById = (req, res) => {
	const advertisements = readDataFromFile();
	const ad = advertisements.find((ad) => ad.id === req.params.id);
	if (!ad) return res.status(404).json({ error: "Advertisement not found" });

	res.format({
		"application/json": () => res.json(ad),
		"text/plain": () => res.send(JSON.stringify(ad, null, 2)),
		"text/html": () => res.send(`<h1>${ad.title}</h1><p>${ad.description}</p>`),
	});
};

exports.getAllAdvertisements = (req, res) => {
	const advertisements = readDataFromFile();
	res.json({ message: "Ogłoszenia podane", data: advertisements });
};
exports.updateAdvertisement = (req, res) => {
	const advertisements = readDataFromFile();
	const index = advertisements.findIndex((ad) => ad.id === req.params.id);
	if (index === -1) return res.status(404).json({ error: "Advertisement not found" });

	if (advertisements[index].author !== req.user.username) {
		return res.status(403).json({ error: "Access denied - you re not user to update it" });
	}

	advertisements[index] = { ...advertisements[index], ...req.body };
	writeDataToFile(advertisements);
	res.json(advertisements[index]);
};

exports.deleteAdvertisement = (req, res) => {
	const advertisements = readDataFromFile();
	const index = advertisements.findIndex((ad) => ad.id === req.params.id);
	if (index === -1) return res.status(404).json({ error: "Advertisement not found" });

	if (advertisements[index].author !== req.user.username) {
		return res.status(403).json({ error: "Access denied - you re not user to delete it" });
	}

	advertisements.splice(index, 1);
	writeDataToFile(advertisements);
	res.json({ message: "Advertisement deleted" });
};

exports.searchAdvertisements = (req, res) => {
	const { title, description, minPrice, maxPrice, minDate, maxDate, category, tags } = req.query;
	const advertisements = readDataFromFile();
	let results = advertisements;

	if (title) {
		const titleLower = title.toLowerCase();
		results = results.filter((ad) => ad.title.toLowerCase().includes(titleLower));
		console.log("Results after title filter:", results);
	}
	if (description) {
		const descriptionLower = description.toLowerCase();
		results = results.filter((ad) => ad.description.toLowerCase().includes(descriptionLower));
		console.log("Results after description filter:", results);
	}
	if (minPrice) {
		results = results.filter((ad) => ad.price >= parseFloat(minPrice));
		console.log("Results after minPrice filter:", results);
		res.json({ data: results });
	}
	if (maxPrice) {
		results = results.filter((ad) => ad.price <= parseFloat(maxPrice));
		console.log("Results after maxPrice filter:", results);
	}
	if (minDate) {
		results = results.filter((ad) => new Date(ad.date) >= new Date(minDate));
		console.log("Results after minDate filter:", results);
	}
	if (maxDate) {
		results = results.filter((ad) => new Date(ad.date) <= new Date(maxDate));
		console.log("Results after maxDate filter:", results);
	}
	if (category) {
		const categoryLower = category.toLowerCase();
		results = results.filter((ad) => ad.category.toLowerCase() === categoryLower);
		console.log("Results after category filter:", results);
	}
	if (tags) {
		const tagArray = tags.split(",").map((tag) => tag.trim().toLowerCase());
		results = results.filter((ad) => {
			const adTagsLower = ad.tags.map((tag) => tag.toLowerCase());
			return tagArray.every((tag) => adTagsLower.includes(tag));
		});
		console.log("Results after tags filter:", results);
	}

	res.json(results);
};
