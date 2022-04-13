const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const player = {
	x: 100,
	y: 350,
	w: 50,
	h: 50,
	movementLeft: 0,
	movementRight: 0,
	movementBottom: 0,
	extraJumps: Infinity,
	jump: 0,
	lastOnGround: 0,
}

const shapes = [
	{x: -100, y: 600, w: 600, h: 50},
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
	{polygon: [[300, 600], [300, 300], [0, 600]]},
	{polygon: [[1000, 0], [1000, -200], [0, 0]]},
	{polygon: [[1000, 0], [1000, -600], [500, 0]]},
	{polygon: [[1000, 0], [1000, -600], [2000, -5000]]},
	// {polygon: [[900, 400], [800, 500], [700, 550]]},
	// {polygon: [[400, 260], [420, 270], [400, 280]]},
];

// shapes.push(...[...Array(50000)].map(_ => {
// 	const startX = random(-20000, 20000);
// 	const startY = random(-20000, 20000);
	
// 	return {polygon: [...Array(random(3, 4))].map(_ => {
// 		return [startX + random(-200, 200), startY + random(-200, 200)];
// 	})}
// }));

shapes.forEach(row => {
	row.polygon?.forEach(([x, y]) => {
		if(row.minX > x || row.minX == null) row.minX = x;
		if(row.maxX < x || row.maxX == null) row.maxX = x;
		if(row.minY > y || row.minY == null) row.minY = y;
		if(row.maxY < y || row.maxY == null) row.maxY = y;
	});
});

