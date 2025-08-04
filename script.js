//グローバル変数
let player = ['name', 'level', 'hp', 'attack', 'maxHP', 'defending', 'hpPotion', 'pwPotion', 'hpupPotion', 'end', 'bonus', 'ultimate', 'coin', 'stage', 'points'];
let enemy = ['name', 'hp', 'attack', 'maxHP', 'coin', 'points'];
let items = ['potion'];
const bgmList = {
    menu: "ver1.4/menu.mp3",
    map: "ver1.4/map.mp3",
    battle: "ver1.4/battle.mp3",
    stageBoss: "ver1.4/stageBoss.mp3",
    heaven: "ver1.5/Heaven.mp3"
};
let currentBGM = null; // 現在のBGM
let fadeInterval = null; // フェード制御用
let flg = ['stage2', 'stage3', 'stage4', 'stage5', 'stage6', 'stage7', 'stageLast', 'stage8', 'stage9', 'stage10', 'stage11', 'stage12', 'stage13', 'stage14', 'castle', 'extra1', 'extra2', 'extra3', 'extra4', 'extra1Win', 'extra2Win', 'extra3Win', 'extra4Win', 'stageLastWin'];

let battleLogLive = [];
let sessionLogs = [];

//プレイヤーの初期設定
player.level = 1;
player.maxHP = 50;
player.hp = 50;
player.attack = 10;
player.bonus = true;
player.coin = 10;
player.stage = 1;
player.hpPotion = 3;
player.pwPotion = 0;
player.hpupPotion = 0;
player.points = 0;

//flgの初期設定
flg.stage2 = false;
flg.stage3 = false;
flg.stage4 = false;
flg.stage5 = false;
flg.stage6 = false;
flg.stage7 = false;
flg.stageLast = false;
flg.stage8 = false;
flg.stage9 = false;
flg.stage10 = false;
flg.stage11 = false;
flg.stage12 = false;
flg.stage13 = false;
flg.stage14 = false;
flg.castle = false;
flg.extra1 = false;
flg.extra1Win = false;
flg.extra2 = false;
flg.extra2Win = false;
flg.extra3 = false;
flg.extra3Win = false;
flg.extra4 = false;
flg.extra4Win = false;
flg.stageLastWin = false;

// ===== セーブ機能 =====
function saveGame() {
    const saveData = {
        player: {
            name: player.name,
            level: player.level,
            maxHP: player.maxHP,
            hp: player.hp,
            attack: player.attack,
            bonus: player.bonus,
            coin: player.coin,
            stage: player.stage,
            hpPotion: player.hpPotion,
            pwPotion: player.pwPotion,
            hpupPotion: player.hpupPotion,
            points: player.points,
        },
        flg: {
            stage2: flg.stage2,
            stage3: flg.stage3,
            stage4: flg.stage4,
            stage5: flg.stage5,
            stage6: flg.stage6,
            stage7: flg.stage7,
            stage8: flg.stage8,
            stage9: flg.stage9,
            stage10: flg.stage10,
            stage11: flg.stage11,
            stage12: flg.stage12,
            stage13: flg.stage13,
            stage14: flg.stage14,
            stageLast: flg.stageLast,
            castle: flg.castle,
            extra1: flg.extra1,
            extra1Win: flg.extra1Win,
            extra2: flg.extra2,
            extra2Win: flg.extra2Win,
            extra3: flg.extra3,
            extra3Win: flg.extra3Win,
            extra4: flg.extra4,
            extra4Win: flg.extra4Win,
            stageLastWin: flg.stageLastWin
        }
    };

    console.log(flg.stage2);

    localStorage.setItem("rpgSaveData", JSON.stringify(saveData));
    alert("セーブしました！");
}

// ===== ロード機能 =====
function loadGame() {
    const data = localStorage.getItem("rpgSaveData");
    if (!data) {
        alert("⚠ セーブデータがありません。");
        return;
    }

    const saveData = JSON.parse(data);

    // プレイヤー復元
    Object.assign(player, saveData.player);

    // フラグ復元
    flg = saveData.flg;

    // ステージ表示の復元
    document.getElementById("extra1").style.display = (flg.extra1 && !flg.extra1Win) ? "block" : "none";
    document.getElementById("extra2").style.display = (flg.extra2 && !flg.extra2Win) ? "block" : "none";
    document.getElementById("extra3").style.display = (flg.extra3 && !flg.extra3Win) ? "block" : "none";
    document.getElementById("extra4").style.display = (flg.extra4 && !flg.extra4Win) ? "block" : "none";

    if (flg.stage5) {
        document.getElementById("kumo").style.display = "none";
        document.getElementById("stage5").style.display = "block";
        document.getElementById("stage6").style.display = "block";
    }
    if (flg.stage7) {
        document.getElementById("stage7").style.display = "block";
    }
    if (flg.stageLastWin) {
        let mapMoveToHeaven = document.getElementById('mapMoveToHeaven');
        mapMoveToHeaven.style.display = "block";
    }
    if (flg.stageLastWin && !player.name.startsWith("👑")) {
        player.name = "👑" + player.name;
    }
    if (flg.extra4Win && !player.name.endsWith("🍜")) {
        player.name = player.name + "🍜";
    }
    document.getElementById("stageLast").style.display = (flg.stageLast && !flg.stageLastWin) ? "block" : "none";

    updatePointsDisplay();
    alert("セーブデータをロードしました！");
    menuOpen();
}


// 指定したパネルID(sectionIds)だけを表示し、それ以外を非表示にする
function showSection(sectionIds) {
    //確認ログ（sectionIdsの値）
    console.log(sectionIds);
    const allSections = ['startMenu', 'castle', 'menu', 'map', 'gameUI', 'logPanel', 'sessionLogPanel', 'restartMenu', 'instructionsPanel', 'enemyListPanel', 'itemshop', 'weaponshop', 'mapHeaven'];

    allSections.forEach(id => {
        const element = document.getElementById(id);
        if (sectionIds.includes(id)) {
            console.log("block:" + id);
            element.style.display = "block";
        } else {
            console.log("none:" + id);
            element.style.display = "none";
        }
    });
}

//ゲームスタートでMAPに遷移
function playGames() {
    stopBGM();
    console.log("MAXHP" + player.maxHP);
    console.log("HP" + player.hp);
    console.log("POINTS" + player.points);
    console.log("ATTACK" + player.attack);
    let overlay = document.getElementById("overlay");
    overlay.style.display = "none";
    let gameClearPanel = document.getElementById('gameClearPanel');
    gameClearPanel.style.display = "none";
    let extra1 = document.getElementById("extra1");
    extra1.style.display = "none";
    let extra2 = document.getElementById("extra2");
    extra2.style.display = "none";
    let extra3 = document.getElementById("extra3");
    extra3.style.display = "none";
    let extra4 = document.getElementById("extra4");
    extra4.style.display = "none";
    let stageLast = document.getElementById("stageLast");
    stageLast.style.display = "none";
    let playerInput = document.getElementById("playerInput");
    player.name = playerInput.value.trim();
    let effect = document.getElementById("effect");
    effect.innerHTML = "";
    let mapMoveToHeaven = document.getElementById('mapMoveToHeaven');
    mapMoveToHeaven.style.display = "none";
    let sectionIds = [];

    if (!player.name) {
        alert("名前を入力してください！");
    } else {
        if (player.name === "最強") {
            player.maxHP = 5545;
            player.hp = 5545;
            player.attack = 500;
            player.coin = 1000000;
            player.defending = false;
            player.hpPotion = 300;
            player.level = 100;
            player.points = 0;
            flg.stage2 = true;
            flg.stage3 = true;
            flg.stage4 = true;
            flg.stage5 = true;
            flg.stage6 = true;
            flg.stage7 = true;
            flg.stageLast = true;
            flg.stage8 = true;
            flg.stage9 = true;
            flg.stage10 = false;
            flg.stage11 = false;
            flg.stage12 = false;
            flg.stage13 = false;
            flg.stage14 = false;
            flg.castle = true;
            flg.extra1 = true;
            flg.extra2 = true;
        }
        //画面表示
        let map = document.getElementById("map");
        playBGM("map");
        sectionIds.push(map.id);
        showSection(sectionIds);
    }
}

//メニューを開く
function menuOpen() {
    stopBGM();
    playBGM("menu");
    player.hp = player.maxHP;
    let sectionIds = [];
    let menu = document.getElementById("menu");
    sectionIds.push(menu.id);
    //ステータス画面で表示
    let Level = document.getElementById("Level");
    Level.innerHTML = player.level;
    let Name = document.getElementById("Name");
    Name.innerHTML = player.name;
    let HP = document.getElementById("HP");
    HP.innerHTML = player.hp;
    let Attack = document.getElementById("Attack");
    Attack.innerHTML = player.attack;
    let Coin = document.getElementById("Coin");
    Coin.innerHTML = player.coin;
    haveItems();
    showSection(sectionIds);
}

//メニュー画面で持ち物を表示する
function haveItems() {
    let hpPotion = document.getElementById("hpPotion");
    let pwPotion = document.getElementById("pwPotion");
    let hpupPotion = document.getElementById("hpupPotion");
    let have1 = document.getElementById("have1");
    let have2 = document.getElementById("have2");
    let have3 = document.getElementById("have3");
    let no = document.getElementById("no");
    if (player.hpPotion > 0) {
        no.style.display = "none";
        hpPotion.style.display = "block";
        have1.innerHTML = player.hpPotion;
    }
    if (player.pwPotion > 0) {
        no.style.display = "none";
        pwPotion.style.display = "block";
        have2.innerHTML = player.pwPotion;
    }
    if (player.hpupPotion > 0) {
        no.style.display = "none";
        hpupPotion.style.display = "block";
        have3.innerHTML = player.hpupPotion;
    }
    if (player.hpPotion === 0 && player.pwPotion === 0 && player.hpupPotion === 0) {
        no.style.display = "block";
        hpPotion.style.display = "none";
        pwPotion.style.display = "none";
        hpupPotion.style.display = "none";
    }
}

//メニューを閉じる
function menuClose() {
    stopBGM();
    playBGM("map");
    let sectionIds = [];
    let map = document.getElementById("map");
    sectionIds.push(map.id);
    showSection(sectionIds);
}


//戦闘時のbugを閉じる
function closeBug() {
    let attackBtn = document.getElementById("attackBtn");
    let defendBtn = document.getElementById("defendBtn");
    let itemsBtn = document.getElementById("itemsBtn");
    attackBtn.disabled = false;
    defendBtn.disabled = false;
    itemsBtn.disabled = false;
    let overlay = document.getElementById("overlay");
    overlay.style.display = "none";
}

//お城のメニューを閉じる
function castleShow() {
    let sectionIds = [];
    if (flg.castle) {
        //画面表示
        let castle = document.getElementById("castle");
        sectionIds.push(castle.id);
        showSection(sectionIds);
    } else {
        alert("進めないようだ…");
    }
}

//治癒のポーションを購入する
function buyHpPotion() {
    if (player.coin < 30000) {
        alert("コインが足りません");
    } else {
        player.coin -= 30000;
        player.hpPotion += 1;
        alert("治癒のポーションを購入しました！");
    }
}

//力のポーションを購入する
function buyPwPotion() {
    if (player.coin < 50000) {
        alert("コインが足りません");
    } else {
        player.coin -= 50000;
        player.pwPotion += 1;
        alert("力のポーションを購入しました！");
    }
}

//体力のポーションを購入する
function buyHpUpPotion() {
    if (player.coin < 60000) {
        alert("コインが足りません");
    } else {
        player.coin -= 60000;
        player.hpupPotion += 1;
        alert("体力のポーションを購入しました！");
    }
}

//ゲーム開始/stage1
function startGames1() {
    stopBGM();
    let effect = document.getElementById("effect");
    effect.innerHTML = "";
    player.stage = 1;
    let sectionIds = [];

    //画面表示
    gameUI = document.getElementById("gameUI");
    logPanel = document.getElementById("logPanel");
    sectionIds.push(gameUI.id, logPanel.id);
    showSection(sectionIds);

    //初期化:HP/ポーション/防御
    player.hp = player.maxHP;
    player.defending = false;
    player.end = false;

    let playerLevel = document.getElementById("playerLevel");
    playerLevel.innerHTML = player.level;

    let playerName = document.getElementById("playerName");
    playerName.innerHTML = player.name;

    let playerAttack = document.getElementById("playerAttack");
    playerAttack.innerHTML = player.attack;

    //敵キャラクターを生成
    generateEnemy1();

    //戦闘ログ初期化（配置と表示）
    let battleLog = document.getElementById("battleLog");
    battleLog.innerHTML = "";
    console.log("battleLogLive初期化:" + battleLogLive);

    //ステータス表示更新処理
    updateDisplay();

    //バトルBGM再生
    if (enemy.name === 'ゲベロペ') {
        playBGM("stageBoss");
    } else {
        playBGM("battle");
    }
}

