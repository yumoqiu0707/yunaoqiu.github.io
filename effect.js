const Effect = {
  showFloatScore(x, y, scoreVal) {
    const float = document.createElement('div');
    float.className = 'float-score';
    float.innerText = `+${scoreVal}`;
    float.style.left = `${x}px`;
    float.style.top = `${y}px`;
    document.body.appendChild(float);
    setTimeout(() => float.remove(), 1000);
  },
  cellHighlight(cellDom) {
    cellDom.classList.add('cell-light');
    setTimeout(() => cellDom.classList.remove('cell-light'), 300);
  }
};