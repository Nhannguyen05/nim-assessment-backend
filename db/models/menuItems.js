const mongoose = require("../db.js");

const menuItemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  }
});
menuItemsSchema.set("toJSON", {
  virtuals: true
});
// menu model
const MenuItems = mongoose.model("MenuItems", menuItemsSchema);

const getAll = async () => {
  try {
    const menuItems = await MenuItems.find();
    return menuItems;
  } catch (error) {
    return error;
  }
};

const getOne = async (id) => {
  try {
    const menuItem = await MenuItems.findById(id);
    return menuItem;
  } catch (error) {
    return error;
  }
};

const create = async (body) => {
  try {
    const menuItem = await MenuItems.create(body);
    return menuItem;
  } catch (error) {
    return error;
  }
};

const update = async (id, updatedFields) => {
  try {
    const updateField = { ...updatedFields, updatedAt: new Date() };
    const updateMenuItem = await MenuItems.findByIdAndUpdate(
      id,
      { $set: updateField },
      { new: true }
    );
    return updateMenuItem;
  } catch (error) {
    return error;
  }
};

const deleteById = async (id) => {
  const deletedItem = await MenuItems.findByIdAndDelete(id);
  return deletedItem.id;
};

const search = async (query) => {
  try {
    const menuFinded = await MenuItems.find({
      description: new RegExp(query.q, "i")
    });
    return menuFinded;
  } catch (error) {
    return error;
  }
};

module.exports = { getAll, getOne, create, MenuItems, update, deleteById, search };
