//Handles the actual logic.
const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@desc Get all contacts
//@route GET /api/contacts
//@access public

const getContacts = asyncHandler(async(req, res) => {
    //res.send("Get all Contacts");
    //console.log("REQUEST RECEIVED:", req.method, req.url);
    //console.log(req.query.search);
    const contact = await Contact.find();
    res.status(200).json(contact);
});

//@desc Create contacts
//@route POST /api/contacts
//@access public
const createContact = asyncHandler(async(req, res) => {
    console.log("The request body is :",req.body);
    const {name, email, phone} = req.body;
    // If any field is missing
    if(!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are Mandatory")
    }
    // If all fields are present
    const contact = await Contact.create({
        name,
        email,
        phone,
    });
    res.status(201).json(contact);
});

//@desc GET contacts
//@route GET /api/contacts/:id
//@access public
const getContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
});

//@desc PUT contacts
//@route PUT /api/contacts/:id
//@access public
const updateContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    res.status(200).json(updatedContact);
});

//@desc DELETE contacts
//@route DELETE /api/contacts/:id
//@access public
const deleteContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    await Contact.findByIdAndDelete(req.params.id);
    //await Contact.remove(); // This method is deprecated and old one and not used
    res.status(200).json(contact);
});


module.exports = { 
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact 
};