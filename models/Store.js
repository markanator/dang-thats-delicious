const mongoose = require("mongoose");
const { glob } = require("glob");
mongoose.Promise = global.Promise;
const slug = require("slugs");

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: "Please enter a store name!",
    },
    slug: String,
    description: {
        type: String,
        trim: true,
    },
    tags: [String],
    created: {
        type: Date,
        default: Date.now,
    },
    location: {
        type: {
            type: String,
            default: "Point",
        },
        coordinates: [
            {
                type: Number,
                require: "You must supply coordinates!"
                // prettier-ignore
            },
            // prettier-ignore
        ],
        address: {
            type: String,
            require: "you must supply an address!",
        },
    },
});

storeSchema.pre("save", function (next) {
    if (!this.isModified("name")) {
        next(); // skip it
        return; // stop this function from running
    }

    this.slug = slug(this.name);
    next();
    // TODO make more resilient so lugs are unique
});

module.exports = mongoose.model("Store", storeSchema);