//ゲーム開始/stage2
function startGames2() {
    if (flg.stage2) {
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 2;
        let sectionIds = [];

        //画面表示
        gameUI = document.getElementById("gameUI");
        logPanel = document.getElementById("logPanel");
        sectionIds.push(gameUI.id, logPanel.id);
        showSection(sectionIds);

        //初期化:HP/ポーション/防御
        player.hp = player.maxHP;
        player.defending = false;
        player.end = false;

        let playerLevel = document.getElementById("playerLevel");
        playerLevel.innerHTML = player.level;

        let playerName = document.getElementById("playerName");
        playerName.innerHTML = player.name;

        let playerAttack = document.getElementById("playerAttack");
        playerAttack.innerHTML = player.attack;

        //敵キャラクターを生成
        generateEnemy2();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        if (enemy.name === 'ガーゴイル') {
            playBGM("stageBoss");
        } else {
            playBGM("battle");
        }
    } else {
        alert("進めないようだ…");
    }
}

//ゲーム開始/stage3
function startGames3() {
    if (flg.stage3) {
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 3;
        let sectionIds = [];

        //画面表示
        gameUI = document.getElementById("gameUI");
        logPanel = document.getElementById("logPanel");
        sectionIds.push(gameUI.id, logPanel.id);
        showSection(sectionIds);

        //初期化:HP/ポーション/防御
        player.hp = player.maxHP;
        player.defending = false;
        player.end = false;

        let playerLevel = document.getElementById("playerLevel");
        playerLevel.innerHTML = player.level;

        let playerName = document.getElementById("playerName");
        playerName.innerHTML = player.name;

        let playerAttack = document.getElementById("playerAttack");
        playerAttack.innerHTML = player.attack;

        //敵キャラクターを生成
        generateEnemy3();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        if (enemy.name === 'スノーワイバーン') {
            playBGM("stageBoss");
        } else {
            playBGM("battle");
        }
    } else {
        alert("進めないようだ…");
    }
}

//ゲーム開始/stage4
function startGames4() {
    if (flg.stage4) {
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 4;
        let sectionIds = [];

        //画面表示
        gameUI = document.getElementById("gameUI");
        logPanel = document.getElementById("logPanel");
        sectionIds.push(gameUI.id, logPanel.id);
        showSection(sectionIds);

        //初期化:HP/ポーション/防御
        player.hp = player.maxHP;
        player.defending = false;
        player.end = false;

        let playerLevel = document.getElementById("playerLevel");
        playerLevel.innerHTML = player.level;

        let playerName = document.getElementById("playerName");
        playerName.innerHTML = player.name;

        let playerAttack = document.getElementById("playerAttack");
        playerAttack.innerHTML = player.attack;

        //敵キャラクターを生成
        generateEnemy4();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        if (enemy.name === '大天使') {
            playBGM("stageBoss");
        } else {
            playBGM("battle");
        }
    } else {
        alert("進めないようだ…");
    }
}

//ゲーム開始/stage5
function startGames5() {
    if (flg.stage5) {
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 5;
        let sectionIds = [];

        //画面表示
        gameUI = document.getElementById("gameUI");
        logPanel = document.getElementById("logPanel");
        sectionIds.push(gameUI.id, logPanel.id);
        showSection(sectionIds);

        //初期化:HP/ポーション/防御
        player.hp = player.maxHP;
        player.defending = false;
        player.end = false;

        let playerLevel = document.getElementById("playerLevel");
        playerLevel.innerHTML = player.level;

        let playerName = document.getElementById("playerName");
        playerName.innerHTML = player.name;

        let playerAttack = document.getElementById("playerAttack");
        playerAttack.innerHTML = player.attack;

        //敵キャラクターを生成
        generateEnemy5();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        if (enemy.name === 'ヴェノメギド') {
            playBGM("stageBoss");
        } else {
            playBGM("battle");
        }
    } else {
        alert("進めないようだ…");
    }
}

//ゲーム開始/stage6
function startGames6() {
    if (flg.stage6) {
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 6;
        let sectionIds = [];

        //画面表示
        gameUI = document.getElementById("gameUI");
        logPanel = document.getElementById("logPanel");
        sectionIds.push(gameUI.id, logPanel.id);
        showSection(sectionIds);

        //初期化:HP/ポーション/防御
        player.hp = player.maxHP;
        player.defending = false;
        player.end = false;

        let playerLevel = document.getElementById("playerLevel");
        playerLevel.innerHTML = player.level;

        let playerName = document.getElementById("playerName");
        playerName.innerHTML = player.name;

        let playerAttack = document.getElementById("playerAttack");
        playerAttack.innerHTML = player.attack;

        //敵キャラクターを生成
        generateEnemy6();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        if (enemy.name === 'インフェルナード') {
            playBGM("stageBoss");
        } else {
            playBGM("battle");
        }
    } else {
        alert("進めないようだ…");
    }
}

//ゲーム開始/stage7
function startGames7() {
    if (flg.stage7) {
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 7;
        let sectionIds = [];

        //画面表示
        gameUI = document.getElementById("gameUI");
        logPanel = document.getElementById("logPanel");
        sectionIds.push(gameUI.id, logPanel.id);
        showSection(sectionIds);

        //初期化:HP/ポーション/防御
        player.hp = player.maxHP;
        player.defending = false;
        player.end = false;

        let playerLevel = document.getElementById("playerLevel");
        playerLevel.innerHTML = player.level;

        let playerName = document.getElementById("playerName");
        playerName.innerHTML = player.name;

        let playerAttack = document.getElementById("playerAttack");
        playerAttack.innerHTML = player.attack;

        //敵キャラクターを生成
        generateEnemy7();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        if (enemy.name === 'グリムヴェイル') {
            playBGM("stageBoss");
        } else {
            playBGM("battle");
        }
    } else {
        alert("進めないようだ…");
    }
}

//ゲーム開始/stageLast
function startGamesLast() {
    if (flg.stageLast) {
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 'last';
        let sectionIds = [];

        //画面表示
        gameUI = document.getElementById("gameUI");
        logPanel = document.getElementById("logPanel");
        sectionIds.push(gameUI.id, logPanel.id);
        showSection(sectionIds);

        //初期化:HP/ポーション/防御
        player.hp = player.maxHP;
        player.defending = false;
        player.end = false;

        let playerLevel = document.getElementById("playerLevel");
        playerLevel.innerHTML = player.level;

        let playerName = document.getElementById("playerName");
        playerName.innerHTML = player.name;

        let playerAttack = document.getElementById("playerAttack");
        playerAttack.innerHTML = player.attack;

        //敵キャラクターを生成
        generateEnemyLast();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        playBGM("stageBoss");
    } else {
        alert("進めないようだ…");
    }
}

//ゲーム開始/stage8
function startGames8() {
    if (flg.stage8) {
        let map1 = document.getElementById("map1");
        map1.style.display = "none";
        let map2 = document.getElementById("map2");
        map2.style.display = "block";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 8;
        let sectionIds = [];

        //画面表示
        gameUI = document.getElementById("gameUI");
        logPanel = document.getElementById("logPanel");
        sectionIds.push(gameUI.id, logPanel.id);
        showSection(sectionIds);

        //初期化:HP/ポーション/防御
        player.hp = player.maxHP;
        player.defending = false;
        player.end = false;

        let playerLevel = document.getElementById("playerLevel");
        playerLevel.innerHTML = player.level;

        let playerName = document.getElementById("playerName");
        playerName.innerHTML = player.name;

        let playerAttack = document.getElementById("playerAttack");
        playerAttack.innerHTML = player.attack;

        //敵キャラクターを生成
        generateEnemy8();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        if (enemy.name === 'アストラルドラコ') {
            playBGM("stageBoss");
        } else {
            playBGM("battle");
        }
    } else {
        alert("進めないようだ…");
    }
}

//ゲーム開始/stage9
function startGames9() {
    if (flg.stage9) {
        let map1 = document.getElementById("map1");
        map1.style.display = "none";
        let map2 = document.getElementById("map2");
        map2.style.display = "block";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 9;
        let sectionIds = [];

        //画面表示
        gameUI = document.getElementById("gameUI");
        logPanel = document.getElementById("logPanel");
        sectionIds.push(gameUI.id, logPanel.id);
        showSection(sectionIds);

        //初期化:HP/ポーション/防御
        player.hp = player.maxHP;
        player.defending = false;
        player.end = false;

        let playerLevel = document.getElementById("playerLevel");
        playerLevel.innerHTML = player.level;

        let playerName = document.getElementById("playerName");
        playerName.innerHTML = player.name;

        let playerAttack = document.getElementById("playerAttack");
        playerAttack.innerHTML = player.attack;

        //敵キャラクターを生成
        generateEnemy9();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        if (enemy.name === 'ザルヴァドス') {
            playBGM("stageBoss");
        } else {
            playBGM("battle");
        }
    } else {
        alert("進めないようだ…");
    }
}

//ゲーム開始/stage10
function startGames10() {
    if (flg.stage10) {
        let map1 = document.getElementById("map1");
        map1.style.display = "none";
        let map2 = document.getElementById("map2");
        map2.style.display = "block";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 10;
        let sectionIds = [];

        //画面表示
        gameUI = document.getElementById("gameUI");
        logPanel = document.getElementById("logPanel");
        sectionIds.push(gameUI.id, logPanel.id);
        showSection(sectionIds);

        //初期化:HP/ポーション/防御
        player.hp = player.maxHP;
        player.defending = false;
        player.end = false;

        let playerLevel = document.getElementById("playerLevel");
        playerLevel.innerHTML = player.level;

        let playerName = document.getElementById("playerName");
        playerName.innerHTML = player.name;

        let playerAttack = document.getElementById("playerAttack");
        playerAttack.innerHTML = player.attack;

        //敵キャラクターを生成
        generateEnemy10();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        if (enemy.name === 'セラフィオス') {
            playBGM("stageBoss");
        } else {
            playBGM("battle");
        }
    } else {
        alert("進めないようだ…");
    }
}

//ゲーム開始/stage11
function startGames11() {
    if (flg.stage11) {
        let map1 = document.getElementById("map1");
        map1.style.display = "none";
        let map2 = document.getElementById("map2");
        map2.style.display = "block";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 11;
        let sectionIds = [];

        //画面表示
        gameUI = document.getElementById("gameUI");
        logPanel = document.getElementById("logPanel");
        sectionIds.push(gameUI.id, logPanel.id);
        showSection(sectionIds);

        //初期化:HP/ポーション/防御
        player.hp = player.maxHP;
        player.defending = false;
        player.end = false;

        let playerLevel = document.getElementById("playerLevel");
        playerLevel.innerHTML = player.level;

        let playerName = document.getElementById("playerName");
        playerName.innerHTML = player.name;

        let playerAttack = document.getElementById("playerAttack");
        playerAttack.innerHTML = player.attack;

        //敵キャラクターを生成
        generateEnemy11();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        if (enemy.name === 'オルディア') {
            playBGM("stageBoss");
        } else {
            playBGM("battle");
        }
    } else {
        alert("進めないようだ…");
    }
}

//ゲーム開始/stage12
function startGames12() {
    if (flg.stage12) {
        let map1 = document.getElementById("map1");
        map1.style.display = "none";
        let map2 = document.getElementById("map2");
        map2.style.display = "block";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 12;
        let sectionIds = [];

        //画面表示
        gameUI = document.getElementById("gameUI");
        logPanel = document.getElementById("logPanel");
        sectionIds.push(gameUI.id, logPanel.id);
        showSection(sectionIds);

        //初期化:HP/ポーション/防御
        player.hp = player.maxHP;
        player.defending = false;
        player.end = false;

        let playerLevel = document.getElementById("playerLevel");
        playerLevel.innerHTML = player.level;

        let playerName = document.getElementById("playerName");
        playerName.innerHTML = player.name;

        let playerAttack = document.getElementById("playerAttack");
        playerAttack.innerHTML = player.attack;

        //敵キャラクターを生成
        generateEnemy12();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        if (enemy.name === 'ルシフェル') {
            playBGM("stageBoss");
        } else {
            playBGM("battle");
        }
    } else {
        alert("進めないようだ…");
    }
}

//ゲーム開始/stage13
function startGames13() {
    if (flg.stage13) {
        let map1 = document.getElementById("map1");
        map1.style.display = "none";
        let map2 = document.getElementById("map2");
        map2.style.display = "block";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 13;
        let sectionIds = [];

        //画面表示
        gameUI = document.getElementById("gameUI");
        logPanel = document.getElementById("logPanel");
        sectionIds.push(gameUI.id, logPanel.id);
        showSection(sectionIds);

        //初期化:HP/ポーション/防御
        player.hp = player.maxHP;
        player.defending = false;
        player.end = false;

        let playerLevel = document.getElementById("playerLevel");
        playerLevel.innerHTML = player.level;

        let playerName = document.getElementById("playerName");
        playerName.innerHTML = player.name;

        let playerAttack = document.getElementById("playerAttack");
        playerAttack.innerHTML = player.attack;

        //敵キャラクターを生成
        generateEnemy13();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        if (enemy.name === 'アストラリオン') {
            playBGM("stageBoss");
        } else {
            playBGM("battle");
        }
    } else {
        alert("進めないようだ…");
    }
}

