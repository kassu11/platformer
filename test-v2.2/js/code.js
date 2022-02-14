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
		ctx.fillRect(row.x - player.x + plXOffset, row.y - player.y + plYOffset, row.w, row.h);
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
		if(player.x < (row.x + row.w) && (player.x + player.w) > row.x && newY < (row.y + row.h) && (player.h + newY) > row.y) {
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