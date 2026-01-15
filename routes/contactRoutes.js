//Just defines the URL and Method

const express = require("express");
const router = express.Router();
const { getContacts, createContact, getContact,updateContact, deleteContact, } = require ("../controllers/contactController");


router.route("/").get(getContacts).post(createContact);
//router.route("/").post(createContact);

router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);
//router.route("/:id").put(updateContact);
//router.route("/:id").delete(deleteContact);


module.exports = router;