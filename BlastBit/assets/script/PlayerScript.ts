const { ccclass, property } = cc._decorator;

//腳色移動腳本
@ccclass
export default class PlayerScript extends cc.Component {

  //角色
  @property(cc.Node)
  playerNode: cc.Node = null;

  //背景
  @property(cc.Node)
  bg: cc.Node = null;

  //檢測是否發射
  isFire: boolean = false;

  //粒子
  @property(cc.Node)
  boomNode: cc.Node = null;

  //怪物
  @property(cc.Node)
  enemyNode: cc.Node = null;

  //計分label
  @property(cc.Label)
  text: cc.Label = null;

  //分數
  score: number = 0;

  //因在JavaScript是能呼叫就停止動畫但在TypeScript不行，要有宣告
  //動畫
  enemy_tween: cc.Tween = null;
  //動畫
  player_tween: cc.Tween = null;
  //動畫
  player_tween2: cc.Tween = null;

  onLoad() {
    //獲取動畫物件數具
    this.player_tween = cc.tween(this.playerNode);
    this.player_tween2 = cc.tween(this.playerNode);
    this.enemy_tween = cc.tween(this.enemyNode);

    //腳色歸位
    this.placePlayer();
    //怪物歸位
    this.placeEnemy();

    //註冊點擊事件到"發射"上
    this.bg.on(cc.Node.EventType.TOUCH_START, this.fire, this);

    //分數歸零
    this.score = 0;
    this.text.string = this.score.toString();
  }


  //當腳本銷毀時取消註冊事件
  onDestroy() {
    this.bg.off(cc.Node.EventType.TOUCH_START, this.fire, this);
  }

  start() { }


  update(dt) {
    //意思是當角色的位置 小於 兩圖片長度，就是相撞
    if (this.playerNode.position.sub(this.enemyNode.position).mag()
      < this.playerNode.width / 2 + this.enemyNode.width / 2) {

      //停止動畫
      this.enemy_tween.stop();
      this.player_tween.stop();
      this.player_tween2.stop();
      //cc.Tween.stopAll();

      //敵人爆炸
      this.enemyNode.active = false;
      this.boom(this.enemyNode.position, this.enemyNode.color);

      //分數
      this.score++;
      this.text.string = this.score.toString();

      //重製位置
      this.placePlayer();
      this.placeEnemy();
    }


  }

  placeEnemy(): void {

    this.enemyNode.active = true;

    //敵人移動位置點
    let x = cc.winSize.width / 2 - this.enemyNode.width / 2;
    let y = Math.random() * cc.winSize.height / 4;
    let dua = 1 + Math.random() * 0.5;

    //設定敵人初始位置
    this.enemyNode.x = 0;
    this.enemyNode.y = cc.winSize.height / 3 - this.enemyNode.height / 2;

    //讓敵人移動 repeatForever是讓動畫一直重複
    this.enemy_tween.repeatForever(
      cc.tween(this.enemyNode)
        .to(dua, { position: cc.v3(-x, y) })
        .to(dua, { position: cc.v3(x, y) }))
      .start();

  }


  placePlayer(): void {
    //歸位
    cc.log('歸位');
    this.playerNode.active = true;
    this.isFire = false;
    this.playerNode.x = 0;
    this.playerNode.y = -cc.winSize.height / 4;

    //讓物件往下掉
    let dua: number = 10;

    this.player_tween2.to(dua, { position: cc.v3(this.playerNode.x, -(cc.winSize.height / 2) + this.playerNode.height) })
      .call(() => { this.die(); })
      .start();
  }

  //發射動畫
  fire(): void {
    if (this.isFire === true) {
      return;
    }
    this.isFire = true;

    cc.log('發射');

    this.player_tween.stop();

    //速度
    let dua: number = 0.6;

    this.player_tween.to(dua, { position: cc.v3(0, cc.winSize.height / 2) }).call(() => { this.die(); }).start();

    //Cocos 動畫系統有新舊兩種

    //舊版-透過sequence設定順序
    //moveTo移動 callFunc呼叫函式
    // let seq = cc.sequence(cc.moveTo(dua, cc.v2(0, cc.winSize.height / 2)), cc.callFunc(this.die));
    //執行動畫
    //this.playerNode.runAction(seq);

    //新版-透過tween來執行，跟Unity DoTween很像，用 " . "來連接
    //to就是移動，但要用{}來框住要改變的數據
    //call就是呼叫函示
    //cc.tween(this.playerNode).to(dua, { position: cc.v3(0, cc.winSize.height / 2) }).call(this.die).start();

    //!!!重點 call(this.die)跟 call(() => { this.die(); }) 
    //差異在於 call(this.die)裡面die是無法訪問外部變數， call(() => { this.die(); }) 則多一層包裹，變成普通呼叫就能訪問變數
    //cc.tween(this.playerNode).to(dua, { position: cc.v3(0, cc.winSize.height / 2) }).call(() => { this.die(); }).start();


  }

  die(): void {
    cc.log('結束');

    //關閉腳色
    this.playerNode.active = false;
    //呼叫粒子
    this.boom(this.playerNode.position, this.playerNode.color);

    //設定計時器 1000ms後 重製場景
    setTimeout(function () { cc.director.loadScene("game"); }, 1000);


  }

  boom(pos: cc.Vec3, color: cc.Color) {
    //設定爆炸例子位置
    this.boomNode.setPosition(pos);
    //設定顏色
    let particle: cc.ParticleSystem = this.boomNode.getComponent(cc.ParticleSystem);
    if (color !== undefined) {
      particle.startColor = particle.endColor = color;
    }
    //啟動
    particle.resetSystem();
  }

}
