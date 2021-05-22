const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const contactsPath = path.join(__dirname, "contacts.json");

// ***
const readContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(data);
};
// ***
const writeContacts = async (data) => {
  return await fs.writeFile(contactsPath, JSON.stringify(data));
};
// ***
const listContacts = async () => {
  return await readContacts();
};
// ***
const getContactById = async (id) => {
  const data = await readContacts();
  const contactId = data.find((ele) => ele.id === id);
  return contactId;
};
// ***
const removeContact = async (id) => {
  const data = await readContacts();
  const index = data.findIndex((ele) => ele.id === id);
  if (index !== -1) {
    const result = data.splice(index, 1);
    await writeContacts(data);
    return result;
  }
  return null;
};
// ***
const addContact = async (body) => {
  const newContact = { id: uuidv4(), ...body };
  const data = await readContacts();
  const newData = [newContact, ...data];
  await writeContacts(newData);
  return newContact;
};

const updateContact = async (id, body) => {
  const data = await readContacts();
  const index = data.findIndex((ele) => ele.id === id);
  if (index !== -1) {
    data[index] = { ...data[index], ...body };
    await writeContacts(data);
    return data[index];
  }
  return null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