//ゲーム開始/stage14
function startGames14() {
    if (flg.stage14) {
        let map1 = document.getElementById("map1");
        map1.style.display = "none";
        let map2 = document.getElementById("map2");
        map2.style.display = "block";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 14;
        let sectionIds = [];

        //画面表示
        gameUI = document.getElementById("gameUI");
        logPanel = document.getElementById("logPanel");
        sectionIds.push(gameUI.id, logPanel.id);
        showSection(sectionIds);

        //初期化:HP/ポーション/防御
        player.hp = player.maxHP;
        player.defending = false;
        player.end = false;

        let playerLevel = document.getElementById("playerLevel");
        playerLevel.innerHTML = player.level;

        let playerName = document.getElementById("playerName");
        playerName.innerHTML = player.name;

        let playerAttack = document.getElementById("playerAttack");
        playerAttack.innerHTML = player.attack;

        //敵キャラクターを生成
        generateEnemy14();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        if (enemy.name === 'アビスファング') {
            playBGM("stageBoss");
        } else {
            playBGM("battle");
        }
    } else {
        alert("進めないようだ…");
    }
}

function extra1() {
    if (flg.extra1) {
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 'ex1';
        let sectionIds = [];

        //画面表示
        gameUI = document.getElementById("gameUI");
        logPanel = document.getElementById("logPanel");
        sectionIds.push(gameUI.id, logPanel.id);
        showSection(sectionIds);

        //初期化:HP/ポーション/防御
        player.hp = player.maxHP;
        player.defending = false;
        player.end = false;

        let playerLevel = document.getElementById("playerLevel");
        playerLevel.innerHTML = player.level;

        let playerName = document.getElementById("playerName");
        playerName.innerHTML = player.name;

        let playerAttack = document.getElementById("playerAttack");
        playerAttack.innerHTML = player.attack;

        //敵キャラクターを生成
        generateEnemyExtra1();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        playBGM("stageBoss");
    } else {
        alert("進めないようだ…");
    }
}

function extra2() {
    if (flg.extra2) {
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 'ex2';
        let sectionIds = [];

        //画面表示
        gameUI = document.getElementById("gameUI");
        logPanel = document.getElementById("logPanel");
        sectionIds.push(gameUI.id, logPanel.id);
        showSection(sectionIds);

        //初期化:HP/ポーション/防御
        player.hp = player.maxHP;
        player.defending = false;
        player.end = false;

        let playerLevel = document.getElementById("playerLevel");
        playerLevel.innerHTML = player.level;

        let playerName = document.getElementById("playerName");
        playerName.innerHTML = player.name;

        let playerAttack = document.getElementById("playerAttack");
        playerAttack.innerHTML = player.attack;

        //敵キャラクターを生成
        generateEnemyExtra2();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        playBGM("stageBoss");
    } else {
        alert("進めないようだ…");
    }
}

function extra3() {
    if (flg.extra3) {
        let map1 = document.getElementById("map1");
        map1.style.display = "none";
        let map2 = document.getElementById("map2");
        map2.style.display = "block";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 'ex3';
        let sectionIds = [];

        //画面表示
        gameUI = document.getElementById("gameUI");
        logPanel = document.getElementById("logPanel");
        sectionIds.push(gameUI.id, logPanel.id);
        showSection(sectionIds);

        //初期化:HP/ポーション/防御
        player.hp = player.maxHP;
        player.defending = false;
        player.end = false;

        let playerLevel = document.getElementById("playerLevel");
        playerLevel.innerHTML = player.level;

        let playerName = document.getElementById("playerName");
        playerName.innerHTML = player.name;

        let playerAttack = document.getElementById("playerAttack");
        playerAttack.innerHTML = player.attack;

        //敵キャラクターを生成
        generateEnemyExtra3();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        playBGM("stageBoss");
    } else {
        alert("進めないようだ…");
    }
}

function extra4() {
    if (flg.extra4) {
        let map1 = document.getElementById("map1");
        map1.style.display = "none";
        let map2 = document.getElementById("map2");
        map2.style.display = "block";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 'ex4';
        let sectionIds = [];

        //画面表示
        gameUI = document.getElementById("gameUI");
        logPanel = document.getElementById("logPanel");
        sectionIds.push(gameUI.id, logPanel.id);
        showSection(sectionIds);

        //初期化:HP/ポーション/防御
        player.hp = player.maxHP;
        player.defending = false;
        player.end = false;

        let playerLevel = document.getElementById("playerLevel");
        playerLevel.innerHTML = player.level;

        let playerName = document.getElementById("playerName");
        playerName.innerHTML = player.name;

        let playerAttack = document.getElementById("playerAttack");
        playerAttack.innerHTML = player.attack;

        //敵キャラクターを生成
        generateEnemyExtra4();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        playBGM("stageBoss");
    } else {
        alert("進めないようだ…");
    }
}

//敵キャラクターの生成/stage1
function generateEnemy1() {
    //敵のHPと攻撃力を定義
    if (player.level > 1) {
        let types = ['スライム', 'ゴブリン', 'ゲベロペ'];

        //敵キャラクターのランダム取得
        let selected = Math.floor(Math.random() * types.length);
        enemy.name = types[selected];

        let monster = document.getElementById("monster");
        let area = document.getElementById("area");
        switch (enemy.name) {
            case 'スライム':
                enemy.name = 'スライム';
                enemy.hp = 50;
                enemy.attack = 5;
                enemy.maxHP = 50;
                enemy.coin = 10;
                enemy.level = 1;
                enemy.points = 60;
                area.innerHTML = "<img src='stage1/area1.png' alt='背景' width='100%' height='620px'>";
                monster.innerHTML = "<img src='stage1/スライム.png' alt='背景' width='100%' height='180px'>";
                slime()
                break;
            case 'ゴブリン':
                enemy.name = 'ゴブリン';
                enemy.hp = 67;
                enemy.attack = 8;
                enemy.maxHP = 67;
                enemy.coin = 20;
                enemy.level = 3;
                enemy.points = 80;
                area.innerHTML = "<img src='stage1/area1.png' alt='背景' width='100%' height='620px'>";
                monster.innerHTML = "<img src='stage1/ゴブリン.png' alt='背景' width='100%' height='180px'>";
                break;
            case 'ゲベロペ':
                enemy.name = 'ゲベロペ';
                enemy.hp = 100;
                enemy.attack = 17;
                enemy.maxHP = 100;
                enemy.coin = 500;
                enemy.level = 7;
                enemy.points = 200;
                area.innerHTML = "<img src='stage1/area1.png' alt='背景' width='100%' height='620px'>";
                monster.innerHTML = "<img src='stage1/ゲベロペ.png' alt='背景' width='100%' height='220px'>";
                break;
            default:
                break;
        }
    } else if (player.level === 1) {
        let types = ['スライム'];

        //敵キャラクターのランダム取得
        let selected = Math.floor(Math.random() * types.length);
        enemy.name = types[selected];

        let monster = document.getElementById("monster");
        let area = document.getElementById("area");
        switch (enemy.name) {
            case 'スライム':
                enemy.name = 'スライム';
                enemy.hp = 50;
                enemy.attack = 1;
                enemy.maxHP = 50;
                enemy.coin = 10;
                enemy.level = 1;
                enemy.points = 100;
                area.innerHTML = "<img src='stage1/area1.png' alt='背景' width='100%' height='620px'>";
                monster.innerHTML = "<img src='stage1/スライム.png' alt='背景' width='100%' height='180px'>";
                break;
            default:
                break;
        }
    }
    //確認ログ（敵:name/HP/attack/maxHP）
    console.log(enemy.name, enemy.hp, enemy.attack, enemy.maxHP);

    let enemyName = document.getElementById("enemyName");
    enemyName.innerHTML = enemy.name;
    let enemyLevel = document.getElementById("enemyLevel");
    enemyLevel.innerHTML = enemy.level;
}

//敵キャラクターの生成/stage2
function generateEnemy2() {
    //敵のHPと攻撃力を定義
    let types = ['ゾンビ', 'マミー', 'ガーゴイル'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case 'ゾンビ':
            enemy.name = 'ゾンビ';
            enemy.hp = 120;
            enemy.attack = 20;
            enemy.maxHP = 120;
            enemy.coin = 1100;
            enemy.level = 10;
            enemy.points = 150;
            area.innerHTML = "<img src='stage2/area2.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage2/ゾンビ.png' alt='背景' width='100%' height='150px'>";
            darkNight();
            break;
        case 'マミー':
            enemy.name = 'マミー';
            enemy.hp = 110;
            enemy.attack = 22;
            enemy.maxHP = 110;
            enemy.coin = 1000;
            enemy.level = 12;
            enemy.points = 180;
            area.innerHTML = "<img src='stage2/area2.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage2/マミー.png' alt='背景' width='100%' height='150px'>";
            break;
        case 'ガーゴイル':
            enemy.name = 'ガーゴイル';
            enemy.hp = 190;
            enemy.attack = 30;
            enemy.maxHP = 190;
            enemy.coin = 2000;
            enemy.level = 18;
            enemy.points = 210;
            area.innerHTML = "<img src='stage2/area2.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage2/ガーゴイル.png' alt='背景' width='100%' height='180px'>";
            break;
        default:
            break;
    }
    //確認ログ（敵:name/HP/attack/maxHP）
    console.log(enemy.name, enemy.hp, enemy.attack, enemy.maxHP);

    let enemyName = document.getElementById("enemyName");
    enemyName.innerHTML = enemy.name;
    let enemyLevel = document.getElementById("enemyLevel");
    enemyLevel.innerHTML = enemy.level;
}

//敵キャラクターの生成/stage3
function generateEnemy3() {
    //敵のHPと攻撃力を定義
    let types = ['雪男', 'スノーフェアリー', 'スノーワイバーン'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case '雪男':
            enemy.name = '雪男';
            enemy.hp = 210;
            enemy.attack = 25;
            enemy.maxHP = 210;
            enemy.coin = 2100;
            enemy.level = 20;
            enemy.points = 200;
            area.innerHTML = "<img src='stage3/area3.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage3/雪男.png' alt='背景' width='100%' height='200px'>";
            frost();
            break;
        case 'スノーフェアリー':
            enemy.name = 'スノーフェアリー';
            enemy.hp = 180;
            enemy.attack = 30;
            enemy.maxHP = 180;
            enemy.coin = 2000;
            enemy.level = 22;
            enemy.points = 210;
            area.innerHTML = "<img src='stage3/area3.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage3/スノーフェアリー.png' alt='背景' width='100%' height='180px'>";
            break;
        case 'スノーワイバーン':
            enemy.name = 'スノーワイバーン';
            enemy.hp = 300;
            enemy.attack = 40;
            enemy.maxHP = 300;
            enemy.coin = 3000;
            enemy.level = 28;
            enemy.points = 280;
            area.innerHTML = "<img src='stage3/area3.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage3/スノーワイバーン.png' alt='背景' width='100%' height='250px'>";
            break;
        default:
            break;
    }
    //確認ログ（敵:name/HP/attack/maxHP）
    console.log(enemy.name, enemy.hp, enemy.attack, enemy.maxHP);

    let enemyName = document.getElementById("enemyName");
    enemyName.innerHTML = enemy.name;
    let enemyLevel = document.getElementById("enemyLevel");
    enemyLevel.innerHTML = enemy.level;
}

//敵キャラクターの生成/stage4
function generateEnemy4() {
    //敵のHPと攻撃力を定義
    let types = ['レッドドラゴン', 'ウィッチ', '大天使'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case 'レッドドラゴン':
            enemy.name = 'レッドドラゴン';
            enemy.hp = 400;
            enemy.attack = 50;
            enemy.maxHP = 400;
            enemy.coin = 3600;
            enemy.level = 36;
            enemy.points = 290;
            area.innerHTML = "<img src='stage4/area4.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage4/レッドドラゴン.png' alt='背景' width='100%' height='250px'>";
            dragon();
            break;
        case 'ウィッチ':
            enemy.name = 'ウィッチ';
            enemy.hp = 340;
            enemy.attack = 43;
            enemy.maxHP = 340;
            enemy.coin = 3300;
            enemy.level = 30;
            enemy.points = 270;
            area.innerHTML = "<img src='stage4/area4.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage4/ウィッチ.png' alt='背景' width='100%' height='180px'>";
            break;
        case '大天使':
            enemy.name = '大天使';
            enemy.hp = 530;
            enemy.attack = 57;
            enemy.maxHP = 530;
            enemy.coin = 4000;
            enemy.level = 41;
            enemy.points = 330;
            area.innerHTML = "<img src='stage4/area4.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage4/大天使.png' alt='背景' width='100%' height='250px'>";
            break;
        default:
            break;
    }
    //確認ログ（敵:name/HP/attack/maxHP）
    console.log(enemy.name, enemy.hp, enemy.attack, enemy.maxHP);

    let enemyName = document.getElementById("enemyName");
    enemyName.innerHTML = enemy.name;
    let enemyLevel = document.getElementById("enemyLevel");
    enemyLevel.innerHTML = enemy.level;
}

