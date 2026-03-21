window.onload = (() => {
	let homeWindowElem = document.getElementById('home-window');
	let winprop = new PositionProperties(
		(parseInt(window.innerWidth * 0.8)) + "px",
		(parseInt(window.innerHeight * 0.9)) + "px",
		(parseInt(window.innerHeight * 0.05)) + "px",
		(parseInt(window.innerWidth * 0.10)) + "px"
	);

	setupPicture();
	let homeWindow = setupWindow("home-window", false, homeWindowElem, winprop);

	enableDragElement(document.getElementById('top-bar'), homeWindow, document.getElementById('snap-box'));
	enableResizing(
		{
			topLeft: document.getElementById('res-tl'),
			topCenter: document.getElementById('res-tc'),
			topRight: document.getElementById('res-tr'),
			rightCenter: document.getElementById('res-rc'),
			bottomRight: document.getElementById('res-br'),
			bottomCenter: document.getElementById('res-bc'),
			bottomLeft: document.getElementById('res-bl'),
			leftCenter: document.getElementById('res-lc')
		},
		homeWindow
	);

	document.getElementById('top-bar').addEventListener("dblclick",
		() => { toggleFullscreen(homeWindow); });

	homeWindow.show();
});


var windows = [];

// Set pictures

var picIndex = 0;
var pics = [ '' ];

function setDefaultPic(img) {
	img.src = pics[picIndex];
};

function changePic(img) {
	picIndex = (picIndex + 1) % pics.length;
	img.src = pics[picIndex];
};

function setupPicture() {

	let picFrame = document.getElementById('niko-pic');

	let pic = document.getElementById('pic-pic');
	setDefaultPic(pic);

	let picClickable = document.getElementById('highlight');
	picFrame.addEventListener("click", () => { changePic(pic); });
};


// Set window initial position and dimensions

function setupWindow(windowName, fullscreen, element, properties) {
	let state = fullscreen ? 'fullscreen' : 'windowed';

	let win = new PseudoWindow(windowName, element, properties);
	win.state = state;

	windows.push(win);
	return win;
}


// Drag window

var dragging = false;
var selectedSnapArea = null;

function enableDragElement(element, dragTarget, snapAreaElem) {

	// The last position and mouse displacement, in pixels
	let pos0 = {x: 0, y: 0};
	let dpos = {dx: 0, dy: 0};

	element.addEventListener("mousedown", onMouseDown);

	function onMouseDown(ev) {
		ev.preventDefault();

		pos0 = {x: ev.clientX, y: ev.clientY};

		document.addEventListener("mousemove", dragElement);
		document.addEventListener("mouseup", stopDrag);
	}

	function dragElement(ev) {
		dragging = true;
		dragTarget.onDrag();

		dpos = {dx: pos0.x - ev.clientX, dy: pos0.y - ev.clientY};
		pos0 = {x: ev.clientX, y: ev.clientY};

		dragTarget.move(dpos);

		if (pos0.x >= window.innerWidth * (0.9)) {
			showSnapArea(snapAreaElem, 'r');
			selectedSnapArea = 'r';
			return;
		}
		else if (pos0.x <= window.innerWidth * (0.1)) {
			showSnapArea(snapAreaElem, 'l');
			selectedSnapArea = 'l';
			return;
		}
		else if (pos0.y <= window.innerHeight * (0.04)) {
			showSnapArea(snapAreaElem, 't');
			selectedSnapArea = 't';
			return;
		}
		else {
			hideSnapArea(snapAreaElem);
			selectedSnapArea = null;
		}
	}

	function stopDrag() {
		document.removeEventListener("mousemove", dragElement);
		document.removeEventListener("mouseup", stopDrag);
		hideSnapArea(snapAreaElem);

		let targetName = dragTarget.name;
		if (dragging) {
			dragTarget.updateOldProperties();
		}

		dragging = false;

		if (selectedSnapArea) {
			snapWindowTo(dragTarget, selectedSnapArea);
			selectedSnapArea = null;
		}
	}
}


// Enable window snapping

function showSnapArea(areaElement, where) {
	areaElement.style.display = 'block';

	switch(where) {
		case 't':
			areaElement.style.width = '100%';
			areaElement.style.height = '100%';

			areaElement.style.top = '0px';
			areaElement.style.bottom = '';
			break;
		case 'r':
			areaElement.style.width = '20%';
			areaElement.style.height = '100%';

			areaElement.style.right = '0px';
			areaElement.style.left = '';
			break;
		case 'l':
			areaElement.style.width = '20%';
			areaElement.style.height = '100%';

			areaElement.style.right = '';
			areaElement.style.left = '0px';
			break;
	}
};

function hideSnapArea(areaElement) {
	areaElement.style.display = 'none';
};

