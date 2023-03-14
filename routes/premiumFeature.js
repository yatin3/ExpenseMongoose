const express = require("express");

const premiumFeatureController = require('../controllers/premiumFeature');

const userauthentication = require('../middleware/auth');

const router = express.Router();

router.get('/showLeaderBoard',userauthentication.authenticate, premiumFeatureController.getUserLeaderBoard);

module.exports = router;