//敵キャラクターの生成/stage5
function generateEnemy5() {
    //敵のHPと攻撃力を定義
    let types = ['フングリード', 'グルームリッチ', 'ヴェノメギド'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case 'フングリード':
            enemy.name = 'フングリード';
            enemy.hp = 570;
            enemy.attack = 60;
            enemy.maxHP = 570;
            enemy.coin = 4200;
            enemy.level = 44;
            enemy.points = 370;
            area.innerHTML = "<img src='stage5/area5.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage5/フングリード.png' alt='背景' width='100%' height='250px'>";
            morbasylisk();
            break;
        case 'グルームリッチ':
            enemy.name = 'グルームリッチ';
            enemy.hp = 590;
            enemy.attack = 63;
            enemy.maxHP = 590;
            enemy.coin = 5000;
            enemy.level = 47;
            enemy.points = 390;
            area.innerHTML = "<img src='stage5/area5.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage5/グルームリッチ.png' alt='背景' width='100%' height='180px'>";
            break;
        case 'ヴェノメギド':
            enemy.name = 'ヴェノメギド';
            enemy.hp = 670;
            enemy.attack = 68;
            enemy.maxHP = 670;
            enemy.coin = 5500;
            enemy.level = 53;
            enemy.points = 420;
            area.innerHTML = "<img src='stage5/area5.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage5/ヴェノメギド.png' alt='背景' width='100%' height='250px'>";
            break;
        default:
            break;
    }
    //確認ログ（敵:name/HP/attack/maxHP）
    console.log(enemy.name, enemy.hp, enemy.attack, enemy.maxHP);

    let enemyName = document.getElementById("enemyName");
    enemyName.innerHTML = enemy.name;
    let enemyLevel = document.getElementById("enemyLevel");
    enemyLevel.innerHTML = enemy.level;
}

//敵キャラクターの生成/stage6
function generateEnemy6() {
    //敵のHPと攻撃力を定義
    let types = ['フレイモン', 'フェニクレスト', 'インフェルナード'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case 'フレイモン':
            enemy.name = 'フレイモン';
            enemy.hp = 680;
            enemy.attack = 71;
            enemy.maxHP = 680;
            enemy.coin = 5300;
            enemy.level = 55;
            enemy.points = 430;
            area.innerHTML = "<img src='stage6/area6.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage6/フレイモン.png' alt='背景' width='100%' height='180px'>";
            azure();
            break;
        case 'フェニクレスト':
            enemy.name = 'フェニクレスト';
            enemy.hp = 730;
            enemy.attack = 77;
            enemy.maxHP = 730;
            enemy.coin = 5500;
            enemy.level = 57;
            enemy.points = 460;
            area.innerHTML = "<img src='stage6/area6.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage6/フェニクレスト.png' alt='背景' width='100%' height='300px'>";
            break;
        case 'インフェルナード':
            enemy.name = 'インフェルナード';
            enemy.hp = 850;
            enemy.attack = 87;
            enemy.maxHP = 850;
            enemy.coin = 6000;
            enemy.level = 63;
            enemy.points = 500;
            area.innerHTML = "<img src='stage6/area6.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage6/インフェルナード.png' alt='背景' width='100%' height='300px'>";
            break;
        default:
            break;
    }
    //確認ログ（敵:name/HP/attack/maxHP）
    console.log(enemy.name, enemy.hp, enemy.attack, enemy.maxHP);

    let enemyName = document.getElementById("enemyName");
    enemyName.innerHTML = enemy.name;
    let enemyLevel = document.getElementById("enemyLevel");
    enemyLevel.innerHTML = enemy.level;
}

//敵キャラクターの生成/stage7
function generateEnemy7() {
    //敵のHPと攻撃力を定義
    let types = ['グリムヴェイル', 'ノクタリオン', 'ルーナリス'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case 'ルーナリス':
            enemy.name = 'ルーナリス';
            enemy.hp = 1300;
            enemy.attack = 92;
            enemy.maxHP = 1300;
            enemy.coin = 7000;
            enemy.level = 65;
            enemy.points = 530;
            area.innerHTML = "<img src='stage7/area7.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage7/ルーナリス.png' alt='背景' width='100%' height='200px'>";
            break;
        case 'ノクタリオン':
            enemy.name = 'ノクタリオン';
            enemy.hp = 1370;
            enemy.attack = 94;
            enemy.maxHP = 1370;
            enemy.coin = 7100;
            enemy.level = 67;
            enemy.points = 550;
            area.innerHTML = "<img src='stage7/area7.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage7/ノクタリオン.png' alt='背景' width='100%' height='200px'>";
            break;
        case 'グリムヴェイル':
            enemy.name = 'グリムヴェイル';
            enemy.hp = 1550;
            enemy.attack = 100;
            enemy.maxHP = 1550;
            enemy.coin = 7700;
            enemy.level = 70;
            enemy.points = 600;
            area.innerHTML = "<img src='stage7/area7.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage7/グリムヴェイル.png' alt='背景' width='100%' height='200px'>";
            break;
        default:
            break;
    }
    //確認ログ（敵:name/HP/attack/maxHP）
    console.log(enemy.name, enemy.hp, enemy.attack, enemy.maxHP);

    let enemyName = document.getElementById("enemyName");
    enemyName.innerHTML = enemy.name;
    let enemyLevel = document.getElementById("enemyLevel");
    enemyLevel.innerHTML = enemy.level;
}

//敵キャラクターの生成/stageLast
function generateEnemyLast() {
    //敵のHPと攻撃力を定義
    let types = ['魔王'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case '魔王':
            enemy.name = '魔王';
            enemy.hp = 1600;
            enemy.attack = 120;
            enemy.maxHP = 1600;
            enemy.coin = 10000;
            enemy.level = 75;
            enemy.points = 700;
            area.innerHTML = "<img src='stageLast/areaLast.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stageLast/魔王.png' alt='背景' width='100%' height='250px'>";
            break;
        default:
            break;
    }
    //確認ログ（敵:name/HP/attack/maxHP）
    console.log(enemy.name, enemy.hp, enemy.attack, enemy.maxHP);

    let enemyName = document.getElementById("enemyName");
    enemyName.innerHTML = enemy.name;
    let enemyLevel = document.getElementById("enemyLevel");
    enemyLevel.innerHTML = enemy.level;
}

//敵キャラクターの生成/stage8
function generateEnemy8() {
    //敵のHPと攻撃力を定義
    let types = ['ソラリス', 'グリフォス', 'アストラルドラコ'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case 'ソラリス':
            enemy.name = 'ソラリス';
            enemy.hp = 1600;
            enemy.attack = 104;
            enemy.maxHP = 1600;
            enemy.coin = 8000;
            enemy.level = 72;
            enemy.points = 620;
            area.innerHTML = "<img src='stage8/area8.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage8/ソラリス.png' alt='背景' width='100%' height='200px'>";
            break;
        case 'グリフォス':
            enemy.name = 'グリフォス';
            enemy.hp = 1670;
            enemy.attack = 110;
            enemy.maxHP = 1670;
            enemy.coin = 8200;
            enemy.level = 74;
            enemy.points = 650;
            area.innerHTML = "<img src='stage8/area8.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage8/グリフォス.png' alt='背景' width='100%' height='200px'>";
            break;
        case 'アストラルドラコ':
            enemy.name = 'アストラルドラコ';
            enemy.hp = 1810;
            enemy.attack = 123;
            enemy.maxHP = 1810;
            enemy.coin = 8700;
            enemy.level = 79;
            enemy.points = 700;
            area.innerHTML = "<img src='stage8/area8.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage8/アストラルドラコ.png' alt='背景' width='100%' height='300px'>";
            break;
        default:
            break;
    }
    //確認ログ（敵:name/HP/attack/maxHP）
    console.log(enemy.name, enemy.hp, enemy.attack, enemy.maxHP);

    let enemyName = document.getElementById("enemyName");
    enemyName.innerHTML = enemy.name;
    let enemyLevel = document.getElementById("enemyLevel");
    enemyLevel.innerHTML = enemy.level;
}

//敵キャラクターの生成/stage9
function generateEnemy9() {
    //敵のHPと攻撃力を定義
    let types = ['ラプトール', 'ルミナスタグ', 'ザルヴァドス'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case 'ラプトール':
            enemy.name = 'ラプトール';
            enemy.hp = 1830;
            enemy.attack = 120;
            enemy.maxHP = 1830;
            enemy.coin = 7800;
            enemy.level = 80;
            enemy.points = 710;
            area.innerHTML = "<img src='stage9/area9.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage9/ラプトール.png' alt='背景' width='100%' height='200px'>";
            break;
        case 'ルミナスタグ':
            enemy.name = 'ルミナスタグ';
            enemy.hp = 1870;
            enemy.attack = 125;
            enemy.maxHP = 1870;
            enemy.coin = 8200;
            enemy.level = 81;
            enemy.points = 720;
            area.innerHTML = "<img src='stage9/area9.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage9/ルミナスタグ.png' alt='背景' width='100%' height='250px'>";
            break;
        case 'ザルヴァドス':
            enemy.name = 'ザルヴァドス';
            enemy.hp = 1960;
            enemy.attack = 134;
            enemy.maxHP = 1960;
            enemy.coin = 8700;
            enemy.level = 85;
            enemy.points = 750;
            area.innerHTML = "<img src='stage9/area9.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage9/ザルヴァドス.png' alt='背景' width='100%' height='300px'>";
            break;
        default:
            break;
    }
    //確認ログ（敵:name/HP/attack/maxHP）
    console.log(enemy.name, enemy.hp, enemy.attack, enemy.maxHP);

    let enemyName = document.getElementById("enemyName");
    enemyName.innerHTML = enemy.name;
    let enemyLevel = document.getElementById("enemyLevel");
    enemyLevel.innerHTML = enemy.level;
}

//敵キャラクターの生成/stage10
function generateEnemy10() {
    //敵のHPと攻撃力を定義
    let types = ['セレスティコーン', 'セラフィム', 'セラフィオス'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case 'セレスティコーン':
            enemy.name = 'セレスティコーン';
            enemy.hp = 2000;
            enemy.attack = 135;
            enemy.maxHP = 2000;
            enemy.coin = 8800;
            enemy.level = 86;
            enemy.points = 760;
            area.innerHTML = "<img src='stage10/area10.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage10/セレスティコーン.png' alt='背景' width='100%' height='250px'>";
            break;
        case 'セラフィム':
            enemy.name = 'セラフィム';
            enemy.hp = 2070;
            enemy.attack = 139;
            enemy.maxHP = 2070;
            enemy.coin = 9000;
            enemy.level = 88;
            enemy.points = 770;
            area.innerHTML = "<img src='stage10/area10.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage10/セラフィム.png' alt='背景' width='100%' height='250px'>";
            break;
        case 'セラフィオス':
            enemy.name = 'セラフィオス';
            enemy.hp = 2160;
            enemy.attack = 145;
            enemy.maxHP = 2160;
            enemy.coin = 9500;
            enemy.level = 90;
            enemy.points = 800;
            area.innerHTML = "<img src='stage10/area10.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage10/セラフィオス.png' alt='背景' width='100%' height='300px'>";
            break;
        default:
            break;
    }
    //確認ログ（敵:name/HP/attack/maxHP）
    console.log(enemy.name, enemy.hp, enemy.attack, enemy.maxHP);

    let enemyName = document.getElementById("enemyName");
    enemyName.innerHTML = enemy.name;
    let enemyLevel = document.getElementById("enemyLevel");
    enemyLevel.innerHTML = enemy.level;
}

//敵キャラクターの生成/stage11
function generateEnemy11() {
    //敵のHPと攻撃力を定義
    let types = ['アストラルナイト', 'ルクシア', 'オルディア'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case 'アストラルナイト':
            enemy.name = 'アストラルナイト';
            enemy.hp = 2200;
            enemy.attack = 150;
            enemy.maxHP = 2200;
            enemy.coin = 10000;
            enemy.level = 91;
            enemy.points = 810;
            area.innerHTML = "<img src='stage11/area11.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage11/アストラルナイト.png' alt='背景' width='100%' height='250px'>";
            break;
        case 'ルクシア':
            enemy.name = 'ルクシア';
            enemy.hp = 2230;
            enemy.attack = 153;
            enemy.maxHP = 2230;
            enemy.coin = 10500;
            enemy.level = 93;
            enemy.points = 840;
            area.innerHTML = "<img src='stage11/area11.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage11/ルクシア.png' alt='背景' width='100%' height='250px'>";
            break;
        case 'オルディア':
            enemy.name = 'オルディア';
            enemy.hp = 2450;
            enemy.attack = 168;
            enemy.maxHP = 2450;
            enemy.coin = 12000;
            enemy.level = 98;
            enemy.points = 900;
            area.innerHTML = "<img src='stage11/area11.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage11/オルディア.png' alt='背景' width='100%' height='300px'>";
            break;
        default:
            break;
    }
    //確認ログ（敵:name/HP/attack/maxHP）
    console.log(enemy.name, enemy.hp, enemy.attack, enemy.maxHP);

    let enemyName = document.getElementById("enemyName");
    enemyName.innerHTML = enemy.name;
    let enemyLevel = document.getElementById("enemyLevel");
    enemyLevel.innerHTML = enemy.level;
}

