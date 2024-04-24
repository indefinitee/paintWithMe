import React from 'react';
import {
	Navigate,
	RouterProvider,
	createBrowserRouter
} from 'react-router-dom';
import { Canvas } from './components/Canvas';
import { SettingBar } from './components/SettingBar';
import { Toolbar } from './components/Toolbar';
import './styles/app.scss';

const router = createBrowserRouter([
	{
		path: '/:id',
		element: (
			<div className='App'>
				<Toolbar />
				<SettingBar />
				<Canvas />
			</div>
		),
		errorElement: <Navigate to={`/f${(+new Date()).toString(16)}`} />
	}
]);

function AppRoutes() {
	return <RouterProvider router={router} />;
}

export default AppRoutes;
