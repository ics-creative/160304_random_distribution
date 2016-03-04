/// <reference path="../libs/easeljs/easeljs.d.ts" />

namespace demo {
	"use strict";

	// ページ読み込み後に実行
	window.addEventListener("DOMContentLoaded", () => {
		new Main()
	});

	/**
	 * ランダムアルゴリズムの可視化デモのクラスです。
	 */
	class Main {

		static GRAPH_WIDTH:number = 400;
		static GRAPH_HEIGHT:number = 400;
		static NUM_LOGIC:number = 6;

		private stage:createjs.Stage;
		private graphContainer:createjs.Container;
		private selectBox:HTMLSelectElement;
		private currentRandomFunc:Function;

		private _rate:number = 2;
		private _isMax:boolean = false;

		private _valueList:number[];
		private _markerList:createjs.Shape[];
		private _isCalculating:boolean = false;

		constructor() {
			this.init();
		}

		private init():void {
			this.selectBox = <HTMLSelectElement>document.getElementById("selectBox");
			this.selectBox.addEventListener("change", (event) => {
				this.onSelect(event);
			});

			const btnNext = <HTMLElement>document.getElementById("btnNext");
			btnNext.addEventListener("click", ()=> {
				this.selectBox.selectedIndex += 1;
				if (this.selectBox.selectedIndex >= Main.NUM_LOGIC) this.selectBox.selectedIndex = 0;
				this.onSelect(null);
			});
			const btnPrev = <HTMLElement>document.getElementById("btnPrev");
			btnPrev.addEventListener("click", ()=> {
				this.selectBox.selectedIndex -= 1;
				if (this.selectBox.selectedIndex < 0) this.selectBox.selectedIndex = Main.NUM_LOGIC - 1;
				this.onSelect(null);
			});

			// Stageオブジェクトを作成します
			this.stage = new createjs.Stage("myCanvas");

			this.graphContainer = new createjs.Container();
			this.stage.addChild(this.graphContainer);

			this.createGraph();

			createjs.Ticker.timingMode = createjs.Ticker.RAF;
			createjs.Ticker.addEventListener("tick", () => {
				this.handleTick();
			});

			this.onSelect(null);
		}

		private handleTick():void {
			if (this._isCalculating == true) {
				for (let i:number = 0; i < 1000; i++) {
					this.addValue(this.currentRandomFunc());
					if (this._isMax == true) { // どこかが一番上まで行ったら
						this._isCalculating = false; // 計算ループ終了
						break;
					}
				}
			}
			this.stage.update();
		}


		private onSelect(event:any):void {
			switch (this.selectBox.selectedIndex) {
				case 0:
					this.currentRandomFunc = this.calcRandom;
					break;
				case 1:
					this.currentRandomFunc = this.calcAddRandom;
					break;
				case 2:
					this.currentRandomFunc = this.calcMultiplyRandom;
					break;
				case 3:
					this.currentRandomFunc = this.calcSquareRandom;
					break;
				case 4:
					this.currentRandomFunc = this.calcSqrtRandom;
					break;
				case 5:
					this.currentRandomFunc = this.calcNormalRandom;
					break;
				default:
					break;

			}

			this.reset();
			this._isCalculating = true;
		}

		//

		private calcRandom():number {
			// 通常の乱数
			const value = Math.random();
			return value;
		}

		private calcAddRandom():number {
			// 加算の乱数
			const value = (Math.random() + Math.random()) / 2;

			return value;
		}

		private calcMultiplyRandom():number {
			// 乗算の乱数
			const value = Math.random() * Math.random();
			return value;
		}

		private calcSquareRandom():number {
			// 2乗の乱数
			const r:number = Math.random();
			const value = r * r;

			return value;
		}

		private calcSqrtRandom():number {
			// 平方根の乱数
			const value = Math.sqrt(Math.random());

			return value;
		}

		private calcNormalRandom():number {
			// 正規乱数
			const r1:number = Math.random();
			const r2:number = Math.random();
			var value = Math.sqrt(-2.0 * Math.log(r1)) * Math.sin(2.0 * Math.PI * r2);

			// 値を0以上1未満になるよう正規化する
			value = (value + 3) / 6;

			if(value < 0 || value >= 1)
			{
				// 値が範囲を超えてしまう可能性があるため、その場合は再計算する
				value = this.calcNormalRandom();
			}

			return value;
		}

		private createGraph() {
			this._markerList = [];
			for (let i:number = 0; i < Main.GRAPH_WIDTH; i++) {
				const marker:createjs.Shape = new createjs.Shape();
				marker.graphics
					.beginFill(createjs.Graphics.getHSL(40 * i / Main.GRAPH_WIDTH + 180, 100, 50 + 10 * i / Main.GRAPH_WIDTH))
					.drawRect(-2, -2, 4, 4)
					.endFill()
					.beginFill(createjs.Graphics.getHSL(40 * i / Main.GRAPH_WIDTH + 180, 100, 50, 0.2))
					.drawRect(-6, -6, 12, 12)
					.endFill()
				this._markerList.push(marker);
				this.graphContainer.addChild(marker);
				marker.x = i;
			}

			this.reset();
		}

		private reset():void {
			this._isMax = false;
			this._valueList = [];
			for (let i:number = 0; i < Main.GRAPH_WIDTH; i++) {
				this._valueList.push(0);

				const marker:createjs.Shape = this._markerList[i];
				marker.y = Main.GRAPH_HEIGHT - this._valueList[i];
			}
		}

		private addValue(value:number):void {
			const num:number = Math.floor(value * Main.GRAPH_WIDTH);
			this._valueList[num] += this._rate;

			const marker:createjs.Shape = this._markerList[num];
			marker.y = Main.GRAPH_HEIGHT - this._valueList[num];

			if (Main.GRAPH_HEIGHT <= this._valueList[num]) {
				this._isMax = true;
			}
		}
	}
}