//敵キャラクターの生成/stage12
function generateEnemy12() {
    //敵のHPと攻撃力を定義
    let types = ['エレボス', 'グリムセラフ', 'ルシフェル'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case 'エレボス':
            enemy.name = 'エレボス';
            enemy.hp = 2500;
            enemy.attack = 170;
            enemy.maxHP = 2500;
            enemy.coin = 10000;
            enemy.level = 99;
            enemy.points = 910;
            area.innerHTML = "<img src='stage12/area12.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage12/エレボス.png' alt='背景' width='100%' height='300px'>";
            break;
        case 'グリムセラフ':
            enemy.name = 'グリムセラフ';
            enemy.hp = 2560;
            enemy.attack = 174;
            enemy.maxHP = 2560;
            enemy.coin = 10500;
            enemy.level = 100;
            enemy.points = 930;
            area.innerHTML = "<img src='stage12/area12.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage12/グリムセラフ.png' alt='背景' width='100%' height='300px'>";
            break;
        case 'ルシフェル':
            enemy.name = 'ルシフェル';
            enemy.hp = 2700;
            enemy.attack = 180;
            enemy.maxHP = 2700;
            enemy.coin = 11000;
            enemy.level = 105;
            enemy.points = 1000;
            area.innerHTML = "<img src='stage12/area12.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage12/ルシフェル.png' alt='背景' width='100%' height='250px'>";
            break;
        default:
            break;
    }
    //確認ログ（敵:name/HP/attack/maxHP）
    console.log(enemy.name, enemy.hp, enemy.attack, enemy.maxHP);

    let enemyName = document.getElementById("enemyName");
    enemyName.innerHTML = enemy.name;
    let enemyLevel = document.getElementById("enemyLevel");
    enemyLevel.innerHTML = enemy.level;
}

//敵キャラクターの生成/stage13
function generateEnemy13() {
    //敵のHPと攻撃力を定義
    let types = ['ネフェルシア', 'オルソロス', 'アストラリオン'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case 'ネフェルシア':
            enemy.name = 'ネフェルシア';
            enemy.hp = 2750;
            enemy.attack = 170;
            enemy.maxHP = 2750;
            enemy.coin = 11500;
            enemy.level = 107;
            enemy.points = 1030;
            area.innerHTML = "<img src='stage13/area13.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage13/ネフェルシア.png' alt='背景' width='100%' height='200px'>";
            break;
        case 'オルソロス':
            enemy.name = 'オルソロス';
            enemy.hp = 2790;
            enemy.attack = 174;
            enemy.maxHP = 2790;
            enemy.coin = 12000;
            enemy.level = 109;
            enemy.points = 1050;
            area.innerHTML = "<img src='stage13/area13.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage13/オルソロス.png' alt='背景' width='100%' height='200px'>";
            break;
        case 'アストラリオン':
            enemy.name = 'アストラリオン';
            enemy.hp = 2910;
            enemy.attack = 190;
            enemy.maxHP = 2910;
            enemy.coin = 14000;
            enemy.level = 113;
            enemy.points = 1200;
            area.innerHTML = "<img src='stage13/area13.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage13/アストラリオン.png' alt='背景' width='100%' height='250px'>";
            break;
        default:
            break;
    }
    //確認ログ（敵:name/HP/attack/maxHP）
    console.log(enemy.name, enemy.hp, enemy.attack, enemy.maxHP);

    let enemyName = document.getElementById("enemyName");
    enemyName.innerHTML = enemy.name;
    let enemyLevel = document.getElementById("enemyLevel");
    enemyLevel.innerHTML = enemy.level;
}

//敵キャラクターの生成/stage14
function generateEnemy14() {
    //敵のHPと攻撃力を定義
    let types = ['ヴォイドイーター', 'アビスドラグーン', 'アビスファング'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case 'ヴォイドイーター':
            enemy.name = 'ヴォイドイーター';
            enemy.hp = 2940;
            enemy.attack = 195;
            enemy.maxHP = 2940;
            enemy.coin = 14500;
            enemy.level = 115;
            enemy.points = 1230;
            area.innerHTML = "<img src='stage14/area14.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage14/ヴォイドイーター.png' alt='背景' width='100%' height='200px'>";
            break;
        case 'アビスドラグーン':
            enemy.name = 'アビスドラグーン';
            enemy.hp = 3000;
            enemy.attack = 200;
            enemy.maxHP = 3000;
            enemy.coin = 15000;
            enemy.level = 117;
            enemy.points = 1260;
            area.innerHTML = "<img src='stage14/area14.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage14/アビスドラグーン.png' alt='背景' width='100%' height='300px'>";
            break;
        case 'アビスファング':
            enemy.name = 'アビスファング';
            enemy.hp = 3250;
            enemy.attack = 222;
            enemy.maxHP = 3250;
            enemy.coin = 11000;
            enemy.level = 123;
            enemy.points = 2000;
            area.innerHTML = "<img src='stage14/area14.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage14/アビスファング.png' alt='背景' width='100%' height='300px'>";
            break;
        default:
            break;
    }
    //確認ログ（敵:name/HP/attack/maxHP）
    console.log(enemy.name, enemy.hp, enemy.attack, enemy.maxHP);

    let enemyName = document.getElementById("enemyName");
    enemyName.innerHTML = enemy.name;
    let enemyLevel = document.getElementById("enemyLevel");
    enemyLevel.innerHTML = enemy.level;
}

//敵キャラクターの生成/extra1
function generateEnemyExtra1() {
    //敵のHPと攻撃力を定義
    let types = ['岩石の番人'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case '岩石の番人':
            enemy.name = '岩石の番人';
            enemy.hp = 400;
            enemy.attack = 42;
            enemy.maxHP = 400;
            enemy.coin = 5000;
            enemy.level = 30;
            enemy.points = 500;
            area.innerHTML = "<img src='extra1/extra1.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='extra1/岩の番人.png' alt='背景' width='100%' height='250px'>";
            break;
        default:
            break;
    }
    //確認ログ（敵:name/HP/attack/maxHP）
    console.log(enemy.name, enemy.hp, enemy.attack, enemy.maxHP);

    let enemyName = document.getElementById("enemyName");
    enemyName.innerHTML = enemy.name;
    let enemyLevel = document.getElementById("enemyLevel");
    enemyLevel.innerHTML = enemy.level;
}

//敵キャラクターの生成/extra2
function generateEnemyExtra2() {
    //敵のHPと攻撃力を定義
    let types = ['麒麟'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case '麒麟':
            enemy.name = '麒麟';
            enemy.hp = 600;
            enemy.attack = 62;
            enemy.maxHP = 600;
            enemy.coin = 30000;
            enemy.level = 45;
            enemy.points = 550;
            area.innerHTML = "<img src='extra2/extra2.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='extra2/麒麟.png' alt='背景' width='100%' height='250px'>";
            break;
        default:
            break;
    }
    //確認ログ（敵:name/HP/attack/maxHP）
    console.log(enemy.name, enemy.hp, enemy.attack, enemy.maxHP);

    let enemyName = document.getElementById("enemyName");
    enemyName.innerHTML = enemy.name;
    let enemyLevel = document.getElementById("enemyLevel");
    enemyLevel.innerHTML = enemy.level;
}

//敵キャラクターの生成/extra3
function generateEnemyExtra3() {
    //敵のHPと攻撃力を定義
    let types = ['ルクス・ヴェルム'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case 'ルクス・ヴェルム':
            enemy.name = 'ルクス・ヴェルム';
            enemy.hp = 3000;
            enemy.attack = 187;
            enemy.maxHP = 3000;
            enemy.coin = 60000;
            enemy.level = 110;
            enemy.points = 2500;
            area.innerHTML = "<img src='extra3/extra3.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='extra3/ルクス・ヴェルム.png' alt='背景' width='100%' height='320px'>";
            break;
        default:
            break;
    }
    //確認ログ（敵:name/HP/attack/maxHP）
    console.log(enemy.name, enemy.hp, enemy.attack, enemy.maxHP);

    let enemyName = document.getElementById("enemyName");
    enemyName.innerHTML = enemy.name;
    let enemyLevel = document.getElementById("enemyLevel");
    enemyLevel.innerHTML = enemy.level;
}

//敵キャラクターの生成/extra4
function generateEnemyExtra4() {
    //敵のHPと攻撃力を定義
    let types = ['ザクナ'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case 'ザクナ':
            enemy.name = 'ザクナ';
            enemy.hp = 3500;
            enemy.attack = 230;
            enemy.maxHP = 3500;
            enemy.coin = 100000;
            enemy.level = 125;
            enemy.points = 3000;
            area.innerHTML = "<img src='extra4/extra4.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='extra4/ザクナ.png' alt='背景' width='100%' height='200px'>";
            break;
        default:
            break;
    }
    //確認ログ（敵:name/HP/attack/maxHP）
    console.log(enemy.name, enemy.hp, enemy.attack, enemy.maxHP);

    let enemyName = document.getElementById("enemyName");
    enemyName.innerHTML = enemy.name;
    let enemyLevel = document.getElementById("enemyLevel");
    enemyLevel.innerHTML = enemy.level;
}

//戦闘メッセージをリアルタイムに画面に表示
function log(message) {
    let battleLog = document.getElementById("battleLog");
    let logBox = document.createElement('p');

    logBox.textContent = message;
    battleLog.appendChild(logBox);
    battleLog.scrollTop = battleLog.scrollHeight;
    battleLogLive.push(message);
}

//プレイヤーの攻撃処理：命中判定ー＞ダメージ計算ー＞敵のHP反映ー＞次のターン移行
function playerAttack() {
    let attackBtn = document.getElementById("attackBtn");
    let defendBtn = document.getElementById("defendBtn");
    let itemsBtn = document.getElementById("itemsBtn");
    attackBtn.disabled = true;
    defendBtn.disabled = true;
    itemsBtn.disabled = true;
    //プレイヤーの攻撃の命中判定（12%の確率で外れる）
    if (Math.random() < 0.12) {
        dodge();
        log("💨" + enemy.name + "は攻撃をかわした！");
        if (enemy.hp <= 0) {
            enemy.hp = 0;
            attackBtn.disabled = false;
            defendBtn.disabled = false;
            itemsBtn.disabled = false;
            updateDisplay();
            endGame("win");
        } else {
            setTimeout(enemyAttack, 600);
        }
    } else {
        let damage = getAttackDamage(player.attack);
        enemy.hp -= damage;
        log("⚔️" + player.name + "の攻撃　→　" + enemy.name + "　に" + damage + "ダメージ！");
        //HPバーを更新
        updateDisplay();
        //敵のHPが0のとき
        if (enemy.hp <= 0) {
            enemy.hp = 0;
            attackBtn.disabled = false;
            defendBtn.disabled = false;
            itemsBtn.disabled = false;
            updateDisplay();
            endGame("win");
        } else {
            setTimeout(enemyAttack, 400);
        }
    }
}

//敵の攻撃処理：命中判定ー＞痛恨ダメージー＞ダメージ算出ー＞プレイヤーのHP反映＋防御時の追加処理
function enemyAttack() {
    let attackBtn = document.getElementById("attackBtn");
    let defendBtn = document.getElementById("defendBtn");
    let itemsBtn = document.getElementById("itemsBtn");

    // 共通で使う関数
    function enableButtons() {
        attackBtn.disabled = false;
        defendBtn.disabled = false;
        itemsBtn.disabled = false;
    }

    attackBtn.disabled = true;
    defendBtn.disabled = true;
    itemsBtn.disabled = true;

    let effect = document.getElementById("effect");
    effect.innerHTML = "";

    // --- 変身イベント ---
    if (enemy.name === "魔王" && enemy.hp <= 700) {
        document.getElementById("monster").innerHTML = "";
        enableButtons();
        changeMaou();
        return;
    }
    if (enemy.name === "ザクナ" && enemy.hp <= 1500) {
        document.getElementById("monster").innerHTML = "";
        enableButtons();
        changeZakuna();
        return;
    }
    if (enemy.name === "ザクナ(2)" && enemy.hp <= 1000) {
        document.getElementById("monster").innerHTML = "";
        enableButtons();
        changeZakuna2();
        return;
    }

    // --- 守備時 ---
    if (player.defending) {
        if (Math.random() < 0.3) {
            const min = Math.floor(player.maxHP * 0.15);
            const max = Math.floor(player.maxHP * 0.25);
            const healAmount = Math.floor(Math.random() * (max - min + 1)) + min;
            player.hp = Math.min(player.hp + healAmount, player.maxHP);

            useHpPotionBGM();
            log("✨ 防御成功!" + player.name + "のHPが" + healAmount + "回復！");
        } else {
            let damage = Math.floor(getAttackDamageEnemy(enemy.attack) / 2);
            player.hp -= damage;
            log(enemy.name + "の攻撃　→　" + player.name + " に " + damage + " ダメージ！（防御で半減）");
        }
        player.defending = false;
        if (player.hp <= 0) {
            player.hp = 0;
            updateDisplay();
            endGame("lose");
            return;
        }
        updateDisplay();
        enableButtons();
        return;
    }

    // --- 通常攻撃 ---
    if (Math.random() < 0.12) {
        log("💨" + player.name + "は" + enemy.name + "の攻撃をかわした！");
        enableButtons();
        return;
    }

    if (enemy.name === "アビスロード・ザクナ") {
        if (Math.random() < 0.2) {
            zakunaBGM();
            let damage = Math.floor(player.hp * 0.99);
            player.hp -= damage;
            log(enemy.name + "の強烈な一撃");
            log(player.name + " に " + damage + " ダメージ！");
        } else {
            let damage = getAttackDamageEnemy(enemy.attack);
            player.hp -= damage;
            log(enemy.name + "の攻撃　→　" + player.name + " に " + damage + " ダメージ！");
        }
    } else {
        let damage = getAttackDamageEnemy(enemy.attack);
        player.hp -= damage;
        log(enemy.name + "の攻撃　→　" + player.name + " に " + damage + " ダメージ！");
    }

    player.defending = false;
    if (player.hp <= 0) {
        player.hp = 0;
        updateDisplay();
        endGame("lose");
        return;
    }
    updateDisplay();
    enableButtons();
}


