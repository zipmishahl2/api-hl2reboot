const currentDate = new Date();
const targetDate = new Date("2024-03-13");

if (currentDate.getMonth() === targetDate.getMonth() && currentDate.getDate() === targetDate.getDate()) {
  // code to start fireworks
  document.body.innerHTML = '<canvas id="fireworks"></canvas>';
  
  function randomColor() {
    return Math.floor(Math.random() * 255);
  }
  
  function launchFirework() {
    const firework = new Firework();
    fireworks.push(firework);
  }
  
  const fireworks = [];
  
  function update() {
    fireworks.forEach((firework, index) => {
      firework.update();
      if (firework.done) {
        fireworks.splice(index, 1);
      }
    });
  
    if (Math.random() < 0.1) {
      launchFirework();
    }
  }
  
  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }
  
  loop();
}
