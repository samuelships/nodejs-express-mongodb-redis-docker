import mongoose from "mongoose";
import { ContactSchema } from "../models/crmModel.js";

const Contact = mongoose.model("Contact", ContactSchema);

export const addNewContact = (req, res) => {
  let newContact = new Contact(req.body);

  // contact param is basically the result, just rename it to param to avoid conflict of same param name
  newContact.save((err, contact) => {
    if (err) {
      res.send(err);
    }
    res.json(contact);
  });
};

export const getContacts = (req, res) => {
  Contact.find({}, (err, contact) => {
    if (err) {
      res.send(err);
    }
    res.header("Access-Control-Allow-Origin", "*");
    // setTimeout(() => {
    res.send(contact);
    // }, 5000);
  });
};

export const getContactWithID = (redis) => (req, res) => {
  console.log(req.params);
  Contact.findById(req.params.contactID, (err, contact) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (err) {
      res.send(err);
    } else {
      setTimeout(() => {
        redis.hmset(
          contact._id,
          "firstName",
          contact.firstName,
          "lastName",
          contact.lastName
        );
        res.send(contact);
      }, 3000);
    }
  });
};

export const updateContact = (req, res) => {
  Contact.findOneAndUpdate(
    { _id: req.params.contactID },
    req.body,
    { new: true, useFindAndModify: false },
    (err, contact) => {
      if (err) {
        res.send(err);
      }
      res.json(contact);
    }
  );
};

export const deleteContact = (req, res) => {
  Contact.findOneAndDelete({ _id: req.params.contactID }, (err, contact) => {
    if (err) {
      res.send(err);
    }
    res.json({ message: "Succedfully Deleted Contact" });
  });
};
