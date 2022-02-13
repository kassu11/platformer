const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const player = {
	x: 0,
	y: 650,
	w: 50,
	h: 50,
	movementLeft: 0,
	movementRight: 0,
	movementBottom: 0,
	extraJumps: 1,
	jump: 0,
	lastOnGround: 0,
}

const shapes = [
	{x: 0, y: 700, w: 500, h: 50},
	{x: -173, y: 750, w: 50, h: 50},
	{x: 300, y: 300, w: 500, h: 50},
	{x: 300, y: 500, w: 100, h: 50},
	{x: 600, y: 500, w: 5, h: 500},
	{x: -400, y: 500, w: 200, h: 30},
	{x: 100, y: 400, w: 50, h: 30},
	{x: 700, y: 800, w: 800, h: 30},
	{x: 700, y: 600, w: 2, h: 2},
	{x: -700, y: 600, w: 50, h: 200},
	{x: -600, y: 650, w: 50, h: 200},
	{x: -600, y: 700, w: 200, h: 50},
	{x: -800, y: 850, w: 200, h: 50},
	{x: -800, y: 650, w: 50, h: 200},
	{x: -800, y: 550, w: 100, h: 50},
	{polygon: [[300, 50], [400, 400], [200, 700], [-100, 800]]},
	{polygon: [[900, 400], [800, 500], [700, 550]]},
	{polygon: [[500, 260], [520, 270], [500, 280]]},
];

function render() {
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	movePlayer();

	ctx.fillStyle = "red";

	const plXOffset = Math.round(innerWidth / 2 - player.w / 2);
	const plYOffset = Math.round(innerHeight / 2 - player.h / 2);
	
	ctx.fillRect(plXOffset, plYOffset, player.w, player.h);

	ctx.fillStyle = "black";
	shapes.forEach(row => {
		if(row.polygon) {
			ctx.fillStyle = playerInsidePolygon(row.polygon) ? "green" : "blue";
			ctx.beginPath();
			row.polygon.forEach(([x, y], i) => {
				// if(i === 0) ctx.moveTo(x - player.x + plXOffset, y - player.y + plYOffset)
				ctx.lineTo(x - player.x + plXOffset, y - player.y + plYOffset);
			});
			ctx.closePath();
			ctx.fill();
		} else {
			ctx.fillRect(row.x - player.x + plXOffset, row.y - player.y + plYOffset, row.w, row.h);
		}
	});

	requestAnimationFrame(render);
}

function movePlayer() {
	if(player.movementBottom >= 15.8) player.movementBottom = 15.8;
	else player.movementBottom += .2;

	const newX = player.x + (player.movementLeft + player.movementRight);
	const newY = player.y + player.movementBottom;

	if(performance.now() - player.lastOnGround > 70) player.onGround = false;

	let törmäysY = false;
	let törmäysX = false;

	let hitX = null;
	let hitY = null;

	shapes.forEach(row => {
		if(row.polygon) {

			return
		};
		if(player.x < (row.x + row.w) && (player.x + player.w) > row.x && newY < (row.y + row.h) && (player.h + newY) > row.y) {
			if(player.y < row.y) {
				if(hitY == null || Math.abs(hitY - player.y) > Math.abs(row.y - player.h - player.y)) hitY = row.y - player.h;
			} else if(hitY == null || Math.abs(hitY - player.y) > Math.abs(row.y + row.h - player.y)) hitY = row.y + row.h;
			Object.assign(player, {onGround: true, movementBottom: 0, jump: player.extraJumps, lastOnGround: performance.now()});
			törmäysY = true;
		} else if(newX < (row.x + row.w) && (newX + player.w) > row.x && player.y < (row.y + row.h) && (player.h + player.y) > row.y) {
			if(player.x < row.x) {
				if(hitX == null || Math.abs(hitX - player.x) > Math.abs(row.x - player.w - player.x)) hitX = row.x - player.w
			} else if(hitX == null || Math.abs(hitX - player.x) > Math.abs(row.x + row.w - player.x)) hitX = row.x + row.w;
			törmäysX = true;
		}
	});
	
	if(!törmäysX) player.x += (player.movementLeft + player.movementRight);
	else player.x = hitX;
	if(!törmäysY) player.y += player.movementBottom;
	else player.y = hitY;

	player.x = Math.round(player.x);
	player.y = Math.round(player.y);
}

window.addEventListener("keydown", e => {
	if(e.code === "KeyD") {
		player.movementLeft = 4;
	} else if(e.code === "KeyA") {
		player.movementRight = -4;
	} else if(e.code === "KeyW" || e.code === "Space") {
		if(player.onGround) player.movementBottom = -10;
		else if(player.jump-- > 0) player.movementBottom = -10;
		player.onGround = false;
	}
});

window.addEventListener("keyup", e => {
	if(e.code === "KeyD") {
		player.movementLeft = 0;
	} else if(e.code === "KeyA") {
		player.movementRight = 0;
	}
})

render();

function pointInsidePolygon(point, polygon) {
	const length = polygon.length;
	const [x, y] = point;
	let count = 0;

	for(let i = 0; i < length; i++) {
		const [x1, y1] = polygon.at(i);
		const [x2, y2] = polygon.at(i-1);
		if(y < y1 != y < y2 && x < (x2-x1) * (y-y1) / (y2-y1) + x1) count++;
	} return count % 2 !== 0;
}

function playerInsidePolygon(polygon) {
	const playerP = [
		[player.x, player.y], 
		[player.x + player.w, player.y], 
		[player.x, player.y + player.h], 
		[player.x + player.w, player.y + player.h]
	];

	for(let i = 0; i < playerP.length; i++) {
		const a = playerP.at(i);
		const b = playerP.at(i-1);
		for(let j = 0; j < polygon.length; j++) {
			const c = polygon.at(j);
			const d = polygon.at(j-1);

			if(doIntersect({x: a[0], y:a[1]},{x: b[0], y:b[1]}, {x: c[0], y:c[1]}, {x: d[0], y:d[1]})) return true;
		}
	};

	return pointInsidePolygon([player.x, player.y], polygon) ||
	pointInsidePolygon([player.x + player.w, player.y], polygon) ||
	pointInsidePolygon([player.x, player.y + player.h], polygon) ||
	pointInsidePolygon([player.x + player.w, player.y + player.h], polygon);
}

function onSegment(p, q, r) {
	if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) {
		return true;
	} return false;
}
 
function orientation(p, q, r) {
	const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
	if(val == 0) return 0;
	return (val > 0) ? 1 : 2;
}

function doIntersect(p1, q1, p2, q2) {
	const o1 = orientation(p1, q1, p2);
	const o2 = orientation(p1, q1, q2);
	const o3 = orientation(p2, q2, p1);
	const o4 = orientation(p2, q2, q1);
	
	if(o1 != o2 && o3 != o4) return true;
	if(o1 == 0 && onSegment(p1, p2, q1)) return true;
	if(o2 == 0 && onSegment(p1, q2, q1)) return true;
	if(o3 == 0 && onSegment(p2, p1, q2)) return true;
	if(o4 == 0 && onSegment(p2, q1, q2)) return true;
	return false; 
}