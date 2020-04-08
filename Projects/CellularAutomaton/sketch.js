$(document).ready(() => {
  $('#welcome').modal("show");

  document.getElementById('rule').addEventListener('input', () => {
    let rule = $('#rule')[0];
    let applyButton = $('#apply')[0];
    if(rule.checkValidity()) applyButton.disabled = false;
    else applyButton.disabled = true;
  });

  document.getElementById('apply').addEventListener('click', () => {
    $('#apply').prop('disabled', true);
    $('#rule').prop('disabled', true);
    $('#reset').prop('disabled', false);
    $('#apply').blur();

    let input = $("input[id=rule]").val();
    let binary = byteString(parseInt(input));
    ruleset = binary.split('').reverse().join('');
    resetGrid();
    loop();
  });

  document.getElementById('reset').addEventListener('click', () => { 
    $('#reset').prop('disabled', true);
    $('#rule').prop('disabled', false);
    $('#apply').prop('disabled', false);
    $('#reset').blur();
    noLoop();
    resetGrid();
  });

  document.getElementById('speed').addEventListener('input', () => {
    frameRate(parseInt($("input[id=speed]").val()));
  });
});

let tileSize, nCols, nRows, grid, gen, ruleset;

function setup() {
  let canvas = createCanvas(800, 400);
  canvas.parent('canv');
  frameRate(parseInt($('#speed').val()));
  tileSize = 8;
  nCols = width / tileSize;
  nRows = height / tileSize;
  resetGrid();  
  noLoop();
}

function draw() {
  background(255);
  showCells();
  nextGen();  
}

function byteString(n) {
  if (n < 0 || n > 255 || n % 1 !== 0) throw new Error(`${n} does not fit in a byte`);
  return (`000000000${n.toString(2)}`).substr(-8);
}

function resetGrid() {
  gen = 0;
  grid = new Array(nCols);
  for (let i = 0; i < nCols; i++) grid[i] = new Array(nRows);
  for (let i = 0; i < nCols; i++)
    for (let j = 0; j < nRows; j++) grid[i][j] = 0;
  
  grid[nCols/2][0] = 1;
}

function nextGen() {
  try{
    for (let i = 0; i < nCols; i++) {
      let left = grid[(i+nCols-1)%nCols][gen%nRows];
      let me = grid[i][gen%nRows];
      let right = grid[(i+1)%nCols][gen%nRows];

      grid[i][(gen+1)%nRows] = parseInt(ruleset[parseInt(`${left}${me}${right}`, 2)]);   
    }   
    gen++;
  }catch(e){}
}

function showCells() {
  let offset = gen%nRows;

  for (let i = 0; i < nCols; i++) {
    for (let j = 0; j < nRows; j++) {
      let y = j - offset;
      if (y <= 0) y = nRows + y;
      if (grid[i][j] == 1) {
        fill(0);
        noStroke();
        rect(i*tileSize, (y-1)*tileSize, tileSize, tileSize);
      }
    }
  }
}