import { makeAutoObservable } from 'mobx';

class CanvasState {
	canvas = null;
	socket = null;
	sessionid = null;
	undoList = [];
	redoList = [];
	username = '';

	constructor() {
		makeAutoObservable(this);
	}

	setSessionId(id) {
		this.sessionid = id;
	}

	setSocket(socket) {
		this.socket = socket;
	}

	setUsername(username) {
		this.username = username;
	}

	setCanvas(canvas) {
		this.canvas = canvas;
	}

	pushToUndo(elem) {
		this.undoList.push(elem);
	}

	pushToRedo(elem) {
		this.redoList.push(elem);
	}

	undo() {
		let ctx = this.canvas.getContext('2d');
		if (this.undoList.length > 0) {
			let dataUrl = this.undoList.pop();
			this.redoList.push(this.canvas.toDataURL());

			let img = new Image();
			img.src = dataUrl;

			img.onload = async function () {
				ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
			}.bind(this);
		} else {
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}

	redo() {
		let ctx = this.canvas.getContext('2d');
		if (this.redoList.length > 0) {
			let dataUrl = this.redoList.pop();
			this.undoList.push(this.canvas.toDataURL());

			let img = new Image();
			img.src = dataUrl;

			img.onload = async function () {
				ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
			}.bind(this);
		}
	}
}

export default new CanvasState();
