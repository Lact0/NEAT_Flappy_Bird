window.onresize = changeWindow;
//Input is [pipeX (to player), pipeY1, pipeY2, birdHeight, birdVel]
const neat = new Neat(5, 1);
let playBest = false;
let bestAi;
let run = false;
let game = false;
let maxScore = 0;

function load() {
  canvas = document.querySelector('.canvas');
  ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  document.onkeydown = keyPress;
  document.onmousedown = click;
  while(train()) {
    continue;
  }
  run = setInterval(showBest, 1000 / 75);
}

function showBest() {
  if(!game) {
    game = new Game();
  }
  const pipe = game.pipes[game.curPipe];
  const input = [pipe[0] - game.birdX, pipe[1], pipe[2], game.birdPos, game.birdVel];
  const out = bestAi.pass(input);
  let press = false;
  if(out > 0) {
    press = true;
  }
  game.draw();
  const size = max(parseInt((width - gameWidth * game.getRatio()) / 2), parseInt((height - gameHeight * game.getRatio()) / 2));
  bestAi.draw(0, 0, size, size);
  cont = game.step(press);
  maxScore = max(maxScore, game.score);
  if(!cont) {
    game = false;
  }
}

function train() {
  let mx = 0;
  let mxInd = 0;
  for(let i = 0; i < neat.popSize; i++) {
    const net = neat.pop[i];
    const game = new Game();
    let cont = true;
    let steps = 0;
    while(cont) {
      const pipe = game.pipes[game.curPipe];
      const input = [pipe[0] - game.birdX, pipe[1], pipe[2], game.birdPos, game.birdVel];
      const out = net.pass(input);
      let press = false;
      if(out > 0) {
        press = true;
      }
      cont = game.step(press);
      steps++;
      if(game.score > 100) {
        bestAi = neat.pop[i];
        return false;
      }
    }
    neat.fitness[i] = game.score * 1000 + steps;
    if(game.score > mx) {
      mx = game.score;
      mxInd = i;
    }
  }
  bestAi = neat.pop[mxInd];
  neat.step();
  console.log(neat.gen);
  return true;
}

function changeWindow() {
  width = window.innerWidth;
  height = window.innerHeight;
  //REDRAW SCREEN
  ctx.clearRect(0, 0, width, height);
}

function keyPress(key) {
  if(key.keyCode == 32) {
    //train();
  }
}

function leftClick() {
  const x = event.clientX;
  const y = event.clientY;
}

function click() {
  return;
  if(playBest) {
    game = false;
    run = setInterval(showBest, 1000 / 75);
  } else {
    clearInterval(run);
  }
  playBest = !playBest;
}
