const canvas = document.getElementById('clockCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

function drawClock() {
  const now = new Date();
  const adjustedTime = new Date(
    now.getTime() - 3 * 60 * 60 * 1000 - 15 * 60 * 1000 - 15 * 1000
  );
  const seconds = adjustedTime.getSeconds();
  const minutes = adjustedTime.getMinutes();
  const hours = adjustedTime.getHours();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);

  drawFace(ctx);
  drawNumbers(ctx);
  drawTime(ctx, hours, minutes, seconds);

  ctx.restore();

  requestAnimationFrame(drawClock);
}

function drawFace(ctx) {
  ctx.beginPath();
  ctx.arc(0, 0, canvas.width / 2 - 10, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 8;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, 2 * Math.PI);
  ctx.fillStyle = 'black';
  ctx.fill();
}

function drawNumbers(ctx) {
  const radius = canvas.width / 2 - 40;
  ctx.font = '24px Arial';
  ctx.fillStyle = 'black';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  for (let num = 1; num <= 12; num++) {
    const angle = (num - 3) * (Math.PI / 6);
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    ctx.fillText(num.toString(), x, y);
  }
}

function drawTime(ctx, hours, minutes, seconds) {
  const hour =
    (((hours % 12) + minutes / 60 + seconds / 3600) * 30 * Math.PI) / 180;
  const minute = ((minutes + seconds / 60) * 6 * Math.PI) / 180;
  const second = (seconds * 6 * Math.PI) / 180;

  drawHand(ctx, hour, canvas.width / 4, 6);
  drawHand(ctx, minute, canvas.width / 2.5, 4);
  drawHand(ctx, second, canvas.width / 3, 2);
}

function drawHand(ctx, pos, length, width) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.moveTo(0, 0);
  ctx.rotate(pos);
  ctx.lineTo(length, 0);
  ctx.stroke();
  ctx.rotate(-pos);
}

drawClock();
