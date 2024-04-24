import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import axios from 'axios';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import '../styles/canvas.scss';
import Brush from '../tools/Brush';
import Rect from '../tools/Rect';

export const Canvas = observer(() => {
	const canvasRef = useRef();
	const usernameRef = useRef();
	const [show, setShow] = useState(true);
	const params = useParams();

	useEffect(() => {
		canvasState.setCanvas(canvasRef.current);
		let ctx = canvasRef.current.getContext('2d');
		axios.get(`http://localhost:5012/image?id=${params.id}`).then(response => {
			const img = new Image();
			img.src = response.data;
			img.onload = () => {
				ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
				ctx.drawImage(
					img,
					0,
					0,
					canvasRef.current.width,
					canvasRef.current.height
				);
			};
		});
	}, []);

	useEffect(() => {
		if (canvasState.username) {
			const socket = new WebSocket(`ws://localhost:5012/`);

			canvasState.setSocket(socket);
			canvasState.setSessionId(params.id);

			toolState.setTool(new Brush(canvasRef.current, socket, params.id));

			socket.onopen = () => {
				console.log('Подключение установлено');
				socket.send(
					JSON.stringify({
						id: params.id,
						username: canvasState.username,
						method: 'connection'
					})
				);
			};

			socket.onmessage = event => {
				let msg = JSON.parse(event.data);

				switch (msg.method) {
					case 'connection':
						console.log(`Пользователь ${msg.username} подключился`);
						break;
					case 'draw':
						drawHandler(msg);
						break;
				}
			};
		}
	}, [canvasState.username]);

	const drawHandler = msg => {
		const figure = msg.figure;
		const ctx = canvasRef.current.getContext('2d');
		switch (figure.type) {
			case 'brush':
				Brush.draw(ctx, figure.x, figure.y);
				break;
			case 'rect':
				Rect.staticDraw(
					ctx,
					figure.x,
					figure.y,
					figure.width,
					figure.height,
					figure.color
				);
				break;
			case 'finish':
				ctx.beginPath();
				break;
		}
	};

	const mouseDownHandler = () => {
		canvasState.pushToUndo(canvasRef.current.toDataURL());
		axios
			.post(`http://localhost:5012/image?id=${params.id}`, {
				img: canvasRef.current.toDataURL()
			})
			.then(response => console.log(response.data));
	};

	const connectHandler = () => {
		canvasState.setUsername(usernameRef.current.value);
		setShow(false);
	};

	return (
		<div className='canvas'>
			<Modal show={show} onHide={() => setShow(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Введите ваше имя</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<input type='text' ref={usernameRef} />
				</Modal.Body>
				<Modal.Footer>
					<Button variant='primary' onClick={() => connectHandler()}>
						Войти
					</Button>
				</Modal.Footer>
			</Modal>
			<canvas
				onMouseDown={() => mouseDownHandler()}
				ref={canvasRef}
				width={800}
				height={600}
			></canvas>
		</div>
	);
});
