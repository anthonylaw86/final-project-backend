const router = require("express").Router();
const { authorization } = require("../middleware/auth");

const {
  createMusicCard,
  getMusicCard,
  deleteMusicCard,
  likeMusicCard,
  unlikeMusicCard,
} = require("../controllers/musicCard");

const {
  validateMusicCard,
  validateItemId,
} = require("../middleware/validation.js");

router.get("/", getMusicCard);

router.use(authorization);

router.post("/", validateMusicCard, createMusicCard);

router.delete("/:itemId", validateItemId, deleteMusicCard);

router.put("/:itemId/likes", validateItemId, likeMusicCard);

router.delete("/:itemId/likes", validateItemId, unlikeMusicCard);

module.exports = router;
