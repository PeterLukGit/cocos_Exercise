// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class enable_phy extends cc.Component {

    //引擎預設重力
    @property(cc.Vec2)
    gravity: cc.Vec2 = cc.v2(0, -320);

    //是否開啟Debug畫面
    @property
    is_debug: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    //開啟物理引擎一定要寫在onLoad
    onLoad() {
        // 1.開啟物理引擎
        cc.director.getPhysicsManager().enabled = true;
        //2.設定重力
        cc.director.getPhysicsManager().gravity = this.gravity;
        //配置Debug區域
        if (this.is_debug == true) {
            //啟用Debug繪製
            var Bits: any = cc.PhysicsManager.DrawBits;

            cc.director.getPhysicsManager().debugDrawFlags =
                Bits.e_aabbBit | Bits.e_pairBit | Bits.e_centerOfMassBit | Bits.e_jointBit | Bits.e_shapeBit;
        }
        else {
            cc.director.getPhysicsManager().debugDrawFlags = 0;
        }



    }

    start() {

    }

    // update (dt) {}
}
