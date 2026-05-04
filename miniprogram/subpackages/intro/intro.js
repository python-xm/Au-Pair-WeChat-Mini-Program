Page({
  data: {
    introImages: [
      '/subpackages/intro/images/1.jpg',
      '/subpackages/intro/images/2.jpg',
      '/subpackages/intro/images/3.jpg',
      '/subpackages/intro/images/4.jpg',
      '/subpackages/intro/images/5.jpg',
      '/subpackages/intro/images/6.jpg',
      '/subpackages/intro/images/7.jpg',
      '/subpackages/intro/images/8.jpg',
      '/subpackages/intro/images/9.jpg',
      '/subpackages/intro/images/10.jpg'
    ],
    previewVisible: false,
    currentIndex: 0,
    scale: 1,
    translateX: 0,
    translateY: 0,
    startX: 0,
    startY: 0,
    startDistance: 0
  },

  onImageTap(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({
      previewVisible: true,
      currentIndex: index,
      scale: 1,
      translateX: 0,
      translateY: 0
    });
  },

  closePreview() {
    this.setData({
      previewVisible: false,
      scale: 1,
      translateX: 0,
      translateY: 0
    });
  },

  onMaskTap() {
    this.closePreview();
  },

  onImageTapInner() {
    this.closePreview();
  },

  onTouchStart(e) {
    if (e.touches.length === 1) {
      this.setData({
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY
      });
    } else if (e.touches.length === 2) {
      const x = e.touches[0].clientX - e.touches[1].clientX;
      const y = e.touches[0].clientY - e.touches[1].clientY;
      this.setData({
        startDistance: Math.sqrt(x * x + y * y)
      });
    }
  },

  onTouchMove(e) {
    if (e.touches.length === 1 && this.data.scale === 1) {
      const dx = e.touches[0].clientX - this.data.startX;
      this.setData({ translateX: dx });
    } else if (e.touches.length === 2) {
      const x = e.touches[0].clientX - e.touches[1].clientX;
      const y = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(x * x + y * y);
      
      if (this.data.startDistance > 0) {
        let newScale = this.data.scale * (distance / this.data.startDistance);
        newScale = Math.max(0.5, Math.min(4, newScale));
        this.setData({ scale: newScale });
      }
    }
  },

  onTouchEnd() {
    if (this.data.translateX > 100 && this.data.currentIndex > 0) {
      this.setData({
        currentIndex: this.data.currentIndex - 1,
        translateX: 0
      });
    } else if (this.data.translateX < -100 && this.data.currentIndex < this.data.introImages.length - 1) {
      this.setData({
        currentIndex: this.data.currentIndex + 1,
        translateX: 0
      });
    } else {
      this.setData({ translateX: 0 });
    }
  },

  onDoubleTap() {
    if (this.data.scale > 1) {
      this.setData({ scale: 1, translateX: 0, translateY: 0 });
    } else {
      this.setData({ scale: 2 });
    }
  }
});
