const { ccclass, property } = cc._decorator;

@ccclass
export default class joystick extends cc.Component {

    //黃色搖桿位置
    @property(cc.Node)
    stick: cc.Node = null;

    //黃色搖桿位置最大值，使移動時不會超出白色圈範圍
    @property
    max_R: number = 80;

    //黃色搖桿位置最小值
    @property
    min_R: number = 20;

    //搖桿移動的 1單位向量
    @property
    public dir: cc.Vec2 = cc.v2(0, 0);

    // LIFE-CYCLE CALLBACKS:

    //移動搖桿
    on_stick_move(e: cc.Touch): void {
        //變數e 裡面有觸摸事件的數據

        //cc.log('TOUCH_MOVE');

        //拿取觸碰位置
        var screen_pos: cc.Vec2 = e.getLocation();
        //將觸碰位置轉換成物件座標
        var pos: cc.Vec2 = this.node.convertToNodeSpaceAR(screen_pos);

        //為該向量長度
        var len: number = pos.mag();

        //當數值小於最小值跳出函式
        if (len <= this.min_R) {
            //cc.log(len +'len return');
            this.stick.setPosition(pos);
            return;
        }

        this.dir.x = pos.x / len;//用cos 計算X軸單位向量
        this.dir.y = pos.y / len;//用sin 計算Y軸單位向量

        //不要讓搖桿超出邊界
        if (len > this.max_R) {
            pos.x = pos.x * this.max_R / len;
            pos.y = pos.y * this.max_R / len;
        }

        //設定位置
        this.stick.setPosition(pos);

        //cc.log(this.dir.x + '  ' + this.dir.y);
    }

    on_stick_end(): void {
        //cc.log('TOUCH_END');
        //方開後歸零
        this.stick.setPosition(cc.v2(0, 0));
        this.dir = cc.v2(0, 0);
    }


    onLoad() {
        //cc.log('test');

        //將搖桿歸零
        this.stick.setPosition(cc.v2(0, 0));

        //註冊監聽事件
        //this.stick.on("事件類別", 啟動函數,未知This放者就好，不然無法啟動);
        this.stick.on(cc.Node.EventType.TOUCH_MOVE, this.on_stick_move, this);//手指在移動
        this.stick.on(cc.Node.EventType.TOUCH_END, this.on_stick_end, this);//手指在節點內離開
        this.stick.on(cc.Node.EventType.TOUCH_CANCEL, this.on_stick_end, this);//手指在節點外離開

    }

    start() {

    }

    // update (dt) {}
}
