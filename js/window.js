window.onload = (() => {
	let homeWindowElem = document.getElementById('home-window');
	let winprop = {
		width: (parseInt(window.innerWidth * 0.8)) + "px",
		height: (parseInt(window.innerHeight * 0.9)) + "px",
		top: (parseInt(window.innerHeight * 0.05)) + "px",
		left: (parseInt(window.innerWidth * 0.10)) + "px"
	};

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
			if (selectedSnapArea != 'r')
				showSnapArea(snapAreaElem, 'r');

			selectedSnapArea = 'r';
			return;
		}
		else if (pos0.x <= window.innerWidth * (0.1)) {
			if (selectedSnapArea != 'l')
				showSnapArea(snapAreaElem, 'l');

			selectedSnapArea = 'l';
			return;
		}
		else if (pos0.y <= window.innerHeight * (0.04)) {
			if (selectedSnapArea != 't')
				showSnapArea(snapAreaElem, 't');

			selectedSnapArea = 't';
			return;
		}
		else {
			hideSnapArea(snapAreaElem);
			selectedSnapArea = null;
			snapAreaKeyframes = [];
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

var snapAreaKeyframes = [];

function showSnapArea(areaElement, where) {
	areaElement.style.display = 'block';

	if (snapAreaKeyframes.length > 1)
		snapAreaKeyframes.pop(0);

	switch(where) {
		case 't':
			if (snapAreaKeyframes.length == 0) {
				snapAreaKeyframes.push({
					top: "0%",
					left: "50%",
					width: "0%",
					height: "0%"
				});
			}

			snapAreaKeyframes.push({
				top: "0%",
				left: "0%",
				width: "100%",
				height: "100%"
			});
			break;
		case 'r':
			if (snapAreaKeyframes.length == 0) {
				snapAreaKeyframes.push({
					top: "50%",
					right: "0%",
					left: "100%",
					width: "0%",
					height: "0%"
				});
			}

			snapAreaKeyframes.push({
				top: "0%",
				right: "0%",
				left: "auto",
				width: "20%",
				height: "100%"
			});
			break;
		case 'l':
			if (snapAreaKeyframes.length == 0) {
				snapAreaKeyframes.push({
					top: "50%",
					left: "0%",
					right: "100%",
					width: "0%",
					height: "0%"
				});
			}

			snapAreaKeyframes.push({
				top: "0%",
				left: "0%",
				right: "auto",
				width: "20%",
				height: "100%"
			});
			break;
	}

	anim = areaElement.animate(snapAreaKeyframes, 300);
	anim.addEventListener("finish", () => {
		let lastFrame = snapAreaKeyframes.at(-1);
		if (lastFrame) {
			areaElement.style.top = lastFrame.top;
			areaElement.style.left = lastFrame.left;
			areaElement.style.right = lastFrame.right;
			areaElement.style.width = lastFrame.width;
			areaElement.style.height = lastFrame.height;
		}
	});
};

function hideSnapArea(areaElement) {
	areaElement.style.display = 'none';
};

function animateWindowSnap(windowObj, finalShape, duration, fs) {
	var currProps = windowObj.properties;

	let snapKeyfs = [
		{
			top: currProps.top,
			left: currProps.left,
			width: currProps.width,
			height: currProps.height,

			easing: "ease-out"
		},
		{
			top: finalShape.top + "px",
			left: finalShape.left + "px",
			width: finalShape.width + "px",
			height: finalShape.height + "px",

			easing: "ease-in"
		}
	];

	windowObj.setAnimation(snapKeyfs, duration, (winObj) => {
		winObj.position = {
			x: finalShape.left,
			y: finalShape.top
		};

		winObj.size = {
			x: finalShape.width,
			y: finalShape.height
		};

		if (fs)
			winObj.state = "fullscreen";
		else
			winObj.state = "windowed";
	});
} 

function snapWindowTo(windowObj, whereTo) {
	let finalShape = null;
	let fullscreen = whereTo == 't';

	switch(whereTo) {
		case 't':
			finalShape = {
				width: parseInt(0.98*window.innerWidth),
				height: parseInt(0.98*window.innerHeight),
				left: parseInt(window.innerWidth * 0.005),
				top: 0
			};
			break;
		case 'r':
			finalShape = {
				width: parseInt(0.49*window.innerWidth),
				height: parseInt(0.98*window.innerHeight),
				left: parseInt(window.innerWidth / 2),
				top: 0
			};
			break;
		case 'l':
			finalShape = {
				width: parseInt(0.5*window.innerWidth),
				height: parseInt(0.98*window.innerHeight),
				left: 0,
				top: 0
			};
	}

	animateWindowSnap(windowObj, finalShape, 230, fullscreen);
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
