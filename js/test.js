/// <reference path="../libs/easeljs/easeljs.d.ts" />
/**
 * Created by kawakatsu on 2016/03/04.
 */
var Main = (function () {
    function Main() {
        this.init();
    }
    Main.prototype.init = function () {
        // Stageオブジェクトを作成します
        this.stage = new createjs.Stage("myCanvas");
        console.log("test");
        this.draw();
        // Stageの描画を更新します
        this.stage.update();
    };
    Main.prototype.draw = function () {
        var values = [];
        for (var i = 0; i < 100; i++) {
            values[i] = 0;
        }
        for (var i = 0; i < 500; i++) {
            var value = Math.random() * Math.random();
            var tmp = Math.floor(value * 100);
            values[tmp] += 1;
        }
        for (var i = 0; i < 100; i++) {
            console.log(values[i]);
            this.drawPoint(i * 5, values[i] * 10);
        }
    };
    Main.prototype.drawPoint = function (posX, posY) {
        //console.log(posX, posY);
        var shape = new createjs.Shape();
        shape.graphics.beginFill((0x1000000 * Math.random()).toString());
        shape.graphics.drawCircle(0, 0, 5);
        shape.x = posX;
        shape.y = posY;
        this.stage.addChild(shape); // 表示リストに追加
    };
    return Main;
})();
;
window.addEventListener("load", function () { new Main(); });
//# sourceMappingURL=test.js.map