//プレイヤーの攻撃時に使用するダメージの算出（baseは攻撃力）
function getAttackDamage(base) {
    let effect = document.getElementById("effect");
    let critical = (Math.random() < 0.1); //10%
    let damage = Math.floor(Math.random() * (base - 4) + 5); //下限は5、上限はbaseによる
    if (critical) {
        attackCriticalSound();
        let PerfectStrike = damage * 1.8;
        log("⚡ 会心の一撃！");
        effect.innerHTML = "<img src='gif/kaisin.gif' alt='背景' width='100%' height='200px'>";
        return Math.floor(PerfectStrike);
    }
    attackSound();
    effect.innerHTML = "<img src='gif/zangeki.gif' alt='背景' width='100%' height='150px'>";
    return Math.floor(damage);
}

//敵の攻撃時に使用するダメージの算出（baseは攻撃力）
function getAttackDamageEnemy(base) {
    let critical = (Math.random() < 0.1); //10%
    let damage = Math.floor(Math.random() * (base - 4) + 5); //下限は5、上限はbaseによる
    if (critical) {
        let monster = document.getElementById("monster");
        monster.classList.add("tukon");
        let PerfectStrike = damage * 1.8;
        log("⚠️ " + enemy.name + "の痛恨の一撃をくらう！");
        return Math.floor(PerfectStrike);
    }
    return damage;
}

//プレイヤーの防御時の操作
function defendAction() {
    if (player.end) {
        alert("宝箱を開けよう！");
    } else {
        defending();
        player.defending = true;
        log(player.name + "は防御の体勢に入った！");
        setTimeout(enemyAttack, 600);
    }
}

//プレイヤーが戦闘時にバッグを開く操作
function useItems() {
    let attackBtn = document.getElementById("attackBtn");
    let defendBtn = document.getElementById("defendBtn");
    let itemsBtn = document.getElementById("itemsBtn");
    attackBtn.disabled = true;
    defendBtn.disabled = true;
    itemsBtn.disabled = true;
    let overlay = document.getElementById("overlay");
    overlay.style.display = "block";
    let haveHpPotion = document.getElementById("haveHpPotion");
    // let havePwrPotion = document.getElementById("havePwrPotion");
    // let haveHpUpPotion = document.getElementById("haveHpUpPotion");
    let haveBug1 = document.getElementById("haveBug1");
    // let haveBug2 = document.getElementById("haveBug2");
    // let haveBug3 = document.getElementById("haveBug3");
    let noBug = document.getElementById("noBug");
    if (player.hpPotion > 0) {
        noBug.style.display = "none";
        haveHpPotion.style.display = "block";
        haveBug1.innerHTML = player.hpPotion;
    }
    // if (player.pwPotion > 0) {
    //     noBug.style.display = "none";
    //     havePwrPotion.style.display = "block";
    //     haveBug2.innerHTML = player.pwPotion;
    // }
    // if (player.hpupPotion > 0) {
    //     noBug.style.display = "none";
    //     haveHpUpPotion.style.display = "block";
    //     haveBug3.innerHTML = player.hpupPotion;
    // }
    // if (player.hpPotion === 0 && player.pwPotion === 0 && player.hpupPotion === 0) {
    if (player.hpPotion === 0) {
        noBug.style.display = "block";
        haveHpPotion.style.display = "none";
        // havePwrPotion.style.display = "none";
        // haveHpUpPotion.style.display = "none";
    }
}

//プレイヤーのポーション使用時の操作
function useHpPotion() {
    let attackBtn = document.getElementById("attackBtn");
    let defendBtn = document.getElementById("defendBtn");
    let haveHpPotion = document.getElementById("haveHpPotion");
    attackBtn.disabled = true;
    defendBtn.disabled = true;
    haveHpPotion.disabled = true;
    let haveBug1 = document.getElementById("haveBug1");
    if (player.hpPotion <= 0) {
        alert("ポーションがないようだ…");
        attackBtn.disabled = false;
        defendBtn.disabled = false;
        haveHpPotion.disabled = false;
    } else if (enemy.name === 'グリムヴェイル' || enemy.name === 'ノクタリオン' || enemy.name === 'ルーナリス') {
        alert(enemy.name + "の神秘的な力でポーションが使えない");
        attackBtn.disabled = false;
        defendBtn.disabled = false;
        haveHpPotion.disabled = false;
    } else if (enemy.name === 'ルクス・ヴェルム') {
        alert(enemy.name + "の神聖な力でポーションが使えない");
        attackBtn.disabled = false;
        defendBtn.disabled = false;
        haveHpPotion.disabled = false;
    } else if (enemy.name === 'ザクナ(2)') {
        alert(enemy.name + "が放つ覇気でポーションが使えない");
        attackBtn.disabled = false;
        defendBtn.disabled = false;
        haveHpPotion.disabled = false;
    } else {
        useHpPotionBGM();
        player.hp += player.maxHP / 5;
        if (player.hp > player.maxHP) {
            player.hp = player.maxHP;
        }
        player.hpPotion -= 1;
        log(player.name + "はポーションを使った！ HPが" + Math.floor(player.maxHP / 4) + "回復！");
        attackBtn.disabled = false;
        defendBtn.disabled = false;
        haveHpPotion.disabled = false;
        haveBug1.innerHTML = player.hpPotion;
        updateDisplay();
    }
}

function usePwPotion() {
    useHpPotionBGM();
    player.pwPotion -= 1;
    alert("力のポーションを使いました！攻撃力が5上昇しました！");
    player.attack += 5;
    let Attack = document.getElementById('Attack');
    Attack.innerHTML = player.attack;
    let pwPotion = document.getElementById("pwPotion");
    let have2 = document.getElementById("have2");
    if (player.pwPotion <= 0) {
        pwPotion.style.display = "none";
        have2.innerHTML = player.pwPotion;
    } else {
        pwPotion.style.display = "block";
        have2.innerHTML = player.pwPotion;
    }
}

function useHpUpPotion() {
    useHpPotionBGM();
    player.hpupPotion -= 1;
    alert("体力のポーションを使いました！体力が7上昇しました！");
    player.maxHP += 7;
    player.hp = player.maxHP;
    let HP = document.getElementById('HP');
    HP.innerHTML = player.maxHP;
    let hpupPotion = document.getElementById("hpupPotion");
    let have3 = document.getElementById("have3");
    if (player.hpupPotion <= 0) {
        hpupPotion.style.display = "none";
        have3.innerHTML = player.hpupPotion;
    } else {
        hpupPotion.style.display = "block";
        have3.innerHTML = player.hpupPotion;
    }
}

//プレイヤーと敵のHP状態を画面に反映し、HPバーを更新
function updateDisplay() {
    const entities = [{ obj: player, barId: "playerHPBar", textId: "playerHP" }, { obj: enemy, barId: "enemyHPBar", textId: "enemyHP" }];
    //読み込み確認
    console.log("updateDisplay");
    entities.forEach(({ obj, barId, textId }) => {
        const percent = Math.floor(obj.hp / obj.maxHP * 100);
        const barEl = document.getElementById(barId);
        const txtEl = document.getElementById(textId);

        txtEl.textContent = Math.floor(obj.hp);
        //barEl.textContent = percent + "%";
        barEl.style.width = percent + "%";

        barEl.classList.remove("high", "mid", "low");

        if (percent >= 50) {
            barEl.classList.add("high");
        } else if (percent <= 20) {
            barEl.classList.add("low");
        } else {
            barEl.classList.add("mid");
        }
    });
}

// 例：Lv1=100, Lv2=120, Lv3=140,...
function getRequiredExp(level) {
    return Math.floor(100 + (level - 1) * 20);
}

//プレイヤーの経験値を画面に反映し、経験値バーを更新
function updatePointsDisplay() {
    let playerPointsBar = document.getElementById("playerPointsBar");
    if (enemy.hp <= 0) {
        player.points += enemy.points;
    }

    while (player.points >= getRequiredExp(player.level)) {
        player.points -= getRequiredExp(player.level);
        player.level += 1;
        let levelUpShow = document.getElementById("levelUpShow");
        levelUpShow.style.display = "block";
        let levelup = document.getElementById("levelup");
        levelup.innerHTML = player.level;
        player.maxHP += 4;
        player.attack += 2;
        levelUpBGM();
        levelUP();
    }

    // 経験値バーの更新（割合表示）
    const nextExp = getRequiredExp(player.level);
    const percent = Math.floor((player.points / nextExp) * 100);
    playerPointsBar.style.width = percent + "%";
}

//勝敗に応じたゲーム終了処理を行い、ログの保存・履歴表示・画面遷移を実行
function endGame(result) {
    stopBGM();
    let effect = document.getElementById("effect");
    effect.innerHTML = "";
    //let monster = document.getElementById("monster");
    player.end = true;

    if (result === "win") {
        log("🎉 勝利！ " + player.name + "に勝利した！");
        //join()メソッドは、配列の要素を指定した区切り文字で結合し、1つの文字列として返す
        sessionLogs.push(battleLogLive.join("\n"));
        player.coin += enemy.coin;
        let extra1 = document.getElementById("extra1");
        let extra2 = document.getElementById("extra2");
        let extra3 = document.getElementById("extra3");
        let extra4 = document.getElementById("extra4");
        let stageLast = document.getElementById("stageLast");
        let gameClearPanel = document.getElementById('gameClearPanel');
        gameClearPanel.style.display = "none";
        if (enemy.name === 'ゲベロペ') {
            flg.stage2 = true;
        } else if (enemy.name === 'ガーゴイル') {
            flg.stage3 = true;
        } else if (enemy.name === 'スノーワイバーン') {
            if (flg.extra1Win) {
                flg.extra1 = false;
                extra1.style.display = "none";
            } else {
                flg.extra1 = true;
                extra1.style.display = "block";
            }
        } else if (enemy.name === '岩石の番人') {
            extra1.style.display = "none";
            flg.extra1Win = true;
            flg.stage4 = true;
            flg.castle = true;
        } else if (enemy.name === '大天使') {
            if (flg.extra2Win) {
                flg.extra2 = false;
                extra2.style.display = "none";
            } else {
                flg.extra2 = true;
                extra2.style.display = "block";
            }
        } else if (enemy.name === '麒麟') {
            extra2.style.display = "none";
            flg.extra2Win = true;
            flg.stage5 = true;
            let kumo = document.getElementById("kumo");
            kumo.style.display = "none";
            let stage5 = document.getElementById("stage5");
            stage5.style.display = "block";
            let stage6 = document.getElementById("stage6");
            stage6.style.display = "block";
        } else if (enemy.name === 'ヴェノメギド') {
            flg.stage6 = true;
        } else if (enemy.name === 'インフェルナード') {
            flg.stage7 = true;
            let stage7 = document.getElementById("stage7");
            stage7.style.display = "block";
        } else if (enemy.name === 'グリムヴェイル') {
            if (flg.stageLastWin) {
                flg.stageLast = false;
                stageLast.style.display = "none";
            } else {
                flg.stageLast = true;
                stageLast.style.display = "block";
            }
        } else if (enemy.name === '魔王(2)') {
            stageLast.style.display = "none";
            flg.stageLastWin = true;
            let gameClearPanel = document.getElementById('gameClearPanel');
            gameClearPanel.style.display = "block";
            let mapMoveToHeaven = document.getElementById('mapMoveToHeaven');
            mapMoveToHeaven.style.display = "block";
            flg.stage8 = true;
            player.name = '👑' + player.name;
        } else if (enemy.name === 'アストラルドラコ') {
            flg.stage9 = true;
        } else if (enemy.name === 'ザルヴァドス') {
            flg.stage10 = true;
        } else if (enemy.name === 'セラフィオス') {
            flg.stage11 = true;
        } else if (enemy.name === 'オルディア') {
            flg.stage12 = true;
        } else if (enemy.name === 'ルシフェル') {
            if (flg.extra3Win) {
                flg.extra3 = false;
                extra3.style.display = "none";
            } else {
                flg.extra3 = true;
                extra3.style.display = "block";
            }
        } else if (enemy.name === 'ルクス・ヴェルム') {
            extra3.style.display = "none";
            flg.extra3Win = true;
            flg.stage13 = true;
        } else if (enemy.name === 'アストラリオン') {
            flg.stage14 = true;
        } else if (enemy.name === 'アビスファング') {
            if (flg.extra4Win) {
                flg.extra4 = false;
                extra4.style.display = "none";
            } else {
                flg.extra4 = true;
                extra4.style.display = "block";
            }
        } else if (enemy.name === 'アビスロード・ザクナ') {
            extra4.style.display = "none";
            flg.extra4Win = true;
            let game2ClearPanel = document.getElementById('game2ClearPanel');
            game2ClearPanel.style.display = "block";
            player.name = player.name + '🍜';
        }
        displaySessionLogs();
        win();
        //monster.innerHTML = "<img onclick='win()' class='animate__animated animate__fadeIn' src='coin_gold_02.png' alt='背景' width='100%' height='100px'>";
    } else {
        let attackBtn = document.getElementById("attackBtn");
        let defendBtn = document.getElementById("defendBtn");
        let itemsBtn = document.getElementById("itemsBtn");
        attackBtn.disabled = false;
        defendBtn.disabled = false;
        itemsBtn.disabled = false;
        player.points = 0;
        //経験値の反映
        log("💀 敗北… " + enemy.name + "に負けた。")
        //join()メソッドは、配列の要素を指定した区切り文字で結合し、1つの文字列として返す
        sessionLogs.push(battleLogLive.join("\n"));
        flg.stage2 = false;
        flg.stage3 = false;
        flg.stage4 = false;
        flg.stage5 = false;
        flg.stage6 = false;
        flg.stage7 = false;
        flg.stage8 = false;
        flg.stage9 = false;
        flg.stage10 = false;
        flg.stage11 = false;
        flg.stage12 = false;
        flg.stage13 = false;
        flg.stageLast = false;
        flg.castle = false;
        flg.extra1 = false;
        flg.extra1Win = false;
        flg.stageLastWin = false;
        displaySessionLogs();
        end();
    }
}

