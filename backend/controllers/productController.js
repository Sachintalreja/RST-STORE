import Product from '../models/productModel.js';

/**
 * @desc		Get all products
 * @router	GET /api/products
 * @access	public
 */
const getProducts = async (req, res) => {
	const products = await Product.find({});
	res.json(products);
};

/**
 * @desc		Get single products
 * @router	GET /api/products/:id
 * @access	public
 */
const getProductById = async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (product) {
		res.json(product);
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
};

/**
 * @desc		Delete a product
 * @router	DELETE /api/products/:id
 * @access	private/admin
 */
const deleteProduct = async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (product) {
		await Product.deleteOne(product);
		res.json({ message: 'Product deleted' });
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
};

/**
 * @desc		Create a product
 * @router	POST /api/products
 * @access	private/admin
 */
const createProduct = async (req, res) => {
	const product = new Product({
		name: 'Sample product',
		price: 0,
		user: req.user._id,
		image: '/images/sample.jpg',
		brand: 'Sample brand',
		category: 'Sample category',
		countInStock: 0,
		numReviews: 0,
		description: 'Sample description',
	});

	const createdProduct = await product.save();
	res.status(201).json(createdProduct);
};

/**
 * @desc		Update a product
 * @router	PUT /api/products/:id
 * @access	private/admin
 */
const updateProduct = async (req, res) => {
	const { name, price, description, image, brand, category, countInStock } =
		req.body;

	const product = await Product.findById(req.params.id);

	if (product) {
		product.name = name;
		product.price = price;
		product.description = description;
		product.image = image;
		product.brand = brand;
		product.category = category;
		product.countInStock = countInStock;

		const updatedProduct = await product.save();
		res.json(updatedProduct);
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
};

/**
 * @desc		Create new review
 * @router	POST /api/products/:id/reviews
 * @access	private
 */
const createProductReview = async (req, res) => {
	const { rating, comment } = req.body;

	const product = await Product.findById(req.params.id);

	if (product) {
		const alreadyReviewed = product.reviews.find(
			(review) => review.user.toString() === req.user._id.toString()
		);

		if (alreadyReviewed) {
			res.status(400);
			throw new Error('Product already reviewed');
		}

		const review = {
			name: req.user.name,
			rating: +rating,
			comment,
			user: req.user._id,
		};

		product.reviews.push(review);
		product.numReviews = product.reviews.length;

		product.rating =
			product.reviews.reduce((acc, currVal) => currVal.rating + acc, 0) /
			product.reviews.length;

		await product.save();
		res.status(201).json({ message: 'Review added' });
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
};

export {
	createProduct,
	createProductReview,
	deleteProduct,
	getProductById,
	getProducts,
	updateProduct,
};
