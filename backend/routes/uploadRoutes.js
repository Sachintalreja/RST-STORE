import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, 'uploads');
	},
	filename(req, file, cb) {
		cb(
			null,
			`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
		);
	},
});

function checkFileTypes(file, cb) {
	const fileTypes = /jpeg|jpg|png/;
	const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = fileTypes.test(file.mimetype);

	if (extname && mimetype) {
		return cb(null, true);
	} else {
		cb('Only images are allowed');
	}
}

const upload = multer({
	storage,
	fileFilter: function (req, file, cb) {
		checkFileTypes(file, cb);
	},
});

router.post('/', upload.single('image'), (req, res) => {
	res.send(`/${req.file.path}`);
});

export default router;
