import joystick from "./joystick"//引入joystick腳本

const { ccclass, property } = cc._decorator;

@ccclass
export default class ball_ctrl extends cc.Component {

    @property(joystick)
    stick: joystick = null;//拿取搖桿腳本

    @property
    speed: number = 200;//速度初始

    private body: cc.RigidBody = null;//RigidBody組件

    onLoad() {
        //拿組件
        this.body = this.getComponent(cc.RigidBody);
    }

    start() {

    }

    update(dt) {

        //當搖桿為零時停止坦克
        //===為 嚴格等於，因為在JavaSript == 當型態一致是為True 所以用===來強制認定0
        if (this.stick.dir.x === 0 && this.stick.dir.y === 0) {
            this.body.linearVelocity = cc.v2(0, 0);
            return;
        }

        //計算移動速度
        var vx: number = this.stick.dir.x * this.speed;
        var vy: number = this.stick.dir.y * this.speed;
        //移動
        this.body.linearVelocity = cc.v2(vx, vy);

        //計算角度，用反三角Tan計算
        var r: number = Math.atan2(this.stick.dir.y, this.stick.dir.x);
        //轉換成度數
        var degree: number = r * 180 / Math.PI;

        //cc.log(degree);

        //在cocos裡，角度有兩個API
        //1.rotation以順時針為單位旋轉，
        //所以數學上已逆時針旋轉要經過轉換才輸出

        //轉換，以及修正90度誤差
        degree = 360 - degree;
        degree += 90;
        this.node.rotation = degree;

        //2.angle跟rotation相反以逆時針為單位旋轉
        //跟數學一致所以只要修正90度誤差就行
        //degree -= 90;
        //this.node.angle = degree;

    }
}
