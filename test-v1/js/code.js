const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let lastRenderTime = 0;

const player = {
	x: 0,
	y: 0,
	size: 100,
	movementLeft: 0,
	movementRight: 0,
	movementBottom: 0,
}

function render() {
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	movePlayer();

	ctx.fillStyle = "red";
	
	ctx.fillRect(player.x, player.y, player.size, player.size);

	requestAnimationFrame(render);
}

function movePlayer() {
	if(player.y + player.size < canvas.height) {
		if(player.movementBottom >= 15.8) player.movementBottom = 15.8;
		else player.movementBottom += .2;
	} else if(player.movementBottom > 0) player.movementBottom = 0;
	
	player.x += (player.movementLeft + player.movementRight);
	if(player.x < 0) player.x = 0;
	if(player.x + player.size > canvas.width) player.x = canvas.width - player.size;
	player.y += player.movementBottom;
	if(player.y + player.size > canvas.height) {
		player.y = canvas.height - player.size;
	}
}

window.addEventListener("keydown", e => {
	if(e.code === "KeyD") {
		player.movementLeft = 4;
	} else if(e.code === "KeyA") {
		player.movementRight = -4;
	} else if(e.code === "KeyW") {
		player.movementBottom = -10;
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