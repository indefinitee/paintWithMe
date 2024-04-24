import Tool from './Tool';

export default class Circle extends Tool {
	constructor(canvas) {
		super(canvas);
		this.listen();
	}

	listen() {
		this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
		this.canvas.onmousedown = this.mouseDownHandler.bind(this);
		this.canvas.onmouseup = this.mouseUpHandler.bind(this);
	}

	mouseUpHandler(e) {
		this.mouseDown = false;
	}
	mouseDownHandler(e) {
		this.mouseDown = true;
		this.ctx.beginPath();
		this.startX = e.pageX - e.target.offsetLeft;
		this.startY = e.pageY - e.target.offsetTop;
		this.saved = this.canvas.toDataURL();
	}

	mouseMoveHandler(e) {
		if (this.mouseDown) {
			let currentX = e.pageX - e.target.offsetLeft;
			let currentY = e.pageY - e.target.offsetTop;
			let width = currentX - this.startX;
			let height = currentY - this.startY;
			this.draw(this.startX, this.startY, width, height);
		}
	}

	draw(x, y, w, h) {
		const img = new Image();
		img.src = this.saved;
		let r = Math.sqrt(w ** 2 + h ** 2);
		img.onload = async function () {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
			this.ctx.beginPath();
			this.ctx.arc(x, y, r, 0, 2 * Math.PI);
			this.ctx.fill();
			this.ctx.stroke();
		}.bind(this);
	}
}
