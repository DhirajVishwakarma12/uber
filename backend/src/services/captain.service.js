const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({
	firstName,
	lastName,
	email,
	password,
	color,
	plate,
	capacity,
	vehicleType,
}) => {
	if (
		!firstName ||
		!email ||
		!password ||
		!color ||
		!plate ||
		capacity == null ||
		!vehicleType
	) {
		throw new Error('All fields are required');
	}

	return captainModel.create({
		fullName: {
			firstName,
			lastName,
		},
		email,
		password,
		vehicle: {
			color,
			plate,
			capacity,
			vehicleType,
		},
	});
};

module.exports.isCaptainExits = async (email) => {
	if (!email) {
		throw new Error('Email is required');
	}

	return captainModel.findOne({ email }).select('+password');
};
