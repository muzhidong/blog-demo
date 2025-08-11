class StarrySky {

  lastPaintSize = {
    width: 0,
    height: 0
  };

  paintSize = {
    width: 0,
    height: 0
  };

  stars = [];
  
  static get inputProperties() { 
    return ['--starry-sky-seed', '--star-opacity', '--star-density']; 
  }

  random () {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  addStars () {
    const xMax = this.paintSize.width;
    const yMax = this.paintSize.height;
    // 星星的数量
    let hmTimes = Math.round((xMax + yMax) * this.starDensity);	
    for (let i = 0; i < hmTimes; i++) {
      const x = Math.floor((this.random() * xMax) + 1);
      const y = Math.floor((this.random() * yMax) + 1);
      if (x < this.lastPaintSize.width && y < this.lastPaintSize.height) {
        continue;
      }
      this.stars.push({
        x: x,
        y: y,
        size: Math.floor((this.random() * 2) + 1),
        // 星星的亮暗
        opacityOne: Math.floor((this.random() * 9) + 1),
        opacityTwo: Math.floor((this.random() * 9) + 1),
        hue: Math.floor((this.random() * 360) + 1)
      });
    }
  }

  removeStars() {
    for (const i in this.stars) {
      const star = this.stars[i]
      if (star.x >= this.paintSize.width ||
        star.y >= this.paintSize.height) {
        this.stars.splice(i, 1);
      }
    }
  }

  updateStars () {
    // 如果当前画布比上次小，则删掉一些星星
    if (this.lastPaintSize.width > this.paintSize.width ||
      this.lastPaintSize.height > this.paintSize.height) {
      this.removeStars();
    }
    // 如果当前画布变大，则增加一些星星
    if (this.lastPaintSize.width < this.paintSize.width || 
      this.lastPaintSize.height < this.paintSize.height) {
      this.addStars();
    }
    this.lastPaintSize = this.paintSize;
  }

  updateControl(properties) {
    this.starOpacity = +properties.get('--star-opacity').toString();

    this.starDensity = +properties.get('--star-density').toString() || 1;
    this.starDensity > 1 && (this.starDensity = 1);
    
    const ONE_HOUR = 3600 * 1000;
    this.seed = +(properties.get('--starry-sky-seed').toString() || 0) + Date.now() / ONE_HOUR >> 0;
  }

  paint(ctx, paintSize, properties) {
    // console.log('paint trigger..........')
    // 更新当前paintSize
    this.paintSize = paintSize;
    // 获取CSS变量设置
    this.updateControl(properties);
    // 增量更新星星
    this.updateStars();
    for (let star of this.stars) {
      const opacity = +('.' + (star.opacityOne + star.opacityTwo)) * this.starOpacity;
      ctx.fillStyle = `hsla(${star.hue}, 30%, 80%, ${opacity})`;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
  }
}

registerPaint('starry-sky', StarrySky);

