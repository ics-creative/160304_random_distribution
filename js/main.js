/// <reference path="../libs/easeljs/easeljs.d.ts" />
/**
 * Created by kawakatsu on 2016/03/04.
 */
var Main = (function () {
    function Main() {
        this._calc = false;
        //
        this._rate = 2;
        this._isMax = false;
        this.init();
    }
    Main.prototype.init = function () {
        var _this = this;
        this.selectBox = document.getElementById("selectBox");
        this.selectBox.addEventListener("change", function (event) { _this.onSelect(event); });
        // Stageオブジェクトを作成します
        this.stage = new createjs.Stage("myCanvas");
        this.graphContainer = new createjs.Container();
        this.stage.addChild(this.graphContainer);
        this.createGraph();
        createjs.Ticker.addEventListener("tick", function () { _this.handleTick(); });
        this.onSelect(null);
    };
    Main.prototype.handleTick = function () {
        if (this._calc) {
            for (var i = 0; i < 500; i++) {
                this.addValue(this.randomFunc());
                if (this._isMax) {
                    this._calc = false; // 計算ループ終了
                    break;
                }
            }
        }
        this.stage.update();
    };
    Main.prototype.onSelect = function (event) {
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
    };
    //
    Main.prototype.random = function () {
        return Math.random();
    };
    Main.prototype.addRandom = function () {
        return (Math.random() + Math.random()) / 2;
    };
    Main.prototype.multiplyRandom = function () {
        var r = Math.random();
        return r * r;
    };
    Main.prototype.squareRandom = function () {
        return Math.random() * Math.random();
    };
    Main.prototype.sqrtRandom = function () {
        return Math.sqrt(Math.random());
    };
    Main.prototype.normalRandom = function () {
        var r1 = Math.random();
        var r2 = Math.random();
        var normal = Math.sqrt(-2.0 * Math.log(r1)) * Math.sin(2.0 * Math.PI * r2);
        //var variance:number = 20;
        //var average:number = 0.5;
        //normal = normal * variance + average
        return normal;
    };
    Main.prototype.createGraph = function () {
        this._markerList = [];
        for (var i = 0; i < Main.GRAPH_WIDTH; i++) {
            var marker = new createjs.Shape();
            marker.graphics.beginFill(createjs.Graphics.getHSL(Math.random() * 360, 90, 40));
            marker.graphics.drawCircle(0, 0, 3);
            this._markerList.push(marker);
            this.graphContainer.addChild(marker);
            marker.x = i;
        }
        this.reset();
    };
    Main.prototype.reset = function () {
        this._isMax = false;
        this._valueList = [];
        for (var i = 0; i < Main.GRAPH_WIDTH; i++) {
            this._valueList.push(0);
            var marker = this._markerList[i];
            marker.y = Main.GRAPH_HEIGHT - this._valueList[i];
        }
    };
    Main.prototype.addValue = function (value) {
        var num = Math.floor(value * Main.GRAPH_WIDTH);
        this._valueList[num] += this._rate;
        var marker = this._markerList[num];
        marker.y = Main.GRAPH_HEIGHT - this._valueList[num];
        if (Main.GRAPH_HEIGHT <= this._valueList[num]) {
            this._isMax = true;
        }
    };
    Main.SAMPLE_NUM = 1000;
    Main.DIVISION_NUMBER = 200;
    Main.GRAPH_WIDTH = 500;
    Main.GRAPH_HEIGHT = 500;
    return Main;
})();
;
window.addEventListener("load", function () { new Main(); });
//# sourceMappingURL=main.js.map