function render() {
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	movePlayer();

	ctx.fillStyle = "red";

	const plXOffset = Math.round(innerWidth / 2 - player.w / 2);
	const plYOffset = Math.round(innerHeight / 2 - player.h / 2);
	
	ctx.fillRect(plXOffset, plYOffset, player.w, player.h);

	// console.log(plYOffset)

	ctx.fillStyle = "black";
	shapes.forEach(row => {
		if(row.polygon) {
			if(row.maxX < player.x - plXOffset) return false;
			if(row.minX > player.x + player.w + plXOffset) return false;
			if(row.maxY < player.y - plYOffset) return false;
			if(row.minY > player.y + player.h + plYOffset) return false;
			// ctx.fillStyle = playerInsidePolygon(row) ? "green" : "blue";
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

	let polygo = 0;

	shapes.forEach(row => {
		if(row.polygon && playerInsidePolygon(row, newX, newY)) {
			polygo++;
			// if(playerInsidePolygon(row, player.x, newY)) {
			// 	törmäysY = true;
			// 	hitY = player.y;
			// } else if(playerInsidePolygon(row, newX, player.y)) {
			// 	törmäysX = true;
			// 	hitX = player.x;
			// }
			const kulmaA = closestLineSlopeAngle([newX + player.w, player.y + player.h], row.polygon);
			const kulmaB = closestLineSlopeAngle([player.x + player.w, player.y + player.h], row.polygon);
			const kulmaC = closestLineSlopeAngle([newX + player.w, newY + player.h], row.polygon);
			const kulmaD = closestLineSlopeAngle([player.x + player.w, newY + player.h], row.polygon);

			// console.log(kulmaB, kulmaA)

			if(kulmaA < -1 || kulmaB < -1 || kulmaC < -1 || kulmaD < -1) {
				console.log(kulmaA, kulmaB)
				const newClosest = closestXCollision([player.x + player.w, player.y + player.h], row.polygon);
				const oldClosest = closestXCollision([player.x + player.w, newY + player.h], row.polygon);
				törmäysX = true;
				// player.movementBottom = 0;
				const minHitX = Math.min(newClosest, oldClosest);
				if(hitX == null || Math.abs(player.x - hitX) < Math.abs(player.x - minHitX)) hitX = minHitX;
			} else {
				console.log("stop",kulmaA, kulmaB)
				const newClosest = closestLineToPoint([newX + player.w, player.y + player.h], row.polygon);
				const oldClosest = closestLineToPoint([player.x + player.w, player.y + player.h], row.polygon);
				törmäysY = true;
				player.movementBottom = 0;
				hitY = Math.min(newClosest, oldClosest);
			}


			return
		}
		else if(player.x < (row.x + row.w) && (player.x + player.w) > row.x && newY < (row.y + row.h) && (player.h + newY) > row.y) {
			if(player.y < row.y) {
				if(hitY == null || Math.abs(hitY - player.y) > Math.abs(row.y - player.h - player.y)) {
					hitY = row.y - player.h;
					Object.assign(player, {onGround: true, jump: player.extraJumps, lastOnGround: performance.now()});
				}
			} else if(hitY == null || Math.abs(hitY - player.y) > Math.abs(row.y + row.h - player.y)) hitY = row.y + row.h;
			player.movementBottom = 0;
			törmäysY = true;
		} else if(newX < (row.x + row.w) && (newX + player.w) > row.x && player.y < (row.y + row.h) && (player.h + player.y) > row.y) {
			if(player.x < row.x) {
				if(hitX == null || Math.abs(hitX - player.x) > Math.abs(row.x - player.w - player.x)) hitX = row.x - player.w
			} else if(hitX == null || Math.abs(hitX - player.x) > Math.abs(row.x + row.w - player.x)) hitX = row.x + row.w;
			törmäysX = true;
		}
	});

	// console.log(polygo)
	
	if(!törmäysX) player.x += (player.movementLeft + player.movementRight);
	else player.x = hitX;
	if(!törmäysY) player.y += player.movementBottom;
	else player.y = hitY;

	player.x = Math.round(player.x);
	player.y = Math.round(player.y);

	// console.log(closestLineToPoint([player.x + player.w, player.y + player.h], shapes[15].polygon))
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

function random(a = 0, b = 1) {
	return Math.round(Math.random() * (a - b) + b);
}

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

function closestLineToPoint(point, polygon) {
	const length = polygon.length;
	const [x, y] = point;
	let count = 0;
	let minTop = null;

	for(let i = 0; i < length; i++) {
		const [x1, y1] = polygon.at(i);
		const [x2, y2] = polygon.at(i-1);
		// if(y < y1 != y < y2 && x < (x2-x1) * (y-y1) / (y2-y1) + x1) { // Left
		// 	// console.log(x, (x2-x1))
		// 	// console.log(x, (x2-x1) * (y-y1))
		// 	// console.log(x, (x2-x1) * (y-y1) / (y2-y1))
		// 	console.log((x2-x1) * (y-y1) / (y2-y1) + x1 - x)
		// 	console.log("##########################################")
		// }

		// if(x < x1 != x < x2 && y < (y2-y1) * (x-x1) / (x2-x1) + y1) { // Down
		// 	// console.log(x, (x2-x1))
		// 	// console.log(x, (x2-x1) * (y-y1))
		// 	// console.log(x, (x2-x1) * (y-y1) / (y2-y1))
		// 	console.log((y2-y1) * (x-x1) / (x2-x1) + y1 - y)
		// 	console.log("##########################################")
		// }

		if((x <= x1 != x <= x2 || (x == x1 && x1 == x2)) && y > (y2-y1) * (x-x1) / (x2-x1) + y1) { // up?
			const top = (y2-y1) * (x-x1) / (x2-x1) + y1 - y;
			if(minTop == null || minTop < top) minTop = top;
			// console.log("??")
			// console.log(x, (x2-x1))
			// console.log(x, (x2-x1) * (y-y1))
			// console.log(x, (x2-x1) * (y-y1) / (y2-y1))
			// console.log(((y2-y1) * (x-x1) / (x2-x1) + y1 - y) * -1)
			// console.log("##########################################")
		}
	} 
	// console.log(player.y + minTop + player.h + 100)
	return player.y + minTop;
}


function closestXCollision(point, polygon) {
	const length = polygon.length;
	const [x, y] = point;
	let count = 0;
	let minLeft = null;

	for(let i = 0; i < length; i++) {
		const [x1, y1] = polygon.at(i);
		const [x2, y2] = polygon.at(i-1);
		// if(y < y1 != y < y2 && x < (x2-x1) * (y-y1) / (y2-y1) + x1) { // Left
		// 	// console.log(x, (x2-x1))
		// 	// console.log(x, (x2-x1) * (y-y1))
		// 	// console.log(x, (x2-x1) * (y-y1) / (y2-y1))
		// 	console.log((x2-x1) * (y-y1) / (y2-y1) + x1 - x)
		// 	console.log("##########################################")
		// }

		// if(x < x1 != x < x2 && y < (y2-y1) * (x-x1) / (x2-x1) + y1) { // Down
		// 	// console.log(x, (x2-x1))
		// 	// console.log(x, (x2-x1) * (y-y1))
		// 	// console.log(x, (x2-x1) * (y-y1) / (y2-y1))
		// 	console.log((y2-y1) * (x-x1) / (x2-x1) + y1 - y)
		// 	console.log("##########################################")
		// }

		if(y < y1 != y < y2 && x > (x2-x1) * (y-y1) / (y2-y1) + x1) { // Left
			// console.log(x, (x2-x1))
			// console.log(x, (y-y1))
			// console.log(x, (x2-x1) * (y-y1) / (y2-y1))
			// console.log(x, (x2-x1) * (y-y1) / (y2-y1) + x1)
			// console.log((x2-x1) * (y-y1) / (y2-y1) + x1 - x)
			const left = (x2-x1) * (y-y1) / (y2-y1) + x1 - x;
			if(minLeft == null || minLeft < left) minLeft = left;
			// console.log("##########################################")
		}
	} 
	// console.log(player.y + minTop + player.h + 100)
	return player.x + minLeft;
}
function closestLineSlopeAngle(point, polygon) {
	const length = polygon.length;
	const [x, y] = point;
	let minTop = null;
	let kulma = 1;

	for(let i = 0; i < length; i++) {
		const [x1, y1] = polygon.at(i);
		const [x2, y2] = polygon.at(i-1);

		if(x <= x1 != x <= x2 && y > (y2-y1) * (x-x1) / (x2-x1) + y1) { // up?
			const top = (y2-y1) * (x-x1) / (x2-x1) + y1 - y;
			if(minTop == null || minTop < top) {
				minTop = top;
				kulma = (y2-y1) / (x2-x1);
			}

			// console.log((y2-y1) / (x2-x1))
			// console.log("??")
			// console.log(x, (x2-x1))
			// console.log(x, (x2-x1) * (y-y1))
			// console.log(x, (x2-x1) * (y-y1) / (y2-y1))
			// console.log(((y2-y1) * (x-x1) / (x2-x1) + y1 - y) * -1)
			// console.log("##########################################")
		}
	} 
	// console.log(player.y + minTop + player.h + 100)
	return kulma;
}

function playerInsidePolygon(shape, plX = player.x, plY = player.y) {
	if(shape.maxX < plX) return false;
	if(shape.minX > plX + player.w) return false;
	if(shape.maxY < plY) return false;
	if(shape.minY > plY + player.h) return false;
	
	const {polygon} = shape;
	const playerP = [
		[plX, plY], 
		[plX, plY + player.h], 
		[plX + player.w, plY + player.h],
		[plX + player.w, plY], 
	];

	if(pointInsidePolygon(polygon[0], playerP) || pointInsidePolygon([plX, plY], polygon)) return true

	for(let i = 0; i < playerP.length; i++) {
		const a = playerP.at(i);
		const b = playerP.at(i-1);
		for(let j = 0; j < polygon.length; j++) {
			const c = polygon.at(j);
			const d = polygon.at(j-1);

			if(doIntersect({x: a[0], y:a[1]}, {x: b[0], y:b[1]}, {x: c[0], y:c[1]}, {x: d[0], y:d[1]})) return true;
		}
	}; return false;
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