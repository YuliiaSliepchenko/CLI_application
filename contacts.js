const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const path = require("path");

const contactsPath = path.join(__dirname, "db/contacts.json");

const updateContacts = async (contacts) =>
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

async function listContacts() {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}
async function getContactById(contactId) {
  const contacts = await listContacts();
  const result = contacts.find((contact) => contact.id === contactId);
  return result || null;
}
async function addContact(id, name, email, phone) {
  const contacts = await listContacts();
  const doubleContact = contacts.find((el) => el.phone === phone);
  if (doubleContact) throw Error("This contact already exists");
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}
async function removeContact(contactId) {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex((el) => el.id === contactId);
  if (contactIndex === -1) throw Error("No such contact");
  const remove = contacts[contactIndex];
  contacts.splice(contactIndex, 1);
  await updateContacts(contacts);
  return remove;
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
};
