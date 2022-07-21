window.onresize = changeWindow;
const game = new Game();
let press = false;

function load() {
  canvas = document.querySelector('.canvas');
  ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  document.onkeydown = keyPress;
  document.onmousedown = click;
  game.draw();
  runFrame();
}

function runFrame() {
  const cont = game.step(press);
  game.draw();
  press = false;

  if(!cont) {
    game.setParams();
  }

  requestAnimationFrame(runFrame);
}

function changeWindow() {
  width = window.innerWidth;
  height = window.innerHeight;
  //REDRAW SCREEN
  ctx.clearRect(0, 0, width, height);
  game.draw();
}

function keyPress(key) {
  if(key.keyCode == 32) {
    //press = true;
  }
}

function leftClick() {
  const x = event.clientX;
  const y = event.clientY;
}

function click() {
  press = true;
}
