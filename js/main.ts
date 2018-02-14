/// <reference path="../libs/easeljs/easeljs.d.ts" />

namespace demo {
  'use strict';

  // ページ読み込み後に実行
  window.addEventListener('DOMContentLoaded', () => {
    new Main();
  });

  /**
   * ランダムアルゴリズムの可視化デモのクラスです。
   */
  class Main {

    static GRAPH_WIDTH: number = 400;
    static GRAPH_HEIGHT: number = 400;

    private stage: createjs.Stage;
    private graphContainer: createjs.Container;
    private selectBox: HTMLSelectElement;
    private currentRandomFunc: Function;

    private _speed: number = 2;
    private _isPeak: boolean = false;

    private _valueArray: number[];
    private _dotArray: createjs.Shape[];
    private _isCalculating: boolean = false;

    constructor() {
      this.selectBox = <HTMLSelectElement>document.getElementById('selectBox');
      this.selectBox.addEventListener('change', (event) => {
        this.onSelect(event);
      });

      const btnNext = <HTMLElement>document.getElementById('btnNext');
      btnNext.addEventListener('click', () => {
        if (this.selectBox.selectedIndex >= this.selectBox.length - 1) {
          this.selectBox.selectedIndex = 0;
        } else {
          this.selectBox.selectedIndex += 1;
        }
        this.onSelect(null);
      });
      const btnPrev = <HTMLElement>document.getElementById('btnPrev');
      btnPrev.addEventListener('click', () => {
        this.selectBox.selectedIndex -= 1;
        if (this.selectBox.selectedIndex < 0) this.selectBox.selectedIndex = this.selectBox.length - 1;
        this.onSelect(null);
      });

      // Stageオブジェクトを作成します
      this.stage = new createjs.Stage('myCanvas');

      this.graphContainer = new createjs.Container();
      this.stage.addChild(this.graphContainer);

      this.createGraph();

      createjs.Ticker.timingMode = createjs.Ticker.RAF;
      createjs.Ticker.addEventListener('tick', () => {
        this.handleTick();
      });

      this.onSelect(null);
    }

    private handleTick(): void {
      if (this._isCalculating == true) {
        for (let i: number = 0; i < 1000; i++) {
          this.addValue(this.currentRandomFunc());
          if (this._isPeak == true) { // どこかが一番上まで行ったら
            this._isCalculating = false; // 計算ループ終了
            break;
          }
        }
      }
      this.stage.update();
    }

    private onSelect(event: any): void {
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

    private calcRandom(): number {
      // 通常の乱数
      const value = Math.random();
      return value;
    }

    private calcAddRandom(): number {
      // 加算の乱数
      const value = (Math.random() + Math.random()) / 2;

      return value;
    }

    private calcMultiplyRandom(): number {
      // 乗算の乱数
      const value = Math.random() * Math.random();
      return value;
    }

    private calcMultiplyInverse(): number {
      // 乗算の乱数
      const base = Math.random() * Math.random();
      // 反転
      const value = 1.0 - base;
      return value;
    }

    private calcSquareRandom(): number {
      // 2乗の乱数
      const r: number = Math.random();
      const value = r * r;

      return value;
    }

    private calcSquareInverse(): number {
      // 2乗の乱数
      const r: number = Math.random();
      const base = r * r;
      // 反転
      const value = 1.0 - base;
      return value;
    }

    private calcSqrtRandom(): number {
      // 平方根の乱数
      const value = Math.sqrt(Math.random());

      return value;
    }

    private calcSqrtInverse(): number {
      // 平方根の乱数
      const base = Math.sqrt(Math.random());
      // 反転
      const value = 1.0 - base;
      return value;
    }

    private calcNormalRandom(): number {

      function calcNormal(): number {
        // 正規乱数
        const r1: number = Math.random();
        const r2: number = Math.random();
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

    private calcInverse(randomValue: number): number {
      // 平方根の乱数
      const value = 1.0 - randomValue;

      return value;
    }

    private createGraph() {
      this._dotArray = [];
      for (let i: number = 0; i < Main.GRAPH_WIDTH; i++) {
        const marker: createjs.Shape = new createjs.Shape();
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

    private reset(): void {
      this._isPeak = false;
      this._valueArray = [];
      for (let i: number = 0; i < Main.GRAPH_WIDTH; i++) {
        this._valueArray.push(0);

        const marker = this._dotArray[i];
        marker.y = Main.GRAPH_HEIGHT - this._valueArray[i];
      }
    }

    private addValue(value: number): void {
      const num: number = Math.floor(value * Main.GRAPH_WIDTH);
      this._valueArray[num] += this._speed;

      const marker: createjs.Shape = this._dotArray[num];
      marker.y = Main.GRAPH_HEIGHT - this._valueArray[num];

      if (Main.GRAPH_HEIGHT <= this._valueArray[num]) {
        this._isPeak = true;
      }
    }
  }
}





