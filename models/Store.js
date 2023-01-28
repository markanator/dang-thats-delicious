const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: 'Please enter a store name!',
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
                default: 'Point',
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
                require: 'you must supply an address!',
            },
        },
        photo: String,
        author: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: 'You must supply an author',
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

storeSchema.index({
    name: 'text',
    description: 'text',
});

storeSchema.index({
    location: '2dsphere',
});

storeSchema.pre('save', async function (next) {
    if (!this.isModified('name')) {
        next(); // skip it
        return; // stop this function from running
    }
    this.slug = slug(this.name);
    // find other stores that have a slug of wes, wes-1, wes-2
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
    if (storesWithSlug.length) {
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    }
    next();
    // TODO make more resiliant so slugs are unique
});

// adding a method : methodName
// proper function for this binding
storeSchema.statics.getTagsList = function () {
    return this.aggregate([
        // deconstruct before we can count
        { $unwind: '$tags' },
        // read each tag and tally how many have used it
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        // sort highest to lowest
        { $sort: { count: -1 } },
    ]);
};

storeSchema.virtual('reviews', {
    ref: 'Review', // what model to link
    localField: '_id', // which field on THIS table
    foreignField: 'store', // which field on OTHER table
});

storeSchema.statics.getTopStores = function () {
    return this.aggregate([
        // look up stores and populate reviews
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'store',
                as: 'reviews',
            },
        },
        // filter for only items that have 2 or more reviews
        {
            $match: {
                'reviews.1': { $exists: true },
            },
        },
        // Add the avg reviews field
        {
            $project: {
                photo: '$$ROOT.photo',
                name: '$$ROOT.name',
                reviews: '$$ROOT.reviews',
                slug: '$$ROOT.slug',
                averageRating: { $avg: '$reviews.rating' },
            },
        },
        // sort it by new field, highest reviews first
        {
            $sort: {
                averageRating: -1,
            },
        },
        // Limit to at most 10
        { $limit: 10 },
    ]);
};

function autoPopulate(next) {
    this.populate('reviews');
    next();
}

storeSchema.pre('find', autoPopulate);
storeSchema.pre('findOne', autoPopulate);

module.exports = mongoose.model('Store', storeSchema);
