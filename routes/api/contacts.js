const express = require("express");
const router = express.Router();
const {
  validationCreateContact,
  validationUpdateContact,
  validationUpdateStatusContact,
} = require("./validation");
const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../../controllers/contacts");

router.get("/", getAll).post("/", validationCreateContact, create);

router
  .get("/:id", getById)
  .delete("/:id", remove)
  .put("/:id", validationUpdateContact, update);

router.patch("/:id/favorite", validationUpdateStatusContact, update);

module.exports = router;
