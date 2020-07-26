const { ccclass, property } = cc._decorator;

@ccclass
export default class camera extends cc.Component {

    //攝影機位置
    @property(cc.Node)
    camera: cc.Node = null;

    //坦克位置位置
    @property(cc.Node)
    tank: cc.Node = null;

    //攝影機跟坦克之間的偏移
    private offset: cc.Vec2 = cc.v2(0, 0);

    onLoad() {
        //攝影機跟坦克之間的偏移
        if (this.camera != null && this.tank != null) {
            this.offset = this.camera.getPosition().sub(this.tank.getPosition());
        }
    }

    start() {

    }

    update(dt) {
        if (this.camera != null && this.tank != null) {
            //cc.log('攝影機位移');
            this.camera.x = this.tank.x + this.offset.x;
            this.camera.y = this.tank.y + this.offset.y;
        }

    }
}
