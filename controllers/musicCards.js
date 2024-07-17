const MusicCard = require("../models/musicCard");
const { BadRequestError } = require("../utils/Errors/badRequestError");
const { NotFoundError } = require("../utils/Errors/notFoundError");
const { ForbiddenError } = require("../utils/Errors/forbiddenError");

// CREATE MUSIC CARD

const createMusicCard = (req, res, next) => {
  const { name, artist, albumUrl } = req.body;

  MusicCard.create({ name, artist, albumUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid Data"));
      } else {
        next(err);
      }
    });
};

// GET MUSIC CARD

const getMusicCard = (req, res, next) => {
  MusicCard.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

// DELETE MUSIC CARD

const deleteMusicCard = (req, res, next) => {
  const { itemId } = req.params;

  console.log(itemId);
  MusicCard.findById({ _id: itemId })
    .orFail()
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }

      if (String(item.owner) !== req.user._id) {
        return next(new ForbiddenError("This item doesn't belong to you"));
      }
      return item
        .deleteOne()
        .then(() => res.status(200).send({ message: "Item deleted" }));
    })

    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      }
      next(err);
    });
};

// LIKE MUSIC CARD

const likeMusicCard = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  MusicCard.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .ofFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      }
      next(err);
    });
};

// UNLIKE MUSIC CARD

const unlikeMusicCard = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  MusicCard.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .ofFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Data"));
      }
      next(err);
    });
};

Module.exports = {
  createMusicCard,
  getMusicCard,
  deleteMusicCard,
  likeMusicCard,
  unlikeMusicCard,
};
