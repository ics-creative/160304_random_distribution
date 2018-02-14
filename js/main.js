// ページ読み込み後に実行
window.addEventListener('DOMContentLoaded', () => {
  new Main();
});

/**
 * ランダムアルゴリズムの可視化デモのクラスです。
 */
class Main {
  constructor() {
    this._speed = 2;
    this._isPeak = false;
    this._isCalculating = false;
    this.selectBox = document.getElementById('selectBox');
    this.selectBox.addEventListener('change', (event) => {
      this.onSelect(event);
    });
    const btnNext = document.getElementById('btnNext');
    btnNext.addEventListener('click', () => {
      if (this.selectBox.selectedIndex >= this.selectBox.length - 1) {
        this.selectBox.selectedIndex = 0;
      }
      else {
        this.selectBox.selectedIndex += 1;
      }
      this.onSelect(null);
    });
    const btnPrev = document.getElementById('btnPrev');
    btnPrev.addEventListener('click', () => {
      this.selectBox.selectedIndex -= 1;
      if (this.selectBox.selectedIndex < 0)
        this.selectBox.selectedIndex = this.selectBox.length - 1;
      this.onSelect(null);
    });
    // Stageオブジェクトを作成します
    this.stage = new createjs.Stage('myCanvas');
    this.stage.scaleX = this.stage.scaleY = 2.0

    // 背景を作成
    const zabuton = new createjs.Bitmap('images/graph.png');
    this.stage.addChild(zabuton);

    // グラフを作成
    this.graphContainer = new createjs.Container();

    this.graphContainer.x = 280;
    this.graphContainer.y = 18;
    // マスクを作成
    const mask = new createjs.Shape();
    mask.graphics.beginFill('red').drawRect(280, 18, Main.GRAPH_WIDTH, Main.GRAPH_HEIGHT);
    this.graphContainer.mask = mask;

    // ステージを作成
    this.stage.addChild(this.graphContainer);
    this.createGraph();

    // エンターフレームを開始
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.on('tick', this.handleTick, this);

    // セレクトボックスを選択した状態とする
    this.onSelect(null);

  }

  handleTick() {
    if (this._isCalculating == true) {
      for (let i = 0; i < 1000; i++) {
        this.addValue(this.currentRandomFunc());
        if (this._isPeak == true) {
          this._isCalculating = false; // 計算ループ終了
          break;
        }
      }
    }
    this.stage.update();
  }

  onSelect(event) {
    switch (this.selectBox.value) {
      case 'default':
        this.currentRandomFunc = this.calcRandom;
        break;
      case 'add':
        this.currentRandomFunc = this.calcAddRandom;
        break;
      case 'multiply':
        this.currentRandomFunc = this.calcMultiplyRandom;
        break;
      case 'multiply-inverse':
        this.currentRandomFunc = this.calcMultiplyInverse;
        break;
        case 'multiply-reflect':
        this.currentRandomFunc = this.calcMultiplyReflect;
        break;
      case 'square':
        this.currentRandomFunc = this.calcSquareRandom;
        break;
      case 'square-inverse':
        this.currentRandomFunc = this.calcSquareInverse;
        break;
      case 'sqrt':
        this.currentRandomFunc = this.calcSqrtRandom;
        break;
      case 'sqrt-inverse':
        this.currentRandomFunc = this.calcSqrtInverse;
        break;
      case 'normal':
        this.currentRandomFunc = this.calcNormalRandom;
        break;
      default:
        break;
    }
    this.reset();
    this._isCalculating = true;
  }

  calcRandom() {
    // 通常の乱数
    const value = Math.random();
    return value;
  }

  calcAddRandom() {
    // 加算の乱数
    const value = (Math.random() + Math.random()) / 2;
    return value;
  }

  calcMultiplyRandom() {
    // 乗算の乱数
    const value = Math.random() * Math.random();
    return value;
  }

  calcMultiplyInverse() {
    // 乗算の乱数
    const base = Math.random() * Math.random();
    // 反転
    const value = 1.0 - base;
    return value;
  }

  calcMultiplyReflect() {
    // 乗算の乱数
    const base = Math.random() * Math.random();
    // 反転
    const inverse = 1.0 - base;

    const value = Math.random() < 0.5 ? base : inverse;

    return value;
  }

  calcSquareRandom() {
    // 2乗の乱数
    const r = Math.random();
    const value = r * r;
    return value;
  }

  calcSquareInverse() {
    // 2乗の乱数
    const r = Math.random();
    const base = r * r;
    // 反転
    const value = 1.0 - base;
    return value;
  }

  calcSqrtRandom() {
    // 平方根の乱数
    const value = Math.sqrt(Math.random());
    return value;
  }

  calcSqrtInverse() {
    // 平方根の乱数
    const base = Math.sqrt(Math.random());
    // 反転
    const value = 1.0 - base;
    return value;
  }

  calcNormalRandom() {
    function calcNormal() {
      // 正規乱数
      const r1 = Math.random();
      const r2 = Math.random();
      var value = Math.sqrt(-2.0 * Math.log(r1)) * Math.sin(2.0 * Math.PI * r2);
      // 値を0以上1未満になるよう正規化する
      value = (value + 3) / 6;
      return value;
    }

    // 0.0未満、1.0以上になるケースがあるため
    // その時は再計算を行う
    let value;
    while (true) {
      value = calcNormal();
      if (0 <= value && value < 1) {
        break;
      }
    }
    return value;
  }

  calcInverse(randomValue) {
    // 平方根の乱数
    const value = 1.0 - randomValue;
    return value;
  }

  createGraph() {
    this._dotArray = [];
    for (let i = 0; i < Main.GRAPH_WIDTH; i++) {
      const marker = new createjs.Shape();
      marker.graphics
        .beginFill(createjs.Graphics.getHSL(40 * i / Main.GRAPH_WIDTH + 180, 100, 50 + 10 * i / Main.GRAPH_WIDTH))
        .drawRect(-2, -2, 4, 4)
        .endFill()
        .beginFill(createjs.Graphics.getHSL(40 * i / Main.GRAPH_WIDTH + 180, 100, 50, 0.2))
        .drawRect(-6, -6, 12, 12)
        .endFill();
      this._dotArray.push(marker);
      this.graphContainer.addChild(marker);
      marker.x = i;
    }
    this.reset();
  }

  reset() {
    this._isPeak = false;
    this._valueArray = [];
    for (let i = 0; i < Main.GRAPH_WIDTH; i++) {
      this._valueArray.push(0);
      const marker = this._dotArray[i];
      marker.y = Main.GRAPH_HEIGHT - this._valueArray[i];
    }
  }

  addValue(value) {
    const num = Math.floor(value * Main.GRAPH_WIDTH);
    this._valueArray[num] += this._speed;
    const marker = this._dotArray[num];
    marker.y = Main.GRAPH_HEIGHT - this._valueArray[num];
    if (Main.GRAPH_HEIGHT <= this._valueArray[num]) {
      this._isPeak = true;
    }
  }
}

Main.GRAPH_WIDTH = 400;
Main.GRAPH_HEIGHT = 400;