//戦闘後勝利時の処理
function win() {
    let nextBattle = document.getElementById('nextBattle');

    if (player.stage === 'last') {
        nextBattle.style.display = "none";
    } else if (player.stage === 14) {
        nextBattle.style.display = "block";
    } else if (player.stage === 13) {
        nextBattle.style.display = "block";
    } else if (player.stage === 12) {
        nextBattle.style.display = "block";
    } else if (player.stage === 11) {
        nextBattle.style.display = "block";
    } else if (player.stage === 10) {
        nextBattle.style.display = "block";
    } else if (player.stage === 9) {
        nextBattle.style.display = "block";
    } else if (player.stage === 8) {
        nextBattle.style.display = "block";
    } else if (player.stage === 7) {
        nextBattle.style.display = "block";
    } else if (player.stage === 6) {
        nextBattle.style.display = "block";
    } else if (player.stage === 5) {
        nextBattle.style.display = "block";
    } else if (player.stage === 4) {
        nextBattle.style.display = "block";
    } else if (player.stage === 3) {
        nextBattle.style.display = "block";
    } else if (player.stage === 2) {
        nextBattle.style.display = "block";
    } else if (player.stage === 'ex1') {
        nextBattle.style.display = "none";
    } else if (player.stage === 'ex2') {
        nextBattle.style.display = "none";
    } else if (player.stage === 'ex3') {
        nextBattle.style.display = "none";
    } else if (player.stage === 'ex4') {
        nextBattle.style.display = "none";
    } else {
        nextBattle.style.display = "block";
    }

    if (player.level % 10 == 0) {
        player.bonus = true;
    } else {
        player.bonus = false;
    }
    //経験値の反映
    updatePointsDisplay();
    let rareItems = document.getElementById("rareItems");
    let rare = (Math.random() < 0.1);
    if (rare) {
        player.hpPotion += 1;
        rareItems.innerHTML = "治癒のポーション × 1";
    } else {
        rareItems.innerHTML = "なし";
    }
    let lose = document.getElementById("lose");
    lose.style.display = "none";
    let win = document.getElementById("win");
    win.style.display = "block";
    let monster = document.getElementById("monster");
    monster.innerHTML = "";
    let sectionIds = [];
    let winName = document.getElementById("winName");
    winName.innerHTML = enemy.name;
    let winGold = document.getElementById("winGold");
    winGold.innerHTML = enemy.coin;
    let winPoints = document.getElementById("winPoints");
    winPoints.innerHTML = enemy.points;
    gameUI = document.getElementById("gameUI");
    logPanel = document.getElementById("logPanel");
    //ログパネルの表示
    //let sessionLogPanel = document.getElementById("sessionLogPanel");
    let restartMenu = document.getElementById("restartMenu");
    sectionIds.push(restartMenu.id, gameUI.id, logPanel.id);
    showSection(sectionIds);
}

//戦闘後敗北時の処理
function end() {
    gameEnd();
    enemy.coin = 0;
    let win = document.getElementById("win");
    win.style.display = "none";
    let lose = document.getElementById("lose");
    lose.style.display = "block";
    let eName = document.getElementById("eName");
    eName.innerHTML = enemy.name;
    let resultLevel = document.getElementById("resultLevel");
    resultLevel.innerHTML = player.level;
    let resultName = document.getElementById("resultName");
    resultName.innerHTML = player.name;
    let HP = document.getElementById("resultHP");
    resultHP.innerHTML = player.maxHP;
    let resultAttack = document.getElementById("resultAttack");
    resultAttack.innerHTML = player.attack;
    let resultCoin = document.getElementById("resultCoin");
    resultCoin.innerHTML = player.coin;
    let sectionIds = [];
    gameUI = document.getElementById("gameUI");
    logPanel = document.getElementById("logPanel");
    let sessionLogPanel = document.getElementById("sessionLogPanel");
    let restartMenu = document.getElementById("restartMenu");
    sectionIds.push(sessionLogPanel.id, restartMenu.id, gameUI.id, logPanel.id);
    showSection(sectionIds);
}

function mapMoveToHeaven() {
    let map1 = document.getElementById("map1");
    map1.style.display = "none";
    let map2 = document.getElementById("map2");
    map2.style.display = "block";
    stopBGM();
    let sectionIds = [];
    let mapHeaven = document.getElementById("mapHeaven");
    sectionIds.push(mapHeaven.id);
    playBGM("heaven");
    showSection(sectionIds);
}

//mapに戻る
function mapGame() {
    let map1 = document.getElementById("map1");
    map1.style.display = "block";
    let map2 = document.getElementById("map2");
    map2.style.display = "none";
    stopBGM();
    playBGM("map");
    //Start画面に遷移
    let levelUpShow = document.getElementById("levelUpShow");
    levelUpShow.style.display = "none";
    let sectionIds = [];
    let map = document.getElementById("map");
    sectionIds.push(map.id);
    showSection(sectionIds);
}

//天空に戻る
function mapHeavenGame() {
    let map1 = document.getElementById("map1");
    map1.style.display = "block";
    let map2 = document.getElementById("map2");
    map2.style.display = "none";
    stopBGM();
    playBGM("heaven");
    let sectionIds = [];
    let mapHeaven = document.getElementById("mapHeaven");
    sectionIds.push(mapHeaven.id);
    showSection(sectionIds);
}

//ゲームの再プレイの準備処理（入力欄、ログの初期化・画面の戻し）
function titleGame() {
    stopBGM();
    let gameClearPanel = document.getElementById('gameClearPanel');
    gameClearPanel.style.display = "none";
    let levelUpShow = document.getElementById("levelUpShow");
    levelUpShow.style.display = "none";
    let kumo = document.getElementById("kumo");
    kumo.style.display = "block";
    let stage5 = document.getElementById("stage5");
    stage5.style.display = "none";
    let stage6 = document.getElementById("stage6");
    stage6.style.display = "none";
    let stage7 = document.getElementById("stage7");
    stage7.style.display = "none";
    let playerInput = document.getElementById("playerInput");
    playerInput.value = null;
    let mapMoveToHeaven = document.getElementById('mapMoveToHeaven');
    mapMoveToHeaven.style.display = "none";
    player.level = 1;
    player.maxHP = 50;
    player.hp = 50;
    player.attack = 10;
    player.bonus = true;
    player.coin = 10;
    player.stage = 1;
    player.points = 0;
    player.hpPotion = 3;
    player.pwPotion = 0;
    player.hpupPotion = 0;
    enemy.points = 0;
    battleLogLive = [];
    flg.stage2 = false;
    flg.stage3 = false;
    flg.stage4 = false;
    flg.stage5 = false;
    flg.stage6 = false;
    flg.stage7 = false;
    flg.stage8 = false;
    flg.stage9 = false;
    flg.stage10 = false;
    flg.stage11 = false;
    flg.stage12 = false;
    flg.stage13 = false;
    flg.stageLast = false;
    flg.stageLastWin = false;
    flg.castle = false;
    flg.extra1 = false;
    flg.extra1Win = false;
    updatePointsDisplay();
    //Start画面に遷移
    let sectionIds = [];
    let startMenu = document.getElementById("startMenu");
    sectionIds.push(startMenu.id);
    showSection(sectionIds);
}

//データを保持したまま、ゲームを再開する
function restartGame() {
    stopBGM();
    let nextBattle = document.getElementById('nextBattle');
    let levelUpShow = document.getElementById("levelUpShow");
    levelUpShow.style.display = "none";
    battleLogLive = [];
    //ゲーム画面に遷移
    if (player.stage === 'last') {
        nextBattle.style.display = "none";
    } else if (player.stage === 14) {
        startGames14();
    } else if (player.stage === 13) {
        startGames13();
    } else if (player.stage === 12) {
        startGames12();
    } else if (player.stage === 11) {
        startGames11();
    } else if (player.stage === 10) {
        startGames10();
    } else if (player.stage === 9) {
        startGames9();
    } else if (player.stage === 8) {
        startGames8();
    } else if (player.stage === 7) {
        startGames7();
    } else if (player.stage === 6) {
        startGames6();
    } else if (player.stage === 5) {
        startGames5();
    } else if (player.stage === 4) {
        startGames4();
    } else if (player.stage === 3) {
        startGames3();
    } else if (player.stage === 2) {
        startGames2();
    } else if (player.stage === 'ex1') {
        nextBattle.style.display = "none";
    } else if (player.stage === 'ex2') {
        nextBattle.style.display = "none";
    } else if (player.stage === 'ex3') {
        nextBattle.style.display = "none";
    } else if (player.stage === 'ex4') {
        nextBattle.style.display = "none";
    } else {
        startGames1();
    }
}

//セッションログ表示
function displaySessionLogs() {
    let sessionArea = document.getElementById("sessionLogPanel");
    sessionArea.innerHTML = "<div style='color:white;'>＜セッション戦闘履歴＞</div>";
    sessionLogs.forEach((log, index) => {
        let div = document.createElement("div");
        div.innerHTML = `<div class='rireki'>🗂️ 戦闘${index + 1}<span class='btn-wrapper'><button class='startBtn' id='showBtn${index}' onclick='showPanel(${index})'>↓</button><button class='startBtn' id='hiddenBtn${index}' onclick='hiddenPanel(${index})' style='display: none;'>↑</button></span></div><pre id='pre${index}' style='display: none;'>${log}</pre>`;
        sessionArea.appendChild(div);
    });
}

//セクションパネルを開く
function showPanel(index) {
    let hiddenBtn = document.getElementById("hiddenBtn" + index);
    hiddenBtn.style.display = "block";
    let showBtn = document.getElementById("showBtn" + index);
    showBtn.style.display = "none";
    let pre = document.getElementById("pre" + index);
    pre.style.display = "block";
}

//セクションパネルを閉じる
function hiddenPanel(index) {
    let showBtn = document.getElementById("showBtn" + index);
    showBtn.style.display = "block";
    let pre = document.getElementById("pre" + index);
    pre.style.display = "none";
    let hiddenBtn = document.getElementById("hiddenBtn" + index);
    hiddenBtn.style.display = "none";
}

