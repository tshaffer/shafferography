import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { createStore, applyMiddleware } from 'redux';

import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { rootReducer } from './models';

import { composeWithDevTools } from 'redux-devtools-extension';
import { initializeDiagnostics } from './utilities';

import './index.css'
import App from './components/App';

initializeDiagnostics();

export const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(thunkMiddleware)
  ));

const root = createRoot(document.getElementById('root')!);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
      </Routes>
    </BrowserRouter>
  </Provider>,
);

