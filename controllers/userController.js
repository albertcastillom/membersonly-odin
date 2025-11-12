const { randomUUID } = require("crypto");

const db = require("../models/userModel");

async function getMessages(req, res) {
  const messages = await db.getAllMessages();
  res.render("index", { title: "Mini Messageboard", messages });
}

async function getMessageById(req, res) {
  const message = await db.getMessageById(req.params.id);
  if (!message) {
    console.log("Message not found with id:", id);
    return res.status(404).send("Message not found");
  }
  res.render("message", { title: "Message Detail", message });
}

async function getNewMessageForm(req, res) {
  if (!req.user || req.user.role !== "member") {
    return res.status(403).send("Forbidden - Members only");
  }
  res.render("new", { title: "New Message" });
}

async function postNewMessage(req, res) {
  const userID = (req.user.id || "").trim();
  const messageText = (req.body.text || "").trim();

  if (!userID || !messageText) {
    return res.status(400).render("new", { errors: [{ msg: "Invalid user" }] });
  }

  const saved = await db.addMessage(userID, messageText, true);

  res.redirect("/");
}

module.exports = {
  getMessages,
  postNewMessage,
  getMessageById,
  getNewMessageForm,
};