function snapWindowTo(windowObj, whereTo) {
	switch(whereTo) {
		case 't':
			windowObj.size = {
				x: parseInt(0.98*window.innerWidth),
				y: parseInt(0.98*window.innerHeight)
			};

			windowObj.position = {
				x: parseInt(window.innerWidth * 0.005),
				y: 0
			};

			windowObj.state = 'fullscreen';
			break;
		case 'r':
			windowObj.size = {
				x: parseInt(0.49*window.innerWidth),
				y: parseInt(0.98*window.innerHeight)
			};

			windowObj.position = {
				x: parseInt(window.innerWidth / 2),
				y: 0
			};
			break;
		case 'l':
			windowObj.size = {
				x: parseInt(0.5*window.innerWidth),
				y: parseInt(0.98*window.innerHeight)
			};

			windowObj.position = {
				x: 0,
				y: 0
			};
	}
};

function toggleFullscreen(winObj) {
	if (winObj.state == 'windowed') {
		winObj.updateOldProperties();
		snapWindowTo(winObj, 't');
	}
	else if (winObj.state == 'fullscreen'){
		winObj.restoreOldProperties();
		winObj.state = 'windowed';
	}
}


// Resize window with cursor

function enableResizing(elements, resizeTarget) {

	let pos0 = null, dpos = null;

	elements.topLeft.addEventListener("mousedown", ((ev) => onMouseDown('tl', ev)));
	elements.topCenter.addEventListener("mousedown", ((ev) => onMouseDown('tc', ev)));
	elements.topRight.addEventListener("mousedown", ((ev) => onMouseDown('tr', ev)));
	elements.rightCenter.addEventListener("mousedown", ((ev) => onMouseDown('rc', ev)));
	elements.bottomRight.addEventListener("mousedown", ((ev) => onMouseDown('br', ev)));
	elements.bottomCenter.addEventListener("mousedown", ((ev) => onMouseDown('bc', ev)));
	elements.bottomLeft.addEventListener("mousedown", ((ev) => onMouseDown('bl', ev)));
	elements.leftCenter.addEventListener("mousedown", ((ev) => onMouseDown('lc', ev)));

	function onMouseDown(direction, ev) {
		ev.preventDefault();

		pos0 = { x: ev.clientX, y: ev.clientY };
		dpos = { dx: 0, dy: 0};

		document.addEventListener("mousemove", updateMousePos);

		switch(direction) {
			case 'tl':
				document.addEventListener("mousemove", resizeFromLeftSide);
				document.addEventListener("mousemove", resizeFromTopSide);
				break;
			case 'tc':
				document.addEventListener("mousemove", resizeFromTopSide);
				break;
			case 'tr':
				document.addEventListener("mousemove", resizeFromRightSide);
				document.addEventListener("mousemove", resizeFromTopSide);
				break;
			case 'rc':
				document.addEventListener("mousemove", resizeFromRightSide);
				break;
			case 'br':
				document.addEventListener("mousemove", resizeFromRightSide);
				document.addEventListener("mousemove", resizeFromBottomSide);
				break;
			case 'bc':
				document.addEventListener("mousemove", resizeFromBottomSide);
				break;
			case 'bl':
				document.addEventListener("mousemove", resizeFromLeftSide);
				document.addEventListener("mousemove", resizeFromBottomSide);
				break;
			case 'lc':
				document.addEventListener("mousemove", resizeFromLeftSide);
		}

		document.addEventListener("mouseup", onMouseUp);
	}

	function updateMousePos(ev) {
		dpos = { dx: pos0.x - ev.clientX, dy: pos0.y - ev.clientY };
		pos0 = { x: ev.clientX, y: ev.clientY };

		resizeTarget.onResize();
	}

	function changeWidth(invert) {
		resizeTarget.changeSize({dx: invert ? -dpos.dx : dpos.dx, dy: 0});
	}

	function changeHeight(invert) {
		resizeTarget.changeSize({dx: 0, dy: invert ? -dpos.dy : dpos.dy});
	}

	function resizeFromLeftSide() {
		resizeTarget.move({dx: dpos.dx, dy: 0});
		changeWidth(true);
	}

	function resizeFromRightSide() {
		changeWidth(false);
	}

	function resizeFromTopSide() {
		resizeTarget.move({dx: 0, dy: dpos.dy});
		changeHeight(true);
	}

	function resizeFromBottomSide() {
		changeHeight(false);
	}

	function onMouseUp() {
		document.removeEventListener("mousemove", updateMousePos);
		document.removeEventListener("mousemove", resizeFromTopSide);
		document.removeEventListener("mousemove", resizeFromRightSide);
		document.removeEventListener("mousemove", resizeFromBottomSide);
		document.removeEventListener("mousemove", resizeFromLeftSide);

		document.removeEventListener("mouseup", onMouseUp);
	}
};
