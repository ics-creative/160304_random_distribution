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
		static GRAPH_WIDTH:number = 480;
		static GRAPH_HEIGHT:number = 480;

		private stage:createjs.Stage;
		private graphContainer:createjs.Container;
		private selectBox:HTMLSelectElement;
		private randomFunc:Function;

		private _rate:number = 2;
		private _isMax:boolean = false;

		private _valueList:number[];
		private _markerList:createjs.Shape[];
		private _calc:boolean = false;

		constructor() {
			this.init();
		}

		private init():void {
			this.selectBox = <HTMLSelectElement>document.getElementById("selectBox");
			this.selectBox.addEventListener("change", (event) => {
				this.onSelect(event);
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
			if (this._calc) {
				for (var i:number = 0; i < 500; i++) {
					this.addValue(this.randomFunc());
					if (this._isMax == true) {    // どこかが一番上まで行ったら
						this._calc = false;    // 計算ループ終了
						break;
					}
				}
			}
			this.stage.update();
		}


		private onSelect(event:any):void {
			switch (this.selectBox.selectedIndex) {
				case 0:
					this.randomFunc = this.random;
					break;
				case 1:
					this.randomFunc = this.addRandom;
					break;
				case 2:
					this.randomFunc = this.multiplyRandom;
					break;
				case 3:
					this.randomFunc = this.sqrtRandom;
					break;
				case 4:
					this.randomFunc = this.sqrtRandom;
					break;
				case 5:
					this.randomFunc = this.normalRandom;
					break;
				default:
					break;

			}

			this.reset();
			this._calc = true;
		}

		//

		private random():number {
			return Math.random();
		}

		private addRandom():number {
			return (Math.random() + Math.random()) / 2;
		}

		private multiplyRandom():number {
			var r:number = Math.random();
			return r * r;
		}

		private squareRandom():number {
			return Math.random() * Math.random();
		}

		private sqrtRandom():number {
			return Math.sqrt(Math.random());
		}

		private normalRandom():number {
			var r1:number = Math.random();
			var r2:number = Math.random();
			var normal = Math.sqrt(-2.0 * Math.log(r1)) * Math.sin(2.0 * Math.PI * r2);
			return normal;
		}

		private createGraph() {
			this._markerList = [];
			for (var i:number = 0; i < Main.GRAPH_WIDTH; i++) {
				var marker:createjs.Shape = new createjs.Shape();
				marker.graphics.beginFill(createjs.Graphics.getHSL(Math.random() * 360, 90, 40));
				marker.graphics.drawCircle(0, 0, 3);
				this._markerList.push(marker);
				this.graphContainer.addChild(marker);
				marker.x = i;
			}

			this.reset();
		}

		private reset():void {
			this._isMax = false;
			this._valueList = [];
			for (var i:number = 0; i < Main.GRAPH_WIDTH; i++) {
				this._valueList.push(0);

				var marker:createjs.Shape = this._markerList[i];
				marker.y = Main.GRAPH_HEIGHT - this._valueList[i];
			}
		}

		private addValue(value:number):void {
			var num:number = Math.floor(value * Main.GRAPH_WIDTH);
			this._valueList[num] += this._rate;

			var marker:createjs.Shape = this._markerList[num];
			marker.y = Main.GRAPH_HEIGHT - this._valueList[num];

			if (Main.GRAPH_HEIGHT <= this._valueList[num]) {
				this._isMax = true;
			}
		}
	}
}





