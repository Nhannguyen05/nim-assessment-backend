const mongoose = require("../db.js");

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  items: [
    {
      item: {
        type: mongoose.Schema.ObjectId,
        ref: "MenuItems"
      },

      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  status: {
    type: String,
    required: true,
    enum: ["pending", "confirmed", "delivered", "cancelled"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
orderSchema.set("toJSON", {
  virtuals: true
});
orderSchema.statics.calcTotal = (items) =>
  items.reduce((total, item) => total + item.item.price * item.quantity, 0);

// order model
const Order = mongoose.model("Order", orderSchema);

const getAll = async () => {
  // populate each item
  const orders = await Order.find().populate("items.item");

  return orders;
};

const getOne = async (id) => {
  const order = await Order.findById(id).populate("items.item");
  return order;
};

const create = async (body) => {
  const order = await Order.create(body);
  return order;
};

const update = async (id, body) => {
  const order = await Order.findByIdAndUpdate(id, body, { new: true });
  return order;
};

const remove = async (id) => {
  const order = await Order.findByIdAndDelete(id);
  return order.id;
};

const getByStatus = async (status, startDate, endDate) => {
  const orders = await Order.find({ status })
    .populate("items")
    .where("createdAt")
    .gte(startDate)
    .lte(endDate);

  return orders;
};

const getTotalSales = async (startDate, endDate) => {
  const orders = await Order.find({ status: "delivered" })
    .populate("items.item")
    .where("createdAt")
    .gte(startDate)
    .lte(endDate);

  const totalSales = orders.reduce((initialVal, order) => {
    const orderPrice = Order.calcTotal(order.items);
    console.log("orderPrice", orderPrice);
    return orderPrice + initialVal;
  }, 0);
  console.log("total", totalSales);
  return totalSales;
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
  getTotalSales,
  getByStatus,
  Order
};
