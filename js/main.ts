/// <reference path="../libs/easeljs/easeljs.d.ts" />
/**
 * Created by kawakatsu on 2016/03/04.
 */
class Main {
	static SAMPLE_NUM:number = 1000;
	static DIVISION_NUMBER:number = 200;

	static GRAPH_WIDTH:number = 500;
	static GRAPH_HEIGHT:number = 500;

	private stageWidth:number;
	private stageHeight:number;
	private stage:createjs.Stage;
	private graphContainer:createjs.Container;
	private selectBox:HTMLSelectElement;

	private randomFunc:Function;

	constructor() {
		this.init();
	}

	init():void {
		this.selectBox = <HTMLSelectElement>document.getElementById("selectBox");
		this.selectBox.addEventListener("change", (event) => {
			this.onSelect(event);
		});
		// Stageオブジェクトを作成します
		this.stage = new createjs.Stage("myCanvas");

		this.graphContainer = new createjs.Container();
		this.stage.addChild(this.graphContainer);

		this.createGraph();

		createjs.Ticker.addEventListener("tick", () => {
			this.handleTick();
		});

		this.onSelect(null);
	}

	handleTick():void {
		if (this._calc) {
			for (var i:number = 0; i < 500; i++) {
				this.addValue(this.randomFunc());
				if (this._isMax) {    // どこかが一番上まで行ったら
					this._calc = false;    // 計算ループ終了
					break;
				}
			}
		}
		this.stage.update();
	}

	_calc:boolean = false;

	onSelect(event:any):void {
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

	random():Number {
		return Math.random();
	}

	addRandom():Number {
		return (Math.random() + Math.random()) / 2;
	}

	multiplyRandom():Number {
		var r:number = Math.random();
		return r * r;
	}

	squareRandom():Number {
		return Math.random() * Math.random();
	}

	sqrtRandom():Number {
		return Math.sqrt(Math.random());
	}

	normalRandom():Number {
		var r1:number = Math.random();
		var r2:number = Math.random();
		var normal = Math.sqrt(-2.0 * Math.log(r1)) * Math.sin(2.0 * Math.PI * r2);

		//var variance:number = 20;
		//var average:number = 0.5;
		//normal = normal * variance + average
		return normal;
	}

	//

	private _rate:number = 2;
	private _isMax:boolean = false;

	private _valueList:number[];
	private _markerList:createjs.Shape[];

	createGraph() {
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

	reset():void {
		this._isMax = false;
		this._valueList = [];
		for (var i:number = 0; i < Main.GRAPH_WIDTH; i++) {
			this._valueList.push(0);

			var marker:createjs.Shape = this._markerList[i];
			marker.y = Main.GRAPH_HEIGHT - this._valueList[i];
		}
	}

	addValue(value:number):void {
		var num:number = Math.floor(value * Main.GRAPH_WIDTH);
		this._valueList[num] += this._rate;

		var marker:createjs.Shape = this._markerList[num];
		marker.y = Main.GRAPH_HEIGHT - this._valueList[num];

		if (Main.GRAPH_HEIGHT <= this._valueList[num]) {
			this._isMax = true;
		}
	}

}
;

window.addEventListener("load", function ():void {
	new Main()
});