//これまでのセッションログをテキスト形式で保存・ダウンロードする
function downloadSessionLog() {
    let sessionLogsAll = sessionLogs.join("\n\n === 次戦 === \n\n");
    const blob = new Blob([sessionLogsAll], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "session_log.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

//操作方法の表示
function showInstructions() {
    let sectionIds = [];
    startMenu = document.getElementById("startMenu");
    instructionsPanel = document.getElementById("instructionsPanel");
    sectionIds.push(startMenu.id, instructionsPanel.id);
    showSection(sectionIds);
}

//敵一覧の表示
function showEnemyList() {
    let sectionIds = [];
    startMenu = document.getElementById("startMenu");
    enemyListPanel = document.getElementById("enemyListPanel");
    sectionIds.push(startMenu.id, enemyListPanel.id);
    showSection(sectionIds);
}

//アイテム屋の表示
function itemshop() {
    let sectionIds = [];
    let itemshop = document.getElementById("itemshop");
    sectionIds.push(itemshop.id);
    showSection(sectionIds);
}

//鍛冶屋の表示
function weaponshop() {
    alert("今はやってないみたい…");
    // let sectionIds = [];
    // let weaponshop = document.getElementById("weaponshop");
    // sectionIds.push(weaponshop.id);
    // showSection(sectionIds);
}

//パネルを閉じる（例：操作説明、ルールなど）
function closePanel() {
    let sectionIds = [];
    startMenu = document.getElementById("startMenu");
    sectionIds.push(startMenu.id);
    showSection(sectionIds);
}

function closeClearPanel() {
    let gameClearPanel = document.getElementById('gameClearPanel');
    gameClearPanel.style.display = "none";
    let sectionIds = [];
    startMenu = document.getElementById("map");
    sectionIds.push(startMenu.id);
    showSection(sectionIds);
}

function closeClearPanel2() {
    let game2ClearPanel = document.getElementById('game2ClearPanel');
    game2ClearPanel.style.display = "none";
    let sectionIds = [];
    mapHeaven = document.getElementById("mapHeaven");
    sectionIds.push(mapHeaven.id);
    showSection(sectionIds);
}

//魔王のHPが1/3を切ったら、変身する
function changeMaou() {
    let hensin = document.getElementById("effect");
    hensin.innerHTML = "<img src='gif/hensin.gif' alt='背景' width='300px' height='300px'>";
    log(enemy.name + "の姿が変化した…");
    let monster = document.getElementById("monster");
    monster.innerHTML = "<img class='animate__animated animate__infinite animate__pulse' src='stageLast/魔王2.png' alt='背景' width='100%' height='280px'>";
    enemy.name = "魔王(2)";
    enemy.attack = 250;
    enemy.maxHP = 2000;
    enemy.hp += 2000;
    if (enemy.hp > enemy.maxHP) {
        enemy.hp = enemy.maxHP;
    }
    //HPバーを更新
    updateDisplay();
}

function changeZakuna() {
    let hensin = document.getElementById("effect");
    hensin.innerHTML = "<img src='gif/hensin.gif' alt='背景' width='300px' height='300px'>";
    log(enemy.name + "の姿が変化した…");
    let monster = document.getElementById("monster");
    monster.innerHTML = "<img class='animate__animated animate__infinite animate__pulse' src='extra4/ザクナ2.png' alt='背景' width='100%' height='250px'>";
    enemy.name = "ザクナ(2)";
    enemy.attack = 250;
    enemy.maxHP = 4000;
    enemy.hp += 4000;
    if (enemy.hp > enemy.maxHP) {
        enemy.hp = enemy.maxHP;
    }
    //HPバーを更新
    updateDisplay();
}

function changeZakuna2() {
    let hensin = document.getElementById("effect");
    hensin.innerHTML = "<img src='gif/hensin.gif' alt='背景' width='300px' height='300px'>";
    log(enemy.name + "が真の力を見せてきた！");
    let monster = document.getElementById("monster");
    monster.innerHTML = "<img class='animate__animated animate__infinite animate__pulse' src='extra4/アビスロードザクナ.png' alt='背景' width='100%' height='320px'>";
    enemy.name = "アビスロード・ザクナ";
    enemy.attack = 300;
    enemy.maxHP = 5000;
    enemy.hp += 5000;
    if (enemy.hp > enemy.maxHP) {
        enemy.hp = enemy.maxHP;
    }
    //HPバーを更新
    updateDisplay();
}

//モンスターから逃げる機能
function runAway() {
    let sectionIds = [];
    if (enemy.hp != enemy.maxHP || player.hp != player.maxHP) {
        alert(enemy.name + "から逃げることはできない。");
    } else {
        if (player.stage === 8 || player.stage === 9 || player.stage === 10 || player.stage === 11 || player.stage === 12 || player.stage === 'ex3' || player.stage === 13 || player.stage === 14 || player.stage === 'ex4') {
            runAwayBGM();
            alert(enemy.name + "から逃げました。");
            mapHeaven = document.getElementById("mapHeaven");
            sectionIds.push(mapHeaven.id);
            showSection(sectionIds);
            stopBGM();
            playBGM("heaven");
        } else {
            runAwayBGM();
            alert(enemy.name + "から逃げました。");
            map = document.getElementById("map");
            sectionIds.push(map.id);
            showSection(sectionIds);
            stopBGM();
            playBGM("map");
        }
    }
}

//10%の確率で（スライム）のレアモンスターが出現
function slime() {
    let rare = (Math.random() < 0.1);
    if (rare) {
        enemy.name = 'レッドスライム';
        enemy.hp = 150;
        enemy.attack = 50;
        enemy.maxHP = 150;
        enemy.coin *= 2;
        enemy.level = 20;
        enemy.points = 350;
        area.innerHTML = "<img src='stage1/area1.png' alt='背景' width='100%' height='620px'>";
        monster.innerHTML = "<img src='stage1/レッドスライム.png' alt='背景' width='100%' height='180px'>";
    }
}

//10%の確率で（ゾンビ）のレアモンスターが出現
function darkNight() {
    let rare = (Math.random() < 0.1);
    if (rare) {
        enemy.name = 'ダークナイト';
        enemy.hp = 350;
        enemy.attack = 50;
        enemy.maxHP = 350;
        enemy.coin *= 2;
        enemy.level = 32;
        enemy.points = 550;
        area.innerHTML = "<img src='stage2/area2.png' alt='背景' width='100%' height='620px'>";
        monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage2/ダークナイト.png' alt='背景' width='100%' height='250px'>";
    }
}

//10%の確率で（レッドドラゴン）のレアモンスターが出現
function dragon() {
    let rare = (Math.random() < 0.1);
    if (rare) {
        enemy.name = 'ホワイトドラゴン';
        enemy.hp = 700;
        enemy.attack = 75;
        enemy.maxHP = 700;
        enemy.coin *= 2;
        enemy.level = 60;
        enemy.points = 800;
        area.innerHTML = "<img src='stage4/area4.png' alt='背景' width='100%' height='620px'>";
        monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='stage4/ホワイトドラゴン.png' alt='背景' width='100%' height='300px'>";
    }
}

//10%の確率で（フレイモン）のレアモンスターが出現
function azure() {
    let rare = (Math.random() < 0.1);
    if (rare) {
        enemy.name = 'アズリオン';
        enemy.hp = 1200;
        enemy.attack = 107;
        enemy.maxHP = 1200;
        enemy.coin *= 2;
        enemy.level = 75;
        enemy.points = 1000;
        area.innerHTML = "<img src='stage6/area6.png' alt='背景' width='100%' height='620px'>";
        monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='ver1.4/アズリオン.png' alt='背景' width='100%' height='200px'>";
    }
}

//10%の確率で（雪男）のレアモンスターが出現
function frost() {
    let rare = (Math.random() < 0.1);
    if (rare) {
        enemy.name = 'フロストタイラント';
        enemy.hp = 600;
        enemy.attack = 65;
        enemy.maxHP = 600;
        enemy.coin *= 2;
        enemy.level = 47;
        enemy.points = 700;
        area.innerHTML = "<img src='stage3/area3.png' alt='背景' width='100%' height='620px'>";
        monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='ver1.4/フロストタイラント.png' alt='背景' width='100%' height='200px'>";
    }
}

//10%の確率で（フングリード）のレアモンスターが出現
function morbasylisk() {
    let rare = (Math.random() < 0.1);
    if (rare) {
        enemy.name = 'モルバジリスク';
        enemy.hp = 960;
        enemy.attack = 95;
        enemy.maxHP = 960;
        enemy.coin *= 2;
        enemy.level = 68;
        enemy.points = 900;
        area.innerHTML = "<img src='stage5/area5.png' alt='背景' width='100%' height='620px'>";
        monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='ver1.4/モルバジリスク.png' alt='背景' width='100%' height='200px'>";
    }
}

//レベルが10上がるごとにボーナスを適用
function levelUP() {
    if (player.bonus && player.level % 10 === 0) {
        alert("レベルアップボーナス！！！");
        if (player.level >= 100) {
            player.maxHP += 10;
            player.attack += 5;
        } else if (player.level >= 90) {
            player.maxHP += 10;
            player.attack += 3;
        } else if (player.level >= 80) {
            player.maxHP += 10;
            player.attack += 3;
        } else if (player.level >= 70) {
            player.maxHP += 10;
            player.attack += 3;
        } else if (player.level >= 60) {
            player.maxHP += 10;
            player.attack += 3;
        } else if (player.level >= 50) {
            player.maxHP += 10;
            player.attack += 3;
        } else if (player.level >= 40) {
            player.maxHP += 5;
            player.attack += 3;
        } else if (player.level >= 30) {
            player.maxHP += 5;
            player.attack += 3;
        } else if (player.level >= 20) {
            player.maxHP += 5;
            player.attack += 3;
        } else if (player.level >= 10) {
            player.maxHP += 5;
            player.attack += 3;
        }

        player.bonus = false;  // ボーナス適用後はリセット
    }
}

// map表示のBGM再生
function playBGM(name) {
    if (bgm) {
        bgm.pause(); // もし既に再生してたら止める
        attackSound.currentTime = 0; // 連続再生用
    }
    bgm = bgmList[name];
    bgm.loop = true; // ループ
    bgm.volume = 0.1;
    bgm.play();
}

// BGMを再生（常にフェード付き）
function playBGM(name) {
    // もし既に同じ曲が流れていたら何もしない
    if (currentBGM && currentBGM.src.includes(bgmList[name])) {
        return;
    }

    // フェードアウト処理
    if (currentBGM) {
        clearInterval(fadeInterval); // 前のフェード処理が残っていたらリセット

        fadeInterval = setInterval(() => {
            if (currentBGM.volume > 0.05) {
                currentBGM.volume -= 0.05;
            } else {
                clearInterval(fadeInterval);
                currentBGM.pause();
                currentBGM.currentTime = 0;
                startNewBGM(name); // 新BGM開始
            }
        }, 10); // 10msごとに音量を下げる
    } else {
        // 今BGMが無いならそのまま再生
        startNewBGM(name);
    }
}

// 新しいBGMを開始する処理
function startNewBGM(name) {
    currentBGM = new Audio(bgmList[name]);
    currentBGM.loop = true;
    currentBGM.volume = 0.1; // フェード後の音量に合わせる
    currentBGM.play();
}

// 完全に止めたいとき（無音にしたい場合）
function stopBGM() {
    if (currentBGM) {
        clearInterval(fadeInterval);
        currentBGM.pause();
        currentBGM.currentTime = 0;
        currentBGM = null;
    }
}

//攻撃をかわされた際の効果音を再生
function dodge() {
    let attackSound = new Audio("ver1.4/空振り.mp3");
    attackSound.volume = 0.5;
    attackSound.currentTime = 0; // 連続再生用
    attackSound.play();
}

//際の防御の効果音を再生
function defending() {
    let attackSound = new Audio("ver1.4/盾で防御.mp3");
    attackSound.volume = 0.5;
    attackSound.currentTime = 0; // 連続再生用
    attackSound.play();
}

//治癒のポーション際の効果音を再生
function useHpPotionBGM() {
    let sound = new Audio("ver1.4/UsehpPotion.mp3");
    sound.volume = 0.3;
    sound.currentTime = 0; // 連続再生用
    sound.play();
}

//レベルが上がった際の効果音
function levelUpBGM() {
    let sound = new Audio("ver1.4/levelUp.mp3");
    sound.volume = 0.3;
    sound.currentTime = 0; // 連続再生用
    sound.play();
}

// 通常ダメージ攻撃音を再生
function attackSound() {
    let attackSound = new Audio("ver1.4/グサッ1.mp3");
    attackSound.volume = 0.3;
    attackSound.currentTime = 0; // 連続再生用
    attackSound.play();
}

// 会心の一撃ダメージ攻撃音を再生
function attackCriticalSound() {
    let attackSound = new Audio("ver1.4/パワーチャージ.mp3");
    attackSound.volume = 0.3;
    attackSound.currentTime = 0; // 連続再生用
    attackSound.play();
}

// 逃げる効果音を再生
function runAwayBGM() {
    let sound = new Audio("ver1.5/runAway.mp3");
    sound.volume = 0.3;
    sound.currentTime = 0; // 連続再生用
    sound.play();
}

// ゲームオーバーを再生
function gameEnd() {
    let sound = new Audio("ver1.4/gameEnd.mp3");
    sound.volume = 0.3;
    sound.currentTime = 0; // 連続再生用
    sound.play();
}

function zakunaBGM() {
    let sound = new Audio("ver1.5/ザクナの一撃.mp3");
    sound.volume = 0.3;
    sound.currentTime = 0; // 連続再生用
    sound.play();
}
