import Order from '../models/orderModel.js';

/**
 * @desc		Create new order
 * @router	POST /api/orders
 * @access	private
 */
const createOrder = async (req, res) => {
	const {
		orderItems,
		shippingAddress,
		paymentMethod,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
	} = req.body;

	if (orderItems && orderItems.length === 0) {
		res.status(400);
		throw new Error('No order items');
	} else {
		const order = new Order({
			orderItems,
			user: req.user._id,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			taxPrice,
			shippingPrice,
			totalPrice,
		});

		const createdOrder = await order.save();
		res.status(201).json(createdOrder);
	}
};

/**
 * @desc		Get order by ID
 * @router	GET /api/orders/:id
 * @access	private
 */
const getOrderById = async (req, res) => {
	const order = await Order.findById(req.params.id).populate(
		'user',
		'name email'
	);

	if (order) {
		res.json(order);
	} else {
		res.status(404);
		throw new Error('Order not found');
	}
};

/**
 * @desc		Update order to paid
 * @router	PUT /api/orders/:id/pay
 * @access	private
 */
const updateOrderToPaid = async (req, res) => {
	const order = await Order.findById(req.params.id);

	if (order) {
		order.isPaid = true;
		order.paidAt = Date.now();
		order.paymentResult = {
			id: req.body.id,
			state: req.body.state,
			update_time: req.body.update_time,
			email_address: req.body.email_address,
		};

		const updatedOrder = await order.save();
		res.json(updatedOrder);
	} else {
		res.status(404);
		throw new Error('Order not found');
	}
};

/**
 * @desc		Get logged in user's orders
 * @router	GET /api/orders/myorders
 * @access	private
 */
const getMyOrders = async (req, res) => {
	const orders = await Order.find({ user: req.user._id });
	res.json(orders);
};

/**
 * @desc		Get all orders
 * @router	GET /api/orders
 * @access	private/admin
 */
const getOrders = async (req, res) => {
	const orders = await Order.find({}).populate('user', 'name');
	res.json(orders);
};

/**
 * @desc		Update order to delivered
 * @router	PUT /api/orders/:id
 * @access	private/admin
 */
const updateOrderToDelivered = async (req, res) => {
	const order = await Order.findById(req.params.id);

	if (order) {
		order.isDelivered = true;
		order.deliveredAt = Date.now();

		const updatedOrder = await order.save();
		res.json(updatedOrder);
	} else {
		res.status(404);
		throw new Error('Order not found');
	}
};

export {
	createOrder,
	getMyOrders,
	getOrderById,
	getOrders,
	updateOrderToDelivered,
	updateOrderToPaid,
};
