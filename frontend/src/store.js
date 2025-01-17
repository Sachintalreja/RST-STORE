import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { cartReducers } from './reducers/cartReducers';
import {
	orderCreateReducer,
	orderDeliverReducer,
	orderDetailsReducer,
	orderListReducer,
	orderMyListReducer,
	orderPayReducer,
} from './reducers/orderReducer';
import {
	productCreateReducer,
	productDeleteReducer,
	productDetailsReducer,
	productListReducer,
	productReviewCreateReducer,
	productUpdateReducer,
} from './reducers/productReducers';
import {
	getUserByIdReducer,
	userDeleteReducer,
	userDetailsReducer,
	userListReducer,
	userLoginReducer,
	userRegisterReducer,
	userUpdateProfileReducer,
	userUpdateReducer,

} from './reducers/userReducer';
import { getUserById } from './actions/userActions';

const reducer = combineReducers({
	productList: productListReducer,
	productDetails: productDetailsReducer,
	productDelete: productDeleteReducer,
	productCreate: productCreateReducer,
	productUpdate: productUpdateReducer,
	productReviewCreate: productReviewCreateReducer,
	cart: cartReducers,
	userLogin: userLoginReducer,
	userRegister: userRegisterReducer,
	userDetails: userDetailsReducer,
	getUserById:getUserByIdReducer,
	userUpdateProfile: userUpdateProfileReducer,
	userList: userListReducer,
	userDelete: userDeleteReducer,
	userUpdate: userUpdateReducer,
	orderCreate: orderCreateReducer,
	orderDetails: orderDetailsReducer,
	orderPay: orderPayReducer,
	orderMyList: orderMyListReducer,
	orderList: orderListReducer,
	orderDeliver: orderDeliverReducer,
});

const cartItemsFromStorage = localStorage.getItem('cartItems')
	? JSON.parse(localStorage.getItem('cartItems'))
	: [];

const userInfoFromStorage = localStorage.getItem('userInfo')
	? JSON.parse(localStorage.getItem('userInfo'))
	: null;

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
	? JSON.parse(localStorage.getItem('shippingAddress'))
	: {};

const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
	? JSON.parse(localStorage.getItem('paymentMethod'))
	: 'paypal';

const initialState = {
	cart: {
		cartItems: cartItemsFromStorage,
		shippingAddress: shippingAddressFromStorage,
		paymentMethod: paymentMethodFromStorage,
	},
	userLogin: { userInfo: userInfoFromStorage },
};

const middlewares = [thunk];

const store = createStore(
	reducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middlewares))
);

export default store;
