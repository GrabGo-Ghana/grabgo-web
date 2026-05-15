class WavyBannerClipper {
  waveHeight: number;
    waveCount: number;
    cornerRadius: number;
  constructor({ waveHeight = 8, waveCount = 8, cornerRadius = 16 } = {}) {
    this.waveHeight = waveHeight;
    this.waveCount = waveCount;
    this.cornerRadius = cornerRadius;
  }

  getPath(canvas: { getContext: (arg0: string) => any; }, width: number, height: number) {
    const ctx = canvas.getContext("2d");
    const waveWidth = width / this.waveCount;
    const path = new Path2D();

    // Start from top-left corner
    path.moveTo(0, this.waveHeight + this.cornerRadius);

    // Top-left rounded corner
    path.quadraticCurveTo(0, this.waveHeight, this.cornerRadius, this.waveHeight);

    // Wavy top edge
    for (let i = 0; i < this.waveCount; i++) {
      const x2 = waveWidth * (i + 0.5);
      const x3 = waveWidth * (i + 1);

      if (i === 0) {
        path.quadraticCurveTo(x2, 0, x3, this.waveHeight);
      } else if (i === this.waveCount - 1) {
        path.quadraticCurveTo(x2, 0, width - this.cornerRadius, this.waveHeight);
      } else {
        path.quadraticCurveTo(x2, 0, x3, this.waveHeight);
      }
    }

    // Top-right rounded corner
    path.quadraticCurveTo(width, this.waveHeight, width, this.waveHeight + this.cornerRadius);

    // Right edge
    path.lineTo(width, height - this.waveHeight - this.cornerRadius);

    // Bottom-right rounded corner
    path.quadraticCurveTo(width, height - this.waveHeight, width - this.cornerRadius, height - this.waveHeight);

    // Wavy bottom edge (going backwards)
    for (let i = this.waveCount; i > 0; i--) {
      const x2 = waveWidth * (i - 0.5);
      const x3 = waveWidth * (i - 1);

      if (i === this.waveCount) {
        path.quadraticCurveTo(x2, height, x3, height - this.waveHeight);
      } else if (i === 1) {
        path.quadraticCurveTo(x2, height, this.cornerRadius, height - this.waveHeight);
      } else {
        path.quadraticCurveTo(x2, height, x3, height - this.waveHeight);
      }
    }

    // Bottom-left rounded corner
    path.quadraticCurveTo(0, height - this.waveHeight, 0, height - this.waveHeight - this.cornerRadius);

    // Left edge back to start
    path.lineTo(0, this.waveHeight + this.cornerRadius);

    path.closePath();
    return path;
  }

  clip(canvas: { getContext: any; }, width: number, height: number) {
    const ctx = canvas.getContext("2d");
    const path = this.getPath(canvas, width, height);
    ctx.clip(path);
  }

  draw(canvas: { getContext: any; }, width: number, height: number, fillColor = "#fe6132") {
    const ctx = canvas.getContext("2d");
    const path = this.getPath(canvas, width, height);
    ctx.fillStyle = fillColor;
    ctx.fill(path);
  }
}