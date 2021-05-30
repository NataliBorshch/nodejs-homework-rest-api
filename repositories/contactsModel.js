const Contact = require("../model/schemaContact");

const listContacts = async () => {
  const result = await Contact.find();
  return result;
};

const getContactById = async (id) => {
  const result = await Contact.findById(id);
  return result;
};

const removeContact = async (id) => {
  const result = await Contact.findByIdAndDelete(id);
  return result;
};

const createContact = async (body) => {
  const result = await Contact.create({ ...body });
  return result;
};

const updateContact = async (id, body) => {
  const result = await Contact.findByIdAndUpdate(
    id,
    { ...body },
    { new: true }
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  createContact,
  updateContact,
};
