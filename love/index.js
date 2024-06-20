let highestZ = 1;

class Paper {
  constructor(paper) {
    this.paper = paper;
    this.holdingPaper = false;
    this.touchX = 0;
    this.touchY = 0;
    this.prevTouchX = 0;
    this.prevTouchY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;
    this.init();
  }

  init() {
    // Add touch event listeners
    this.paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      this.paper.style.zIndex = highestZ;
      highestZ += 1;
      const touch = e.touches[0];
      this.touchX = touch.clientX;
      this.touchY = touch.clientY;
      this.prevTouchX = this.touchX;
      this.prevTouchY = this.touchY;
    });

    this.paper.addEventListener('touchmove', (e) => {
      if (!this.holdingPaper) return;
      const touch = e.touches[0];
      this.velX = touch.clientX - this.prevTouchX;
      this.velY = touch.clientY - this.prevTouchY;
      this.prevTouchX = touch.clientX;
      this.prevTouchY = touch.clientY;
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }
      const dirX = touch.clientX - this.touchX;
      const dirY = touch.clientY - this.touchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }
      this.paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    });

    this.paper.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
      // Remove the card when touched
      this.paper.remove();
    });

    // Add long press event listener for rotation
    let longPressTimeout;
    this.paper.addEventListener('touchstart', (e) => {
      longPressTimeout = setTimeout(() => {
        this.rotating = true;
      }, 500); // 500ms long press
    });

    this.paper.addEventListener('touchend', () => {
      clearTimeout(longPressTimeout);
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => new Paper(paper));