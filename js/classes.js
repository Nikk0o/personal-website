class ScreenItem {
	constructor(name, obj, properties) {
		this.name = name;
		this.scrObject = obj;
	}

	get object() {
		return this.scrObject;
	}

	get properties() {
		return {
			width: this.scrObject.style.width,
			height: this.scrObject.style.height,
			top: this.scrObject.style.top,
			left: this.scrObject.style.left
		};
	}
}

const Movable = (Base) =>
	class extends Base {
		constructor(name, obj, properties) {
			super(name, obj, properties);

			this.scrObject.style.top = properties.top;
			this.scrObject.style.left = properties.left;
		}

		set position(pos) {
			this.scrObject.style.top = pos.y + "px";
			this.scrObject.style.left = pos.x + "px";
		}

		move(delta) {
			let tp = this.scrObject.style.top.replace('px', ''),
				lf = this.scrObject.style.left.replace('px', '');

			this.scrObject.style.top = (tp - delta.dy) + "px";
			this.scrObject.style.left = (lf - delta.dx) + "px";
		}

		get top() {
			return this.scrObject.style.top.replace('px', '');
		}

		get left() {
			return this.scrObject.style.left.replace('px', '');
		}
	};

const Resizable = (Base) =>
	class extends Base {
		constructor(name, obj, properties) {
			super(name, obj, properties);

			this.scrObject.style.width = properties.width;
			this.scrObject.style.height = properties.height;
		}

		set size(s) {
			this.scrObject.style.width = s.x + "px";
			this.scrObject.style.height = s.y + "px";
		}

		changeSize(delta) {
			let w = this.scrObject.style.width.replace('px', ''),
				h = this.scrObject.style.height.replace('px', '');

			this.scrObject.style.width = (w - delta.dx) + "px";
			this.scrObject.style.height = (h - delta.dy) + "px";
		}

		get width() {
			return this.scrObject.style.width.replace('px', '');
		}

		get height() {
			return this.scrObject.style.height.replace('px', '');
		}
	};

class PseudoWindow extends Movable(Resizable(ScreenItem)) {
	constructor(name, winObj, properties) {
		super(name, winObj, properties);

		this.visible = false;
		this.wState = 'windowed';
		this.lastProps = null;

		winObj.style.display = "none";
	}

	get state() { return this.wState; }

	set state(st) { this.wState = st }

	set	lastProperties(pps) { this.lastProps = pps; }

	get lastProperties() { return this.lastProps; }

	show() {
		if (!this.visible) {
			this.scrObject.style.display = "block";
			this.visible = true;
		}
	}

	hide() {
		if (this.visible) {
			this.scrObject.style.display = "none";
			this.visible = false;
		}
	}

	updateOldProperties() {
		this.lastProps = this.properties;
	}

	restoreOldProperties() {
		this.position = {
			x: this.lastProps.left.replace('px', ''),
			y: this.lastProps.top.replace('px', '')
		};

		this.size = {
			x: this.lastProps.width.replace('px', ''),
			y: this.lastProps.height.replace('px', '')
		};
	}

	onDrag() {
		this.state = 'windowed';
	}

	onResize() {
		this.state = 'windowed';
	}
}
