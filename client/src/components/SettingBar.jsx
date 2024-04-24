import React from 'react';
import toolState from '../store/toolState';
import '../styles/toolbar.scss';

export const SettingBar = () => {
	return (
		<div className='setting-bar'>
			<label htmlFor='line-width' style={{ marginRight: 10, marginLeft: 20 }}>
				Толщина линии
			</label>
			<input
				onChange={e => toolState.setLineWidth(e.target.value)}
				id='line-width'
				type='number'
				defaultValue={1}
				min={1}
				max={50}
			/>
			<label htmlFor='stroke-color'>Цвет обвоодки</label>
			<input
				type='color'
				id={'stroke-color'}
				onChange={e => toolState.setStrokeColor(e.target.value)}
			/>
		</div>
	);
};
