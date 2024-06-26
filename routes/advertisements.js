const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
	createAdvertisement,
	getAdvertisementById,
	getAllAdvertisements,
	updateAdvertisement,
	deleteAdvertisement,
	searchAdvertisements,
} = require("../controllers/advertisementController");

router.post("/", auth, createAdvertisement);
router.get("/search", searchAdvertisements);
router.get("/:id", getAdvertisementById);
router.get("/", getAllAdvertisements);
router.put("/:id", auth, updateAdvertisement);
router.delete("/:id", auth, deleteAdvertisement);

module.exports = router;
