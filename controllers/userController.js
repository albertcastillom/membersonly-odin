const { randomUUID } = require("crypto");

// Temporary in-memory "database"
const messages = [
  {
    id: randomUUID(),
    text: "Hi there!",
    user: "Amando",
    added: new Date(),
  },
  {
    id: randomUUID(),
    text: "Hello World!",
    user: "Charles",
    added: new Date(),
  },
];

async function getMessages(req, res) {
  //const messages = await db.getAllMessages();
  res.render("index", { title: "Mini Messageboard", messages });
}

async function getMessageById(req, res) {
  console.log("Fetching message with id:", req.params.id);
  const message = messages.find((msg) => msg.id === req.params.id);
  if (!message) {
    console.log("Message not found with id:", id);
    return res.status(404).send("Message not found");
  }
  res.render("message", { title: "Message Detail", message });
}

async function getNewMessageForm(req, res) {
  res.render("new", { title: "New Message" });
}

async function postNewMessage(req, res) {
  const username = (req.user.username || "").trim();
  const messageText = (req.body.text || "").trim();

  if (!username || !messageText) {
    return res.status(400).render("new", { errors: [{ msg: "Invalid user" }] });
  }
  messages.push({
    id: randomUUID(),
    text: messageText,
    user: username,
    added: new Date(),
  });
  //const saved = await db.addMessage(messageText, username);
  res.redirect("/protected");
}

module.exports = {
  getMessages,
  postNewMessage,
  getMessageById,
  getNewMessageForm,
};
