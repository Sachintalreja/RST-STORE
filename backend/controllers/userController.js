import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc		Auth user
 * @router	POST /api/users/login
 * @access	public
 */
const authUser = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	} else {
		res.status(401);
		throw new Error('Invalid email or password');
	}
};

/**
 * @desc		Get user profile
 * @router	GET /api/users/profile
 * @access	private
 */
const getUserProfile = async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
};

/**
 * @desc		Register new user
 * @router	POST /api/users
 * @access	public
 */
const registerUser = async (req, res) => {
	const { name, email, password } = req.body;

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400); // BAD REQUEST
		throw new Error('User already exists');
	}

	const user = await User.create({ name, email, password });

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error('Invalid user data');
	}
};

/**
 * @desc		Update user profile
 * @router	PUT /api/users/profile
 * @access	private
 */
const updateUserProfile = async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
			token: generateToken(updatedUser._id),
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
};

/**
 * @desc		Get all users
 * @router	GET /api/users
 * @access	private/admin
 */
const getUsers = async (req, res) => {
	const users = await User.find({}).select('-password');
	res.json(users);
};

/**
 * @desc		Delete user
 * @router	DELETE /api/users/:id
 * @access	private/admin
 */
const deleteUser = async (req, res) => {
	const user = await User.findById(req.params.id)
	console.log(user)
	
	if (user.isAdmin){
      res.json({message:'admin cannot be deleted'});
	}
       else if  (user) {
		await User.deleteOne(user);
		res.json({ message: 'User deleted' });
	} else {
		res.status(404);
		throw new Error('User not found');
	}
};

/**
 * @desc		Get user by ID
 * @router	GET /api/users/:id
 * @access	private/admin
 */
const getUserByID = async (req, res) => {
	const user = await User.findById(req.params.id).select('-password');

	if (user) {
		res.json(user);
	} else {
		res.status(404);
		throw new Error('User not found');
	}
};

/**
 * @desc		Update user
 * @router	PUT /api/users/:id
 * @access	private/admin
 */
const updateUser = async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		user.isAdmin = req.body.isAdmin;

		const updatedUser = await user.save();

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
};

export {
	authUser,
	deleteUser,
	getUserByID,
	getUserProfile,
	getUsers,
	registerUser,
	updateUser,
	updateUserProfile,
};
