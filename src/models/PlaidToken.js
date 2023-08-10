const mongoose = require("mongoose");

const plaidTokenSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	accessToken: { type: String, required: true },
	institution: { type: String },
});

plaidTokenSchema.statics.createOrUpdate = function (query, update, options) {
	return this.findOne(query)
		.exec()
		.then((doc) => {
			if (!doc) {
				return this.create(update);
			}

			return doc
				.update(update, options)
				.exec()
				.then(() => this.findOne(query).exec());
		});
};

const PlaidToken = mongoose.model("PlaidToken", plaidTokenSchema);

module.exports = PlaidToken;
