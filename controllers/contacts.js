const {
  listContacts,
  createContact,
  getContactById,
  removeContact,
  updateContact,
} = require("../repositories/contactsModel");

const getAll = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json({ status: "success", code: 200, data: { contacts } });
  } catch (e) {
    next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const contact = await createContact(req.body);
    return res
      .status(201)
      .json({ status: "success", code: 201, data: { contact } });
  } catch (e) {
    next(e);
  }
};

const getById = async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.id);
    return contact
      ? res.json({ status: "success", code: 200, data: { contact } })
      : res.json({ status: "error ", code: 404, message: "Not Found" });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const contact = await removeContact(req.params.id);
    return contact
      ? res.json({ status: "contact deleted", code: 200, data: { contact } })
      : res.json({ status: "error ", code: 404, message: "Not Found" });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length !== 0) {
      const contact = await updateContact(req.params.id, req.body);
      return contact
        ? res.json({ status: "success", code: 200, data: { contact } })
        : res.json({ status: "error", code: 404, message: "Not Found" });
    }
    return res.json({
      status: "Bad Request",
      code: 400,
      message: "missing fields",
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  remove,
  update,
};
