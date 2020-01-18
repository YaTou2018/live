import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';
import createRootReducer from '@global/reducers';

const epicMiddleware = createEpicMiddleware();

const middleware = applyMiddleware(epicMiddleware, thunkMiddleware);

const store = createStore(createRootReducer(), composeWithDevTools(middleware));

export default store;
