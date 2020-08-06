const mongoose = require("mongoose");
const Store = mongoose.model("Store");

exports.homePage = (req, res) => {
    // console.log(req.name);
    res.render("index");
};

exports.addStore = (req, res) => {
    res.render("editStore", {
        title: "Add Store",
    });
};

exports.createStore = async (req, res) => {
    // create a var to pass req into schema
    // connect to DB and await for response
    // immediately save to gain access to values
    // prettier-ignore
    const store = await (new Store(req.body)).save();
    // notify user that store was created
    req.flash(
        "success",
        `Successfully Created ${store.name}. Care to leave a review?`
    );
    // push user to store page
    res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
    // 1. Query DB for all stores
    const stores = await Store.find();
    // console.log(stores);
    res.render("stores", { title: "Stores", stores });
};

exports.editStore = async (req, res) => {
    // 1. find store given ID
    const store = await Store.findOne({ _id: req.params.id });
    // console.log(store);
    // 2. confirm they are the owner of the store
    // TODO
    // 3. render out edit form so user can update
    res.render("editStore", { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
    // 1. find and update store
    const store = await Store.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
            new: true, //return new store instead of old one
            runValidators: true, // force model to run required validators
        }
    ).exec();
    req.flash(
        "success",
        `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store</a>`
    );
    res.redirect(`/stores/${store._id}/edit`);
    // 2. redirect to store and notify them that it worked!
};
