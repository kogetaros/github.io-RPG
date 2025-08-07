import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
    getFirestore,
    collection,
    query,
    orderBy,
    limit,
    getDocs,
    getDoc,
    setDoc,
    doc,
    serverTimestamp // ← これを忘れずに！
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCsmpHXEvQNHNTMk1hqiCi-jOmsYBqvSzg",
    authDomain: "the-legend-of-the-hero-rpg.firebaseapp.com",
    projectId: "the-legend-of-the-hero-rpg",
    storageBucket: "the-legend-of-the-hero-rpg.appspot.com",
    messagingSenderId: "229539309178",
    appId: "1:229539309178:web:e32420bdd694fc09c63dc3",
    measurementId: "G-FZXYLBMPX3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// グローバル変数として playerId を用意
let playerId = localStorage.getItem("playerId");
if (!playerId) {
    playerId = crypto.randomUUID(); // ブラウザでUUID生成
    localStorage.setItem("playerId", playerId);
}

// プレイヤーデータ保存
async function savePlayerData() {
    try {
        await setDoc(doc(db, "players", playerId), {
            ...player,
            updatedAt: serverTimestamp()
        }, { merge: true });
        console.log("✅ プレイヤーデータ保存成功");
    } catch (e) {
        console.error("❌ プレイヤーデータ保存エラー:", e);
    }
}

// プレイヤーデータ読み込み
async function loadPlayerData() {
    const docRef = doc(db, "players", playerId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        Object.assign(player, docSnap.data());
        console.log("✅ プレイヤーデータ読み込み成功:", player);
    } else {
        console.log("❌ プレイヤーデータが存在しません");
    }
}

// ランキング読み込み
async function loadRanking() {
    const rankingList = document.getElementById("rankingList");
    rankingList.innerHTML = "";

    const q = query(
        collection(db, "ranking"),
        orderBy("level", "desc"),
        orderBy("reachedAt", "asc"),
        limit(10)
    );

    const snapshot = await getDocs(q);

    // 表示順を定義（使用するバッジのみ）
    const badgeOrder = ["👑", "🍜", "⚛️", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "🔢", "🔥", "❄️", "⚡", "🌳", "🌈", "❤️", "💛", "🤍", "🖤", "💗", "🥉", "🥈", "🥇"];

    snapshot.forEach(doc => {
        const data = doc.data();

        const name = data.name || "名無し";
        const level = data.level || 0;
        const badges = Array.isArray(data.badges) ? data.badges : [];

        // ソート済みで不要なバッジを除いた配列を作成
        const sortedBadges = badges
            .filter(b => badgeOrder.includes(b))
            .sort((a, b) => badgeOrder.indexOf(a) - badgeOrder.indexOf(b));

        const li = document.createElement("li");
        li.innerHTML = `${name} : Lv.${level}<br>${sortedBadges.join("")}`;
        rankingList.appendChild(li);
    });
}



//グローバル変数
let player = ['name', 'level', 'hp', 'attack', 'maxHP', 'defending', 'hpPotion', 'pwPotion', 'hpupPotion', 'eternalPotion', 'end', 'bonus', 'ultimate', 'coin', 'stage', 'points', 'badges'];
let enemy = ['name', 'hp', 'attack', 'maxHP', 'coin', 'points'];
let items = ['potion'];
const bgmList = {
    menu: "ver1.4/menu.mp3",
    map: "ver1.4/map.mp3",
    battle: "ver1.4/battle.mp3",
    stageBoss: "ver1.4/stageBoss.mp3",
    heaven: "ver1.5/Heaven.mp3",
    underground: "ver1.6BGM/Underground.mp3",
    undergroundBoss: "ver1.6BGM/UndergroundBoss.mp3",
    lastBoss: "ver1.6BGM/LASTBoss.mp3"
};
let currentBGM = null; // 現在のBGM
let fadeInterval = null; // フェード制御用
let flg = ['tower', 'stage2', 'stage3', 'stage4', 'stage5', 'stage6', 'stage7', 'stageLast', 'stage8', 'stage9', 'stage10', 'stage11', 'stage12', 'stage13', 'stage14', 'stage15', 'stage15Win', 'stage16', 'stage16Win', 'stage17', 'stage17Win', 'stage18', 'stage18Win', 'stage19', 'stage19Win', 'castle', 'extra1', 'extra2', 'extra3', 'extra4', 'extra5', 'extra1Win', 'extra2Win', 'extra3Win', 'extra4Win', 'extra5Win', 'stageLastWin'];

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
player.eternalPotion = 0;
player.points = 0;
player.badges = [];

//flgの初期設定
flg.tower = false;
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
flg.stage15 = false;
flg.stage16 = false;
flg.stage17 = false;
flg.stage18 = false;
flg.stage19 = false;
flg.stage15Win = false;
flg.stage16Win = false;
flg.stage17Win = false;
flg.stage18Win = false;
flg.stage19Win = false;
flg.castle = false;
flg.extra1 = false;
flg.extra1Win = false;
flg.extra2 = false;
flg.extra2Win = false;
flg.extra3 = false;
flg.extra3Win = false;
flg.extra4 = false;
flg.extra4Win = false;
flg.extra5 = false;
flg.extra5Win = false;
flg.stageLastWin = false;

// ===== 名前変更機能 =====
// プレイヤー表示を更新する関数
function renderPlayer() {
    let playerName = document.getElementById("Name");
    if (playerName) {
        playerName.innerHTML = player.name;
    }
}

// 名前変更処理
function changePlayerName() {
    let newName = prompt("新しい名前を入力してください (10文字以内)", player.name);

    if (newName && newName.trim() !== "") {
        newName = newName.trim();

        if (newName.length > 10) {
            alert("名前は10文字以内で入力してください");
            return; // ここで処理終了
        }

        player.name = newName;
        renderPlayer();
        saveGame(); // ← 名前変更後にセーブ
        alert("名前を変更しました: " + player.name);
    } else {
        alert("名前を入力してください");
    }
}

// ===== セーブ機能 =====
async function saveGame() {
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
            eternalPotion: player.eternalPotion,
            points: player.points,
            badges: [...new Set(player.badges)], // 重複排除
        },
        flg: { ...flg } // フラグを丸ごとコピー
    };

    // localStorage に保存
    localStorage.setItem("rpgSaveData", JSON.stringify(saveData));

    // Firestore にも保存（マルチデバイス対応）
    try {
        await setDoc(doc(db, "players", playerId), saveData, { merge: true });
        console.log("✅ Firestore保存成功");
    } catch (e) {
        console.error("❌ Firestore保存エラー:", e);
    }

    //ランキング更新
    await saveRanking();

    alert("セーブしました！");
}

//ランキング保存関数
async function saveRanking() {
    try {
        const uniqueBadges = [...new Set(player.badges)];
        await setDoc(doc(db, "ranking", playerId), {
            name: player.name,
            level: player.level,
            badges: uniqueBadges,
            reachedAt: serverTimestamp()
        }, { merge: true });
        console.log("✅ ランキング保存成功");
    } catch (e) {
        console.error("❌ ランキング保存エラー:", e);
    }
}

// ===== バッジ処理関数 =====
function ensureBadges() {
    if (flg.stageLastWin && !player.badges.includes("👑")) player.badges.push("👑");
    if (flg.extra4Win && !player.badges.includes("🍜")) player.badges.push("🍜");
    if (flg.extra5Win && !player.badges.includes("⚛️")) player.badges.push("⚛️");
}

function updateLevelBadge() {
    let badge = null;
    if (player.level >= 500) badge = "🔢";
    else if (player.level >= 400) badge = "4️⃣";
    else if (player.level >= 300) badge = "3️⃣";
    else if (player.level >= 200) badge = "2️⃣";
    else if (player.level >= 100) badge = "1️⃣";

    // 👑🍜⚛️は残す → 数字系は置き換え
    player.badges = player.badges.filter(b => !["1️⃣", "2️⃣", "3️⃣", "4️⃣", "🔢"].includes(b));
    if (badge) player.badges.push(badge);
}

// ===== ロード機能 =====
async function loadGame() {
    let saveData = null;
    flg.tower = false;

    // Firestoreから読み込みを試みる
    try {
        const docRef = doc(db, "players", playerId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            saveData = docSnap.data();
            console.log("✅ Firestoreからロード成功");
        }
    } catch (e) {
        console.error("❌ Firestoreロードエラー:", e);
    }

    // Firestoreがなければ localStorage を使う
    if (!saveData) {
        const data = localStorage.getItem("rpgSaveData");
        if (!data) {
            alert("⚠ セーブデータがありません。");
            return;
        }
        saveData = JSON.parse(data);
        console.log("📦 localStorageからロード成功");
    }

    // プレイヤー復元
    Object.assign(player, saveData.player || {});

    // フラグ復元（安全にマージ）
    Object.assign(flg, saveData.flg || {});

    // ステージ表示の復元（例）
    document.getElementById("extra1").style.display = (flg.extra1 && !flg.extra1Win) ? "block" : "none";
    document.getElementById("extra2").style.display = (flg.extra2 && !flg.extra2Win) ? "block" : "none";
    document.getElementById("extra3").style.display = (flg.extra3 && !flg.extra3Win) ? "block" : "none";
    document.getElementById("extra4").style.display = (flg.extra4 && !flg.extra4Win) ? "block" : "none";
    document.getElementById("extra5").style.display = (flg.extra5 && !flg.extra5Win) ? "block" : "none";

    if (flg.stage5) {
        document.getElementById("kumo").style.display = "none";
        document.getElementById("stage5").style.display = "block";
        document.getElementById("stage6").style.display = "block";
    }
    if (flg.stage7) document.getElementById("stage7").style.display = "block";
    if (flg.stage15Win && flg.stage16Win && flg.stage17Win && flg.stage18Win) {
        document.getElementById("stage19").style.display = "block";
    }

    if (flg.stageLastWin) {
        document.getElementById('mapMoveToHeaven').style.display = "block";
    }
    if (flg.extra4Win) {
        document.getElementById('mapMoveToUnderground').style.display = "block";
        flg.stage15 = flg.stage16 = flg.stage17 = flg.stage18 = flg.stage19 = true;
    }

    // バッジを整備
    if (!player.badges) player.badges = [];
    ensureBadges();
    updateLevelBadge();

    document.getElementById("stageLast").style.display = (flg.stageLast && !flg.stageLastWin) ? "block" : "none";

    updatePointsDisplay();
    renderPlayer();
    alert("セーブデータをロードしました！");
    menuOpen();
}

// 指定したパネルID(sectionIds)だけを表示し、それ以外を非表示にする
function showSection(sectionIds) {
    //確認ログ（sectionIdsの値）
    console.log(sectionIds);
    const allSections = ['startMenu', 'castle', 'menu', 'map', 'gameUI', 'logPanel', 'sessionLogPanel', 'restartMenu', 'instructionsPanel', 'enemyListPanel', 'itemshop', 'weaponshop', 'mapHeaven', 'ranking', 'mapUnderground', 'towerStartMenu', 'instructionsTowerPanel', 'towerGamePanel', 'rankingTower', 'restartMenuTower'];

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
    flg.tower = false;
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
    let extra5 = document.getElementById("extra5");
    extra5.style.display = "none";
    let stageLast = document.getElementById("stageLast");
    stageLast.style.display = "none";
    let stage19 = document.getElementById("stage19");
    stage19.style.display = "none";
    let playerInput = document.getElementById("playerInput");
    player.name = playerInput.value.trim();
    let effect = document.getElementById("effect");
    effect.innerHTML = "";
    let mapMoveToHeaven = document.getElementById('mapMoveToHeaven');
    mapMoveToHeaven.style.display = "none";
    let mapMoveToUnderground = document.getElementById('mapMoveToUnderground');
    mapMoveToUnderground.style.display = "none";
    let map1 = document.getElementById("map1");
    map1.style.display = "block";
    let map2 = document.getElementById("map2");
    map2.style.display = "none";
    let map3 = document.getElementById("map3");
    map3.style.display = "none";
    player.badges = [];
    let sectionIds = [];

    if (!player.name) {
        alert("名前を入力してください！");
    } else {
        if (player.name === "最強") {
            player.maxHP = 1315;
            player.hp = 1315;
            player.attack = 1065;
            player.coin = 1000000;
            player.defending = false;
            player.hpPotion = 1000;
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
            flg.stage10 = true;
            flg.stage11 = true;
            flg.stage12 = true;
            flg.stage13 = true;
            flg.stage14 = true;
            flg.stage15 = true;
            flg.stage16 = true;
            flg.stage17 = true;
            flg.stage18 = true;
            flg.stage15Win = true;
            flg.stage16Win = true;
            flg.stage17Win = true;
            flg.stage18Win = true;
            flg.stage19Win = true;
            flg.castle = true;
            flg.extra1 = true;
            flg.extra2 = true;
            flg.extra3 = true;
            flg.extra4 = true;
            flg.extra5 = true;
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
    let playerBadge = document.getElementById('playerBadge');
    // 表示用は join()
    player.badge = player.badges.join("");
    playerBadge.innerHTML = player.badges;
    haveItems();
    showSection(sectionIds);
}

//メニュー画面で持ち物を表示する
function haveItems() {
    const items = [
        { key: "hpPotion", element: "hpPotion", count: "have1" },
        { key: "pwPotion", element: "pwPotion", count: "have2" },
        { key: "hpupPotion", element: "hpupPotion", count: "have3" },
        { key: "eternalPotion", element: "eternalPotion", count: "have4" }
    ];

    let no = document.getElementById("no");
    let hasAny = false;

    items.forEach(item => {
        let el = document.getElementById(item.element);
        let countEl = document.getElementById(item.count);

        if (player[item.key] > 0) {
            el.style.display = "block";
            countEl.innerHTML = player[item.key];
            hasAny = true;
        } else {
            el.style.display = "none";
        }
    });

    // アイテムが1つもなければ「なし」を表示
    no.style.display = hasAny ? "none" : "block";
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
    let quantity = parseInt(prompt("何個購入しますか？"), 10);

    if (isNaN(quantity) || quantity <= 0) {
        alert("正しい数を入力してください");
        return;
    }

    const price = 30000 * quantity;

    if (player.coin < price) {
        alert("コインが足りません");
    } else {
        player.coin -= price;
        player.hpPotion += quantity;

        // UI 更新
        let playerGold = document.getElementById('playerGold');
        playerGold.innerHTML = player.coin;

        alert(`治癒のポーションを${quantity}個購入しました！`);
    }
}


//力のポーションを購入する
function buyPwPotion() {
    let quantity = parseInt(prompt("何個購入しますか？"), 10);

    if (isNaN(quantity) || quantity <= 0) {
        alert("正しい数を入力してください");
        return;
    }

    const price = 50000 * quantity;

    if (player.coin < price) {
        alert("コインが足りません");
    } else {
        player.coin -= price;
        player.pwPotion += quantity;

        // UI更新
        let playerGold = document.getElementById('playerGold');
        playerGold.innerHTML = player.coin;

        alert(`力のポーションを${quantity}個購入しました！`);
    }
}

//体力のポーションを購入する
function buyHpUpPotion() {
    let quantity = parseInt(prompt("何個購入しますか？"), 10);

    if (isNaN(quantity) || quantity <= 0) {
        alert("正しい数を入力してください");
        return;
    }

    const price = 60000 * quantity;

    if (player.coin < price) {
        alert("コインが足りません");
    } else {
        player.coin -= price;
        player.hpupPotion += quantity;

        // UI更新
        let playerGold = document.getElementById('playerGold');
        playerGold.innerHTML = player.coin;

        alert(`体力のポーションを${quantity}個購入しました！`);
    }
}

//ゲーム開始/stage1
function startGames1() {
    let map1 = document.getElementById("map1");
    map1.style.display = "block";
    let map2 = document.getElementById("map3");
    map2.style.display = "none";
    let map3 = document.getElementById("map3");
    map3.style.display = "none";
    stopBGM();
    let effect = document.getElementById("effect");
    effect.innerHTML = "";
    player.stage = 1;
    let sectionIds = [];

    //画面表示
    let gameUI = document.getElementById("gameUI");
    let logPanel = document.getElementById("logPanel");
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
    let monster = document.getElementById("monster");
    monster.innerHTML = "";
    let monster2 = document.getElementById("monster2");
    monster2.innerHTML = "";
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
        let map1 = document.getElementById("map1");
        map1.style.display = "block";
        let map2 = document.getElementById("map3");
        map2.style.display = "none";
        let map3 = document.getElementById("map3");
        map3.style.display = "none";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 2;
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let monster = document.getElementById("monster");
        monster.innerHTML = "";
        let monster2 = document.getElementById("monster2");
        monster2.innerHTML = "";
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
        let map1 = document.getElementById("map1");
        map1.style.display = "block";
        let map2 = document.getElementById("map3");
        map2.style.display = "none";
        let map3 = document.getElementById("map3");
        map3.style.display = "none";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 3;
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let monster = document.getElementById("monster");
        monster.innerHTML = "";
        let monster2 = document.getElementById("monster2");
        monster2.innerHTML = "";
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
        let map1 = document.getElementById("map1");
        map1.style.display = "block";
        let map2 = document.getElementById("map3");
        map2.style.display = "none";
        let map3 = document.getElementById("map3");
        map3.style.display = "none";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 4;
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let monster = document.getElementById("monster");
        monster.innerHTML = "";
        let monster2 = document.getElementById("monster2");
        monster2.innerHTML = "";
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
        let map1 = document.getElementById("map1");
        map1.style.display = "block";
        let map2 = document.getElementById("map3");
        map2.style.display = "none";
        let map3 = document.getElementById("map3");
        map3.style.display = "none";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 5;
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let monster = document.getElementById("monster");
        monster.innerHTML = "";
        let monster2 = document.getElementById("monster2");
        monster2.innerHTML = "";
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
        let map1 = document.getElementById("map1");
        map1.style.display = "block";
        let map2 = document.getElementById("map3");
        map2.style.display = "none";
        let map3 = document.getElementById("map3");
        map3.style.display = "none";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 6;
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let monster = document.getElementById("monster");
        monster.innerHTML = "";
        let monster2 = document.getElementById("monster2");
        monster2.innerHTML = "";
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
        let map1 = document.getElementById("map1");
        map1.style.display = "block";
        let map2 = document.getElementById("map3");
        map2.style.display = "none";
        let map3 = document.getElementById("map3");
        map3.style.display = "none";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 7;
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let monster = document.getElementById("monster");
        monster.innerHTML = "";
        let monster2 = document.getElementById("monster2");
        monster2.innerHTML = "";
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
        let map1 = document.getElementById("map1");
        map1.style.display = "block";
        let map2 = document.getElementById("map3");
        map2.style.display = "none";
        let map3 = document.getElementById("map3");
        map3.style.display = "none";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 'last';
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let monster = document.getElementById("monster");
        monster.innerHTML = "";
        let monster2 = document.getElementById("monster2");
        monster2.innerHTML = "";
        generateEnemyLast();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        playBGM("undergroundBoss");
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
        let map3 = document.getElementById("map3");
        map3.style.display = "none";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 8;
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let monster = document.getElementById("monster");
        monster.innerHTML = "";
        let monster2 = document.getElementById("monster2");
        monster2.innerHTML = "";
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
        let map3 = document.getElementById("map3");
        map3.style.display = "none";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 9;
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let monster = document.getElementById("monster");
        monster.innerHTML = "";
        let monster2 = document.getElementById("monster2");
        monster2.innerHTML = "";
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
        let map3 = document.getElementById("map3");
        map3.style.display = "none";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 10;
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let monster = document.getElementById("monster");
        monster.innerHTML = "";
        let monster2 = document.getElementById("monster2");
        monster2.innerHTML = "";
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
        let map3 = document.getElementById("map3");
        map3.style.display = "none";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 11;
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let monster = document.getElementById("monster");
        monster.innerHTML = "";
        let monster2 = document.getElementById("monster2");
        monster2.innerHTML = "";
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
        let map3 = document.getElementById("map3");
        map3.style.display = "none";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 12;
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let monster = document.getElementById("monster");
        monster.innerHTML = "";
        let monster2 = document.getElementById("monster2");
        monster2.innerHTML = "";
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
        let map3 = document.getElementById("map3");
        map3.style.display = "none";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 13;
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let monster = document.getElementById("monster");
        monster.innerHTML = "";
        let monster2 = document.getElementById("monster2");
        monster2.innerHTML = "";
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
        let map3 = document.getElementById("map3");
        map3.style.display = "none";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 14;
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let monster = document.getElementById("monster");
        monster.innerHTML = "";
        let monster2 = document.getElementById("monster2");
        monster2.innerHTML = "";
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

//ゲーム開始/stage15
function startGames15() {
    if (flg.stage15) {
        let map1 = document.getElementById("map1");
        map1.style.display = "none";
        let map2 = document.getElementById("map2");
        map2.style.display = "none";
        let map3 = document.getElementById("map3");
        map3.style.display = "block";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 15;
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let monster = document.getElementById("monster");
        monster.innerHTML = "";
        let monster2 = document.getElementById("monster2");
        monster2.innerHTML = "";
        generateEnemy15();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        playBGM("undergroundBoss");

    } else {
        alert("進めないようだ…");
    }
}

//ゲーム開始/stage16
function startGames16() {
    if (flg.stage16) {
        let map1 = document.getElementById("map1");
        map1.style.display = "none";
        let map2 = document.getElementById("map2");
        map2.style.display = "none";
        let map3 = document.getElementById("map3");
        map3.style.display = "block";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 16;
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let monster = document.getElementById("monster");
        monster.innerHTML = "";
        let monster2 = document.getElementById("monster2");
        monster2.innerHTML = "";
        generateEnemy16();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        playBGM("undergroundBoss");

    } else {
        alert("進めないようだ…");
    }
}

//ゲーム開始/stage17
function startGames17() {
    if (flg.stage15) {
        let map1 = document.getElementById("map1");
        map1.style.display = "none";
        let map2 = document.getElementById("map2");
        map2.style.display = "none";
        let map3 = document.getElementById("map3");
        map3.style.display = "block";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 17;
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let monster = document.getElementById("monster");
        monster.innerHTML = "";
        let monster2 = document.getElementById("monster2");
        monster2.innerHTML = "";
        generateEnemy17();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        playBGM("undergroundBoss");

    } else {
        alert("進めないようだ…");
    }
}

//ゲーム開始/stage18
function startGames18() {
    if (flg.stage18) {
        let map1 = document.getElementById("map1");
        map1.style.display = "none";
        let map2 = document.getElementById("map2");
        map2.style.display = "none";
        let map3 = document.getElementById("map3");
        map3.style.display = "block";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 18;
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let monster = document.getElementById("monster");
        monster.innerHTML = "";
        let monster2 = document.getElementById("monster2");
        monster2.innerHTML = "";
        generateEnemy18();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        playBGM("undergroundBoss");

    } else {
        alert("進めないようだ…");
    }
}

//ゲーム開始/stage19
function startGames19() {
    if (flg.stage19) {
        let map1 = document.getElementById("map1");
        map1.style.display = "none";
        let map2 = document.getElementById("map2");
        map2.style.display = "none";
        let map3 = document.getElementById("map3");
        map3.style.display = "block";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 19;
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let monster = document.getElementById("monster");
        monster.innerHTML = "";
        let monster2 = document.getElementById("monster2");
        monster2.innerHTML = "";
        generateEnemy19();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        playBGM("undergroundBoss");

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
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let map3 = document.getElementById("map3");
        map3.style.display = "none";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 'ex3';
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        let map3 = document.getElementById("map3");
        map3.style.display = "none";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 'ex4';
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        playBGM("undergroundBoss");
    } else {
        alert("進めないようだ…");
    }
}

function extra5() {
    if (flg.extra5) {
        let map1 = document.getElementById("map1");
        map1.style.display = "none";
        let map2 = document.getElementById("map2");
        map2.style.display = "none";
        let map3 = document.getElementById("map3");
        map3.style.display = "block";
        stopBGM();
        let effect = document.getElementById("effect");
        effect.innerHTML = "";
        player.stage = 'ex5';
        let sectionIds = [];

        //画面表示
        let gameUI = document.getElementById("gameUI");
        let logPanel = document.getElementById("logPanel");
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
        generateEnemyExtra5();

        //戦闘ログ初期化（配置と表示）
        let battleLog = document.getElementById("battleLog");
        battleLog.innerHTML = "";
        //console.log("battleLogLive初期化:" + battleLogLive);

        //ステータス表示更新処理
        updateDisplay();

        //バトルBGM再生
        playBGM("lastBoss");
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
                enemy.points = 101;
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
            enemy.coin = 20000;
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

//敵キャラクターの生成/stage15
function generateEnemy15() {
    //敵のHPと攻撃力を定義
    let types = ['焔王ヴァルガノス'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster2");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case '焔王ヴァルガノス':
            enemy.name = '焔王ヴァルガノス';
            enemy.hp = 20000;
            enemy.attack = 600;
            enemy.maxHP = 20000;
            enemy.coin = 50000;
            enemy.level = 280;
            enemy.points = 144500;
            area.innerHTML = "<img src='ver1.6/area15.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='ver1.6/焔王ヴァルガノス.png' alt='背景' width='150%' height='300px'>";
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

//敵キャラクターの生成/stage16
function generateEnemy16() {
    //敵のHPと攻撃力を定義
    let types = ['氷帝グラシエル'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster2");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case '氷帝グラシエル':
            enemy.name = '氷帝グラシエル';
            enemy.hp = 22000;
            enemy.attack = 550;
            enemy.maxHP = 22000;
            enemy.coin = 55000;
            enemy.level = 282;
            enemy.points = 150500;
            area.innerHTML = "<img src='ver1.6/area16.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='ver1.6/氷帝グラシエル.png' alt='背景' width='150%' height='300px'>";
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

//敵キャラクターの生成/stage17
function generateEnemy17() {
    //敵のHPと攻撃力を定義
    let types = ['雷煌ゼルディオン'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster2");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case '雷煌ゼルディオン':
            enemy.name = '雷煌ゼルディオン';
            enemy.hp = 23500;
            enemy.attack = 650;
            enemy.maxHP = 23500;
            enemy.coin = 65000;
            enemy.level = 287;
            enemy.points = 155500;
            area.innerHTML = "<img src='ver1.6/area17.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='ver1.6/雷煌ゼルディオン.png' alt='背景' width='150%' height='300px'>";
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

//敵キャラクターの生成/stage18
function generateEnemy18() {
    //敵のHPと攻撃力を定義
    let types = ['樹魔エルドラン'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster2");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case '樹魔エルドラン':
            enemy.name = '樹魔エルドラン';
            enemy.hp = 24000;
            enemy.attack = 720;
            enemy.maxHP = 24000;
            enemy.coin = 60000;
            enemy.level = 291;
            enemy.points = 160000;
            area.innerHTML = "<img src='ver1.6/area18.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='ver1.6/樹魔エルドラン.png' alt='背景' width='150%' height='300px'>";
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

//敵キャラクターの生成/stage19
function generateEnemy19() {
    //敵のHPと攻撃力を定義
    let types = ['元素獣オリジン'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster = document.getElementById("monster2");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case '元素獣オリジン':
            enemy.name = '元素獣オリジン';
            enemy.hp = 33500;
            enemy.attack = 850;
            enemy.maxHP = 33500;
            enemy.coin = 100000;
            enemy.level = 300;
            enemy.points = 200000;
            area.innerHTML = "<img src='ver1.6/area19.png' alt='背景' width='100%' height='620px'>";
            monster.innerHTML = "<img class='animate__animated animate__fadeIn' src='ver1.6/元素獣オリジン.png' alt='背景' width='150%' height='300px'>";
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
            enemy.points = 15000;
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
            enemy.points = 160000;
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

//敵キャラクターの生成/extra5
function generateEnemyExtra5() {
    //敵のHPと攻撃力を定義
    let types = ['光神ルミナリア'];

    //敵キャラクターのランダム取得
    let selected = Math.floor(Math.random() * types.length);
    enemy.name = types[selected];

    let monster2 = document.getElementById("monster2");
    let area = document.getElementById("area");
    switch (enemy.name) {
        case '光神ルミナリア':
            enemy.name = '光神ルミナリア';
            enemy.hp = 50000;
            enemy.attack = 900;
            enemy.maxHP = 50000;
            enemy.coin = 1000000;
            enemy.level = 350;
            enemy.points = 500000;
            area.innerHTML = "<img src='ver1.6/extra5.png' alt='背景' width='100%' height='620px'>";
            monster2.innerHTML = "<img class='animate__animated animate__fadeIn' src='ver1.6/光神ルミナリア.png' alt='背景' width='150%' height='300px'>";
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
            if (flg.tower) {
                endGame("towerWin");
            } else {
                endGame("win");
            }
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
            if (flg.tower) {
                endGame("towerWin");
            } else {
                endGame("win");
            }
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
            if (flg.tower) {
                endGame("towerLose");
            } else {
                endGame("lose");
            }
            return;
        }
        updateDisplay();
        enableButtons();
        return;
    }

    // --- 回避判定 ---
    if (Math.random() < 0.12) {
        log("💨" + player.name + "は" + enemy.name + "の攻撃をかわした！");
        enableButtons();
        return;
    }

    // --- 敵ごとの特殊攻撃処理 ---
    let damage;
    if (enemy.name === '冥騎将ダルクス' || enemy.name === '獄焔鬼バルヴァ＝ガルム' || enemy.name === "アビスロード・ザクナ" || enemy.name === "元素獣オリジン") {
        if (Math.random() < 0.2) {
            zakunaBGM();
            damage = Math.floor(player.hp * 0.99);
            log(enemy.name + "の強烈な一撃");
        } else {
            damage = getAttackDamageEnemy(enemy.attack);
        }
    } else if (enemy.name === "光神ルミナリア" || enemy.name === "煉獄魔王フラガ＝ドレムス") {
        if (Math.random() < 0.2) {
            zakunaBGM();
            flashEffect();
            damage = Math.floor(player.hp * 0.99);
            log(enemy.name + "の神聖な一撃");
        } else {
            damage = getAttackDamageEnemy(enemy.attack);
        }
    } else {
        damage = getAttackDamageEnemy(enemy.attack);
    }

    player.hp -= damage;
    log(enemy.name + "の攻撃　→　" + player.name + " に " + damage + " ダメージ！");

    player.defending = false;
    if (player.hp <= 0) {
        player.hp = 0;
        updateDisplay();
        if (flg.tower) {
            endGame("towerLose");
        } else {
            endGame("lose");
        }
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
    let haveEternalPotion = document.getElementById("haveEternalPotion");
    // let havePwrPotion = document.getElementById("havePwrPotion");
    // let haveHpUpPotion = document.getElementById("haveHpUpPotion");
    let haveBug1 = document.getElementById("haveBug1");
    // let haveBug2 = document.getElementById("haveBug2");
    // let haveBug3 = document.getElementById("haveBug3");
    let haveBug4 = document.getElementById("haveBug4");
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
    if (player.eternalPotion > 0) {
        noBug.style.display = "none";
        haveEternalPotion.style.display = "block";
        haveBug4.innerHTML = player.eternalPotion;
    }
    // if (player.hpPotion === 0 && player.pwPotion === 0 && player.hpupPotion === 0) {
    if (player.hpPotion === 0 && player.eternalPotion === 0) {
        noBug.style.display = "block";
        haveHpPotion.style.display = "none";
        haveEternalPotion.style.display = "none";
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
    } else if (enemy.name === 'グリムヴェイル' || enemy.name === 'ノクタリオン' || enemy.name === 'ルーナリス' || enemy.name === '魔炎獣ガルヴァリウス') {
        alert(enemy.name + "の神秘的な力でポーションが使えない");
        attackBtn.disabled = false;
        defendBtn.disabled = false;
        haveHpPotion.disabled = false;
    } else if (enemy.name === 'ルクス・ヴェルム') {
        alert(enemy.name + "の神聖な力でポーションが使えない");
        attackBtn.disabled = false;
        defendBtn.disabled = false;
        haveHpPotion.disabled = false;
    } else if (enemy.name === '紫焔竜ヴァルファング' || enemy.name === 'ザクナ(2)') {
        alert(enemy.name + "が放つ覇気でポーションが使えない");
        attackBtn.disabled = false;
        defendBtn.disabled = false;
        haveHpPotion.disabled = false;
    } else if (enemy.name === '氷獄王グラキエス' || enemy.name === '深淵の従者ネブラ' || enemy.name === '焔王ヴァルガノス' || enemy.name === '氷帝グラシエル' || enemy.name === '雷煌ゼルディオン' || enemy.name === '樹魔エルドラン' || enemy.name === '元素獣オリジン' || enemy.name === '光神ルミナリア') {
        useHpPotionBGM();
        player.hp += player.maxHP / 50;
        if (player.hp > player.maxHP) {
            player.hp = player.maxHP;
        }
        let haveBug1 = document.getElementById("haveBug1");
        player.hpPotion -= 1;
        log(enemy.name + "が放つ覇気で" + Math.floor(player.maxHP / 50) + "しか回復できない！");
        attackBtn.disabled = false;
        defendBtn.disabled = false;
        haveHpPotion.disabled = false;
        haveBug1.innerHTML = player.hpPotion;
        updateDisplay();
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
    haveItems();
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
    haveItems();
}

function useEternalPotion() {
    let attackBtn = document.getElementById("attackBtn");
    let defendBtn = document.getElementById("defendBtn");
    let haveEternalPotion = document.getElementById("haveEternalPotion");
    attackBtn.disabled = true;
    defendBtn.disabled = true;
    haveEternalPotion.disabled = true;
    let haveBug4 = document.getElementById("haveBug4");
    if (flg.tower) {
        alert("エターナルポーションは塔では使えない。");
    } else {
        if (player.eternalPotion <= 0) {
            alert("ポーションがないようだ…");
            attackBtn.disabled = false;
            defendBtn.disabled = false;
            haveEternalPotion.disabled = false;
        } else {
            useHpPotionBGM();
            player.hp += player.maxHP;
            if (player.hp > player.maxHP) {
                player.hp = player.maxHP;
            }
            player.eternalPotion -= 1;
            log(player.name + "はポーションを使った！ HPが" + Math.floor(player.maxHP) + "回復！");
            attackBtn.disabled = false;
            defendBtn.disabled = false;
            haveEternalPotion.disabled = false;
            haveBug4.innerHTML = player.eternalPotion;
            updateDisplay();
        }
    }
}

function compoundingEternalPotion() {
    if (player.hpPotion >= 100) {
        // 確認メッセージ
        let confirmCraft = confirm("治癒のポーション100個を使用してエターナルポーションを1個調合しますか？");

        if (confirmCraft) {
            //useHpPotionBGM();
            player.hpPotion -= 100;
            player.eternalPotion += 1;
            alert("上位回復ポーションを1個調合しました！");
            haveItems();
        } else {
            alert("調合をキャンセルしました。");
        }
    } else {
        alert("治癒のポーションが足りません！（必要: 100個, 所持: " + player.hpPotion + "個）");
    }

    let have1 = document.getElementById("have1");
    have1.innerHTML = player.hpPotion;
    let eternalPotion = document.getElementById("eternalPotion");
    let have4 = document.getElementById("have4");
    if (player.eternalPotion <= 0) {
        eternalPotion.style.display = "none";
        have4.innerHTML = player.hpupPotion;
    } else {
        eternalPotion.style.display = "block";
        have4.innerHTML = player.eternalPotion;
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

//レベルアップに必要な経験値　 例：Lv1 → 101　Lv10 → 200　Lv100 → 10,100
function getRequiredExp(level) {
    return Math.floor(100 + level * level);
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
        player.attack += 3;
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
    let attackBtn = document.getElementById("attackBtn");
    let defendBtn = document.getElementById("defendBtn");
    let itemsBtn = document.getElementById("itemsBtn");
    attackBtn.disabled = false;
    defendBtn.disabled = false;
    itemsBtn.disabled = false;
    let effect = document.getElementById("effect");
    effect.innerHTML = "";
    //let monster = document.getElementById("monster");
    player.end = true;

    if (result === 'towerWin') {
        towerWin();
    } else if (result === 'towerLose') {
        towerLose();
    } else {
        if (result === "win") {
            log("🎉 勝利！ " + player.name + "に勝利した！");
            //join()メソッドは、配列の要素を指定した区切り文字で結合し、1つの文字列として返す
            sessionLogs.push(battleLogLive.join("\n"));
            player.coin += enemy.coin;
            let extra1 = document.getElementById("extra1");
            let extra2 = document.getElementById("extra2");
            let extra3 = document.getElementById("extra3");
            let extra4 = document.getElementById("extra4");
            let extra5 = document.getElementById("extra5");
            let stage19 = document.getElementById("stage19");
            let stageLast = document.getElementById("stageLast");
            let gameClearPanel = document.getElementById('gameClearPanel');
            gameClearPanel.style.display = "none";

            const bosses = {
                '焔王ヴァルガノス': { flag: 'stage15Win', badge: '🔥' },
                '氷帝グラシエル': { flag: 'stage16Win', badge: '❄️' },
                '雷煌ゼルディオン': { flag: 'stage17Win', badge: '⚡' },
                '樹魔エルドラン': { flag: 'stage18Win', badge: '🌳' },
                '元素獣オリジン': { flag: 'stage19Win', badge: '🌈' }
            };

            if (bosses[enemy.name]) {
                const { flag, badge } = bosses[enemy.name];
                flg[flag] = true;

                // すでに持っていなければ追加
                if (!player.badges.includes(badge)) {
                    player.badges.push(badge);
                }
            }

            // 4体すべて倒したらステージ19解放
            if (flg.stage15Win && flg.stage16Win && flg.stage17Win && flg.stage18Win) {
                if (!flg.stage19) {
                    alert("マップに「虹の魔法陣」が現れた！");
                }
                stage19.style.display = "block";
                flg.stage19 = true;
            }

            if (enemy.name === 'ゲベロペ') {
                if (!flg.stage2) {
                    alert("次のステージ「大きな洞窟」が解放された！");
                }
                flg.stage2 = true;
            } else if (enemy.name === 'ガーゴイル') {
                if (!flg.stage3) {
                    alert("次のステージ「スノーフェアリー」が解放された！");
                }
                flg.stage3 = true;
            } else if (enemy.name === 'スノーワイバーン') {
                if (flg.extra1Win) {
                    flg.extra1 = false;
                    extra1.style.display = "none";
                } else {
                    if (!flg.extra1) {
                        alert("ダイヤモンドマーメイド城に行く道に「岩石の番人」が現れた！");
                    }
                    flg.extra1 = true;
                    extra1.style.display = "block";
                }
            } else if (enemy.name === '岩石の番人') {
                if (!flg.stage4) {
                    alert("ダイヤモンドマーメイド城が解放された！\n次のステージ「北の大地」が解放された！");
                }
                extra1.style.display = "none";
                flg.extra1Win = true;
                flg.stage4 = true;
                flg.castle = true;
            } else if (enemy.name === '大天使') {
                if (flg.extra2Win) {
                    flg.extra2 = false;
                    extra2.style.display = "none";
                } else {
                    if (!flg.extra2) {
                        alert("ダイヤモンドマーメイド城の左にある橋に「麒麟」が現れた！");
                    }
                    flg.extra2 = true;
                    extra2.style.display = "block";
                }
            } else if (enemy.name === '麒麟') {
                if (!flg.stage5) {
                    alert("次のステージ「カラカラ山」が解放された！");
                }
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
                if (!flg.stage6) {
                    alert("次のステージ「サハラ砂漠」が解放された！");
                }
                flg.stage6 = true;
            } else if (enemy.name === 'インフェルナード') {
                if (!flg.stage7) {
                    alert("次のステージ「神秘の森」が解放された！");
                }
                flg.stage7 = true;
                let stage7 = document.getElementById("stage7");
                stage7.style.display = "block";
            } else if (enemy.name === 'グリムヴェイル') {
                if (flg.stageLastWin) {
                    flg.stageLast = false;
                    stageLast.style.display = "none";
                } else {
                    if (!flg.stageLast) {
                        alert("次のステージ「魔王城」が解放された！");
                    }
                    flg.stageLast = true;
                    stageLast.style.display = "block";
                }
            } else if (enemy.name === '魔王(2)') {
                if (!flg.stage8) {
                    alert("新マップの「天空」が解放された！\n次のステージ「空の草原」が解放された！");
                }
                stageLast.style.display = "none";
                flg.stageLastWin = true;
                let gameClearPanel = document.getElementById('gameClearPanel');
                gameClearPanel.style.display = "block";
                let mapMoveToHeaven = document.getElementById('mapMoveToHeaven');
                mapMoveToHeaven.style.display = "block";
                flg.stage8 = true;
                player.badges.push("👑");
            } else if (enemy.name === 'アストラルドラコ') {
                if (!flg.stage9) {
                    alert("次のステージ「モクモクの森」が解放された！");
                }
                flg.stage9 = true;
            } else if (enemy.name === 'ザルヴァドス') {
                if (!flg.stage10) {
                    alert("次のステージ「避雷針」が解放された！");
                }
                flg.stage10 = true;
            } else if (enemy.name === 'セラフィオス') {
                if (!flg.stage11) {
                    alert("次のステージ「天空城」が解放された！");
                }
                flg.stage11 = true;
            } else if (enemy.name === 'オルディア') {
                if (!flg.stage12) {
                    alert("次のステージ「ロコモコ山」が解放された！");
                }
                flg.stage12 = true;
            } else if (enemy.name === 'ルシフェル') {
                if (flg.extra3Win) {
                    flg.extra3 = false;
                    extra3.style.display = "none";
                } else {
                    if (!flg.extra3) {
                        alert("マップに天空龍「ルクス・ヴェルム」が現れた！");
                    }
                    flg.extra3 = true;
                    extra3.style.display = "block";
                }
            } else if (enemy.name === 'ルクス・ヴェルム') {
                if (!flg.stage13) {
                    alert("次のステージ「天空の祭壇」が解放された！");
                }
                extra3.style.display = "none";
                flg.extra3Win = true;
                flg.stage13 = true;
            } else if (enemy.name === 'アストラリオン') {
                if (!flg.stage14) {
                    alert("次のステージ「点氷山」が解放された！");
                }
                flg.stage14 = true;
            } else if (enemy.name === 'アビスファング') {
                if (flg.extra4Win) {
                    flg.extra4 = false;
                    extra4.style.display = "none";
                } else {
                    if (!flg.extra4) {
                        alert("マップに強敵「ザクナ」が現れた！");
                    }
                    flg.extra4 = true;
                    extra4.style.display = "block";
                }
            } else if (enemy.name === 'アビスロード・ザクナ') {
                if (!flg.stage15) {
                    alert("新マップの「地底」が解放された！\n次のステージ「赤の魔法陣」が解放された！\n次のステージ「青の魔法陣」が解放された！\n次のステージ「黄の魔法陣」が解放された！\n次のステージ「緑の魔法陣」が解放された！");
                }
                extra4.style.display = "none";
                flg.extra4Win = true;
                let mapMoveToUnderground = document.getElementById('mapMoveToUnderground');
                mapMoveToUnderground.style.display = "block";
                let game2ClearPanel = document.getElementById('game2ClearPanel');
                game2ClearPanel.style.display = "block";
                flg.stage15 = true;
                flg.stage16 = true;
                flg.stage17 = true;
                flg.stage18 = true;
                player.badges.push("🍜");
            } else if (enemy.name === '元素獣オリジン') {
                if (flg.extra5Win) {
                    flg.extra5 = false;
                    extra5.style.display = "none";
                } else {
                    if (!flg.extra5) {
                        alert("マップに「光神ルミナリア」が降臨した！");
                    }
                    flg.extra5 = true;
                    extra5.style.display = "block";
                }
            } else if (enemy.name === '光神ルミナリア') {
                extra5.style.display = "none";
                flg.extra5Win = true;
                let game3ClearPanel = document.getElementById('game3ClearPanel');
                game3ClearPanel.style.display = "block";
                player.badges.push("⚛️");
            }
            displaySessionLogs();
            win();
            //monster.innerHTML = "<img onclick='win()' class='animate__animated animate__fadeIn' src='coin_gold_02.png' alt='背景' width='100%' height='100px'>";
        } else {
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
            flg.stage14 = false;
            flg.stageLast = false;
            flg.castle = false;
            flg.extra1 = false;
            flg.extra1Win = false;
            flg.extra2 = false;
            flg.extra2Win = false;
            flg.extra3 = false;
            flg.extra3Win = false;
            flg.extra4 = false;
            flg.extra4Win = false;
            flg.extra5 = false;
            flg.extra5Win = false;
            flg.stageLastWin = false;
            displaySessionLogs();
            end();
        }
    }
}

//戦闘後勝利時の処理
function win() {
    let nextBattle = document.getElementById('nextBattle');

    if (player.stage === 'last') {
        nextBattle.style.display = "none";
    } else if (player.stage === 19) {
        nextBattle.style.display = "block";
    } else if (player.stage === 18) {
        nextBattle.style.display = "block";
    } else if (player.stage === 17) {
        nextBattle.style.display = "block";
    } else if (player.stage === 16) {
        nextBattle.style.display = "block";
    } else if (player.stage === 15) {
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
    } else if (player.stage === 'ex5') {
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
    let monster2 = document.getElementById("monster2");
    monster2.innerHTML = "";
    let sectionIds = [];
    let winName = document.getElementById("winName");
    winName.innerHTML = enemy.name;
    let winGold = document.getElementById("winGold");
    winGold.innerHTML = enemy.coin;
    let winPoints = document.getElementById("winPoints");
    winPoints.innerHTML = enemy.points;
    let gameUI = document.getElementById("gameUI");
    let logPanel = document.getElementById("logPanel");
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
    let gameUI = document.getElementById("gameUI");
    let logPanel = document.getElementById("logPanel");
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
    let map3 = document.getElementById("map3");
    map3.style.display = "none";
    stopBGM();
    let sectionIds = [];
    let mapHeaven = document.getElementById("mapHeaven");
    sectionIds.push(mapHeaven.id);
    playBGM("heaven");
    showSection(sectionIds);
}

function mapMoveToUnderground() {
    let map1 = document.getElementById("map1");
    map1.style.display = "none";
    let map2 = document.getElementById("map2");
    map2.style.display = "none";
    let map3 = document.getElementById("map3");
    map3.style.display = "block";
    stopBGM();
    let sectionIds = [];
    let mapUnderground = document.getElementById("mapUnderground");
    sectionIds.push(mapUnderground.id);
    playBGM("underground");
    showSection(sectionIds);
}

//mapに戻る
function mapGame() {
    let map1 = document.getElementById("map1");
    map1.style.display = "block";
    let map2 = document.getElementById("map2");
    map2.style.display = "none";
    let map3 = document.getElementById("map3");
    map3.style.display = "none";
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
    map1.style.display = "none";
    let map2 = document.getElementById("map2");
    map2.style.display = "block";
    let map3 = document.getElementById("map3");
    map3.style.display = "none";
    stopBGM();
    playBGM("heaven");
    let sectionIds = [];
    let mapHeaven = document.getElementById("mapHeaven");
    sectionIds.push(mapHeaven.id);
    showSection(sectionIds);
}

//地底に戻る
function mapUndergroundGame() {
    let map1 = document.getElementById("map1");
    map1.style.display = "none";
    let map2 = document.getElementById("map3");
    map2.style.display = "none";
    let map3 = document.getElementById("map3");
    map3.style.display = "block";
    stopBGM();
    playBGM("underground");
    let sectionIds = [];
    let mapUnderground = document.getElementById("mapUnderground");
    sectionIds.push(mapUnderground.id);
    showSection(sectionIds);
}

//無限の塔のタイトル画面に遷移する
function showTowerTitle() {
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
    let mapMoveToUnderground = document.getElementById('mapMoveToUnderground');
    mapMoveToUnderground.style.display = "none";
    let monster = document.getElementById('monster');
    monster.innerHTML = "";
    let monster2 = document.getElementById('monster2');
    monster2.innerHTML = "";

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
    player.eternalPotion = 0;
    player.points = 0;
    player.badges = [];
    enemy.points = 0;
    battleLogLive = [];
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
    flg.stage15 = false;
    flg.stage16 = false;
    flg.stage17 = false;
    flg.stage18 = false;
    flg.stage19 = false;
    flg.stage15Win = false;
    flg.stage16Win = false;
    flg.stage17Win = false;
    flg.stage18Win = false;
    flg.stage19Win = false;
    flg.castle = false;
    flg.extra1 = false;
    flg.extra1Win = false;
    flg.extra2 = false;
    flg.extra2Win = false;
    flg.extra3 = false;
    flg.extra3Win = false;
    flg.extra4 = false;
    flg.extra4Win = false;
    flg.extra5 = false;
    flg.extra5Win = false;
    flg.stageLastWin = false;
    updatePointsDisplay();
    //Start画面に遷移
    let sectionIds = [];
    let towerStartMenu = document.getElementById("towerStartMenu");
    sectionIds.push(towerStartMenu.id);
    showSection(sectionIds);
}


//ゲームの再プレイの準備処理（入力欄、ログの初期化・画面の戻し）
function titleGame() {
    stopBGM();
    flg.tower = false;
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
    let mapMoveToUnderground = document.getElementById('mapMoveToUnderground');
    mapMoveToUnderground.style.display = "none";
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
    player.eternalPotion = 0;
    player.points = 0;
    player.badges = [];
    enemy.points = 0;
    battleLogLive = [];
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
    flg.stage15 = false;
    flg.stage16 = false;
    flg.stage17 = false;
    flg.stage18 = false;
    flg.stage19 = false;
    flg.stage15Win = false;
    flg.stage16Win = false;
    flg.stage17Win = false;
    flg.stage18Win = false;
    flg.castle = false;
    flg.extra1 = false;
    flg.extra1Win = false;
    flg.extra2 = false;
    flg.extra2Win = false;
    flg.extra3 = false;
    flg.extra3Win = false;
    flg.extra4 = false;
    flg.extra4Win = false;
    flg.extra5 = false;
    flg.extra5Win = false;
    flg.stageLastWin = false;
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
    } else if (player.stage === 19) {
        startGames19();
    } else if (player.stage === 18) {
        startGames18();
    } else if (player.stage === 17) {
        startGames17();
    } else if (player.stage === 16) {
        startGames16();
    } else if (player.stage === 15) {
        startGames15();
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
    } else if (player.stage === 'ex5') {
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
    let startMenu = document.getElementById("startMenu");
    let instructionsPanel = document.getElementById("instructionsPanel");
    sectionIds.push(startMenu.id, instructionsPanel.id);
    showSection(sectionIds);
}

//無限の塔の操作方法の表示
function showInstructionsTower() {
    let sectionIds = [];
    let towerStartMenu = document.getElementById("towerStartMenu");
    let instructionsTowerPanel = document.getElementById("instructionsTowerPanel");
    sectionIds.push(towerStartMenu.id, instructionsTowerPanel.id);
    showSection(sectionIds);
}

//無限の塔のゲーム詳細
function showTowerList() {
    let sectionIds = [];
    let towerStartMenu = document.getElementById("towerStartMenu");
    let towerGamePanel = document.getElementById("towerGamePanel");
    sectionIds.push(towerStartMenu.id, towerGamePanel.id);
    showSection(sectionIds);
}

//敵一覧の表示
function showEnemyList() {
    let sectionIds = [];
    let startMenu = document.getElementById("startMenu");
    let enemyListPanel = document.getElementById("enemyListPanel");
    sectionIds.push(startMenu.id, enemyListPanel.id);
    showSection(sectionIds);
}

//アイテム屋の表示
function itemshop() {
    let sectionIds = [];
    let itemshop = document.getElementById("itemshop");
    sectionIds.push(itemshop.id);
    showSection(sectionIds);
    let playerGold = document.getElementById('playerGold');
    playerGold.innerHTML = player.coin;
}

//鍛冶屋の表示
function weaponshop() {
    alert("今はやってないみたい…");
    // let sectionIds = [];
    // let weaponshop = document.getElementById("weaponshop");
    // sectionIds.push(weaponshop.id);
    // showSection(sectionIds);
}

//無限の塔パネルを閉じる（例：操作説明、ルールなど）
function closeTowerPanel() {
    let sectionIds = [];
    let towerStartMenu = document.getElementById("towerStartMenu");
    sectionIds.push(towerStartMenu.id);
    showSection(sectionIds);
}

//パネルを閉じる（例：操作説明、ルールなど）
function closePanel() {
    let sectionIds = [];
    let startMenu = document.getElementById("startMenu");
    sectionIds.push(startMenu.id);
    showSection(sectionIds);
}

function closeClearPanel() {
    let gameClearPanel = document.getElementById('gameClearPanel');
    gameClearPanel.style.display = "none";
    let sectionIds = [];
    let startMenu = document.getElementById("map");
    sectionIds.push(startMenu.id);
    showSection(sectionIds);
}

function closeClearPanel2() {
    let game2ClearPanel = document.getElementById('game2ClearPanel');
    game2ClearPanel.style.display = "none";
    let sectionIds = [];
    let mapHeaven = document.getElementById("mapHeaven");
    sectionIds.push(mapHeaven.id);
    showSection(sectionIds);
}

function closeClearPanel3() {
    let game3ClearPanel = document.getElementById('game3ClearPanel');
    game3ClearPanel.style.display = "none";
    let sectionIds = [];
    let mapUnderground = document.getElementById("mapUnderground");
    sectionIds.push(mapUnderground.id);
    showSection(sectionIds);
}

//魔王のHPが1/3を切ったら、変身する
function changeMaou() {
    flashEffect();
    // let hensin = document.getElementById("effect");
    // hensin.innerHTML = "<img src='gif/hensin.gif' alt='背景' width='300px' height='300px'>";
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
    flashEffect();
    // let hensin = document.getElementById("effect");
    // hensin.innerHTML = "<img src='gif/hensin.gif' alt='背景' width='300px' height='300px'>";
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
    flashEffect();
    // let hensin = document.getElementById("effect");
    // hensin.innerHTML = "<img src='gif/hensin.gif' alt='背景' width='300px' height='300px'>";
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

    if (flg.tower) {
        // 確認メッセージ
        let confirmCraft = confirm("データは失われますが、塔から出ますか？");

        if (confirmCraft) {
            alert("塔から脱出しました！");
            showTowerTitle();
        } else {
            alert("キャンセルしました。");
        }
    } else {
        if (enemy.hp != enemy.maxHP || player.hp != player.maxHP) {
            alert(enemy.name + "から逃げることはできない。");
        } else {
            if (player.stage === 8 || player.stage === 9 || player.stage === 10 || player.stage === 11 || player.stage === 12 || player.stage === 'ex3' || player.stage === 13 || player.stage === 14 || player.stage === 'ex4') {
                runAwayBGM();
                alert(enemy.name + "から逃げました。");
                let mapHeaven = document.getElementById("mapHeaven");
                sectionIds.push(mapHeaven.id);
                showSection(sectionIds);
                stopBGM();
                playBGM("heaven");
            } else if (player.stage === 15 || player.stage === 16 || player.stage === 17 || player.stage === 18 || player.stage === 19 || player.stage === 'ex5') {
                runAwayBGM();
                alert(enemy.name + "から逃げました。");
                let mapUnderground = document.getElementById("mapUnderground");
                sectionIds.push(mapUnderground.id);
                showSection(sectionIds);
                stopBGM();
                playBGM("underground");
            } else {
                runAwayBGM();
                alert(enemy.name + "から逃げました。");
                let map = document.getElementById("map");
                sectionIds.push(map.id);
                showSection(sectionIds);
                stopBGM();
                playBGM("map");
            }
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

//レベルが10上がるごとにボーナスを適用・新規
function levelUP() {
    if (player.bonus && player.level % 10 === 0) {
        alert("レベルアップボーナス！！！");

        // 100レベルごとに最新バッジを付与（青色数字に統一）
        if (player.level % 100 === 0) {
            let levelBadge = null;

            if (player.level >= 500) {
                levelBadge = "🔢";
            } else if (player.level >= 400) {
                levelBadge = "4️⃣";
            } else if (player.level >= 300) {
                levelBadge = "3️⃣";
            } else if (player.level >= 200) {
                levelBadge = "2️⃣";
            } else if (player.level >= 100) {
                levelBadge = "1️⃣";
            }

            if (levelBadge) {
                // 👑🍜⚛️などは残し、数字バッジのみ入れ替え
                player.badges = player.badges.filter(b => !["1️⃣", "2️⃣", "3️⃣", "4️⃣", "🔢"].includes(b));
                player.badges.push(levelBadge);
            }
        }

        // HP・攻撃力の成長幅を設定
        let hpBonus = 0;
        let atkBonus = 0;

        if (player.level >= 100) {
            hpBonus = 10;
            atkBonus = 5;
        } else if (player.level >= 40) {
            hpBonus = 10;
            atkBonus = 3;
        } else if (player.level >= 10) {
            hpBonus = 5;
            atkBonus = 3;
        }

        player.maxHP += hpBonus;
        player.attack += atkBonus;

        player.bonus = false;  // ボーナス適用後はリセット
    }
}


function playBGM(name) {
    // 同じ曲なら何もしない
    if (currentBGM && currentBGM.src.includes(bgmList[name].src)) {
        return;
    }

    // フェードアウト処理
    if (currentBGM) {
        clearInterval(fadeInterval);

        fadeInterval = setInterval(() => {
            if (currentBGM.volume > 0.05) {
                currentBGM.volume -= 0.05;
            } else {
                clearInterval(fadeInterval);
                currentBGM.pause();
                currentBGM.currentTime = 0;
                startNewBGM(name); // 新しいBGMを再生
            }
        }, 50); // 50msごとに少しずつ下げる（自然なフェード）
    } else {
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

//ランキングの表示
function showRnaking() {
    let sectionIds = [];
    let startMenu = document.getElementById("startMenu");
    let ranking = document.getElementById("ranking");

    sectionIds.push(startMenu.id, ranking.id);
    showSection(sectionIds);
    loadRanking();
}

//画面がフラッシュ
function flashEffect() {
    flashCover.classList.add("active");
    requestAnimationFrame(() => {
        flashCover.classList.remove("active");
    });
}

////////////////////////////////////////////////////////////////////////////
/* 「無限の塔」のコードはここから */
////////////////////////////////////////////////////////////////////////////
let tower = {
    floor: 1,      // 現在の階数
    highest: 0,    // 最高到達階
    inTower: false // 塔バトル中かどうか
};

//塔挑戦開始
async function startGameTower() {
    const ref = doc(db, "players", playerId);
    console.log("参照中のドキュメントID:", ref.id);

    // プロフィールを読み込む（名前・バッジなど）
    await loadPlayerProfile();
    console.log("読み込み後の名前:", player.name);

    if (player.name === '"名無し"') {
        alert("RPGのデータを作成してセーブしてください。");
        return;
    }

    stopBGM();
    flg.tower = true;

    let rareItemsHpPotion = document.getElementById("rareItemsHpPotion");
    let rareItemsPwPotion = document.getElementById("rareItemsPwPotion");
    let rareItemsHpUpPotion = document.getElementById("rareItemsHpUpPotion");
    let rareItemsEternalPotion = document.getElementById("rareItemsEternalPotion");
    rareItemsHpPotion.innerHTML = "";
    rareItemsPwPotion.innerHTML = "";
    rareItemsHpUpPotion.innerHTML = "";
    rareItemsEternalPotion.innerHTML = "";

    let towerEnd = document.getElementById('towerEnd');
    towerEnd.style.display = "none";
    let nextBattleTower = document.getElementById('nextBattleTower');
    nextBattleTower.style.display = "block";

    let sectionIds = [];

    // 画面表示
    let gameUI = document.getElementById("gameUI");
    let logPanel = document.getElementById("logPanel");
    sectionIds.push(gameUI.id, logPanel.id);
    showSection(sectionIds);

    // 初期化（塔専用モード）
    tower.floor = 1;
    tower.inTower = true;

    // プレイヤーHPをリセット（塔モードは毎回全快スタート）
    player.hp = player.maxHP;
    player.defending = false;
    player.end = false;

    // UI更新
    document.getElementById("playerName").innerHTML = player.name;
    document.getElementById("playerLevel").innerHTML = player.level;
    document.getElementById("playerAttack").innerHTML = player.attack;

    // 敵キャラクターを生成
    document.getElementById("monster").innerHTML = "";
    document.getElementById("monster2").innerHTML = "";
    generateEnemyTower(tower.floor);

    // 戦闘ログ初期化
    let battleLog = document.getElementById("battleLog");
    battleLog.innerHTML = "";
    battleLogLive = [];
    console.log("battleLogLive初期化:", battleLogLive);

    // ステータス表示更新
    updateDisplay();
}

// //無限の塔の敵キャラクターの無限生成
// function generateEnemyTower(floor) {
//     stopBGM();
//     // BGM再生
//     playBGM("battle");
//     let sectionIds = [];
//     let gameUI = document.getElementById("gameUI");
//     let logPanel = document.getElementById("logPanel");
//     sectionIds.push(gameUI.id, logPanel.id);
//     showSection(sectionIds);

//     enemy.points = 0;
//     enemy.coin = 0;

//     // 敵候補
//     //let types = ['ゾンビ', 'マミー', 'ガーゴイル'];
//     let types = ['ゾンビ'];

//     // ランダムに1体選択
//     let selected = types[Math.floor(Math.random() * types.length)];

//     let monster = document.getElementById("monster");
//     let area = document.getElementById("area");

//     // 基礎ステータス
//     let baseStats = {
//         'ゾンビ': { hp: 10, attack: 1, img: "ゾンビ.png" }
//         // 'マミー': { hp: 67, attack: 8, img: "マミー.png" },
//         // 'ガーゴイル': { hp: 100, attack: 17, img: "ガーゴイル.png" }
//     };

//     let stats = baseStats[selected];

//     // --- 階層補正 ---
//     let hp = stats.hp + floor * 50;
//     let attack = stats.attack + Math.floor(floor * 5);
//     let level = floor;

//     // 敵データセット
//     enemy.name = selected;
//     enemy.hp = hp;
//     enemy.maxHP = hp;
//     enemy.attack = attack;
//     enemy.level = level;

//     // 背景・モンスター画像
//     area.innerHTML = "<img src='ver1.7/tower1.png' alt='背景' width='100%' height='620px'>";
//     monster.innerHTML = `<img class='animate__animated animate__fadeIn' src='stage2/${stats.img}' alt='敵' width='100%' height='250px'>`;

//     // 表示更新
//     document.getElementById("enemyName").innerHTML = `${enemy.name}`;
//     document.getElementById("enemyLevel").innerHTML = `Lv.${enemy.level}`;

//     // 確認ログ
//     console.log(`${floor}階: ${enemy.name} Lv.${enemy.level} HP:${enemy.hp} ATK:${enemy.attack}`);
// }

//無限の塔の敵キャラクターの階数別で生成
function generateEnemyTower(floor) {
    stopBGM();
    // 背景画像の切り替え
    let enemyImage = "";
    let areaImage = "";

    const sectionIds = ["gameUI", "logPanel"];
    showSection(sectionIds);

    enemy.points = 0;
    enemy.coin = 0;

    const monster = document.getElementById("monster");
    const monster2 = document.getElementById("monster2");
    const area = document.getElementById("area");

    const baseStats = {
        // モンスター（1〜9階）
        'スライム': { hp: 100, attack: 10, img: "スライム.png" },
        'ゴブリン': { hp: 120, attack: 12, img: "ゴブリン.png" },
        'ゲベロペ': { hp: 140, attack: 14, img: "ゲベロペ.png" },

        // モンスター（11〜19階）
        'ゾンビ': { hp: 180, attack: 20, img: "ゾンビ.png" },
        'マミー': { hp: 200, attack: 23, img: "マミー.png" },
        'ガーゴイル': { hp: 220, attack: 26, img: "ガーゴイル.png" },

        // モンスター（21〜29階）
        '雪男': { hp: 260, attack: 30, img: "雪男.png" },
        'スノーフェアリー': { hp: 280, attack: 33, img: "スノーフェアリー.png" },
        'スノーワイバーン': { hp: 300, attack: 36, img: "スノーワイバーン.png" },

        // モンスター（31〜39階）
        'ウィッチ': { hp: 330, attack: 38, img: "ウィッチ.png" },
        'レッドドラゴン': { hp: 360, attack: 42, img: "レッドドラゴン.png" },
        '大天使': { hp: 380, attack: 45, img: "大天使.png" },

        // モンスター（41〜49階）
        'フングリード': { hp: 410, attack: 48, img: "フングリード.png" },
        'グルームリッチ': { hp: 440, attack: 52, img: "グルームリッチ.png" },
        'ヴェノメギド': { hp: 470, attack: 56, img: "ヴェノメギド.png" },

        // モンスター（51〜59階）
        'フレイモン': { hp: 500, attack: 60, img: "フレイモン.png" },
        'フェニクレスト': { hp: 530, attack: 65, img: "フェニクレスト.png" },
        'インフェルナード': { hp: 560, attack: 70, img: "インフェルナード.png" },

        // モンスター（61〜69階）
        'ルーナリス': { hp: 600, attack: 75, img: "ルーナリス.png" },
        'ノクタリオン': { hp: 630, attack: 80, img: "ノクタリオン.png" },
        'グリムヴェイル': { hp: 660, attack: 85, img: "グリムヴェイル.png" },

        // モンスター（71〜79階）
        'セレスティコーン': { hp: 700, attack: 90, img: "セレスティコーン.png" },
        'セラフィム': { hp: 740, attack: 95, img: "セラフィム.png" },
        'セラフィオス': { hp: 780, attack: 100, img: "セラフィオス.png" },

        // モンスター（81〜89階）
        'エレボス': { hp: 820, attack: 105, img: "エレボス.png" },
        'グリムセラフ': { hp: 860, attack: 110, img: "グリムセラフ.png" },
        'ルシフェル': { hp: 900, attack: 115, img: "ルシフェル.png" },

        // モンスター（91〜99階）
        '炎獄の覇者イグナトス': { hp: 950, attack: 120, img: "炎獄の覇者イグナトス.png" },
        '紅蓮の軍神マルザード': { hp: 1000, attack: 125, img: "紅蓮の軍神マルザード.png" },
        '煉獄の魔神ゼグナール': { hp: 1050, attack: 130, img: "煉獄の魔神ゼグナール.png" },

        // ボス（各10階）
        'フレイムロード・バルガン': { hp: 1200, attack: 140, img: "フレイムロード・バルガン.png" },
        '冥騎将ダルクス': { hp: 1600, attack: 180, img: "冥騎将ダルクス.png" },
        '氷獄王グラキエス': { hp: 2000, attack: 220, img: "氷獄王グラキエス.png" },
        '海神蛇セイリュウス': { hp: 2400, attack: 260, img: "海神蛇セイリュウス.png" },
        '紫焔竜ヴァルファング': { hp: 2800, attack: 300, img: "紫焔竜ヴァルファング.png" },
        '獄焔鬼バルヴァ＝ガルム': { hp: 3200, attack: 340, img: "獄焔鬼バルヴァ＝ガルム.png" },
        '魔炎獣ガルヴァリウス': { hp: 3600, attack: 380, img: "魔炎獣ガルヴァリウス.png" },
        '骸帝ドラグ＝ネクロス': { hp: 4000, attack: 420, img: "骸帝ドラグ＝ネクロス.png" },
        '深淵の従者ネブラ': { hp: 4400, attack: 460, img: "深淵の従者ネブラ.png" },
        '煉獄魔王フラガ＝ドレムス': { hp: 5000, attack: 500, img: "煉獄魔王フラガ＝ドレムス.png" },
    };

    let selected;

    // ボス階の処理（10, 20, 30階...）
    if (floor % 10 === 0) {
        if (floor >= 100) {
            selected = '煉獄魔王フラガ＝ドレムス';
            enemyImage = "ver1.7";
            areaImage = "tower3.png";
            playBGM("lastBoss");
        } else if (floor >= 90) {
            selected = '深淵の従者ネブラ';
            enemyImage = "ver1.7";
            areaImage = "tower3.png";
            playBGM("stageBoss");
        } else if (floor >= 80) {
            selected = '骸帝ドラグ＝ネクロス';
            enemyImage = "ver1.7";
            areaImage = "tower3.png";
            playBGM("stageBoss");
        } else if (floor >= 70) {
            selected = '魔炎獣ガルヴァリウス';
            enemyImage = "ver1.7";
            areaImage = "tower3.png";
            playBGM("stageBoss");
        } else if (floor >= 60) {
            selected = '獄焔鬼バルヴァ＝ガルム';
            enemyImage = "ver1.7";
            areaImage = "tower3.png";
            playBGM("stageBoss");
        } else if (floor >= 50) {
            selected = '紫焔竜ヴァルファング';
            enemyImage = "ver1.7";
            areaImage = "tower2.png";
            playBGM("stageBoss");
        } else if (floor >= 40) {
            selected = '海神蛇セイリュウス';
            enemyImage = "ver1.7";
            areaImage = "tower2.png";
            playBGM("stageBoss");
        } else if (floor >= 30) {
            selected = '氷獄王グラキエス';
            enemyImage = "ver1.7";
            areaImage = "tower2.png";
            playBGM("stageBoss");
        } else if (floor >= 20) {
            selected = '冥騎将ダルクス';
            enemyImage = "ver1.7";
            areaImage = "tower2.png";
            playBGM("stageBoss");
        } else {
            selected = 'フレイムロード・バルガン';
            enemyImage = "ver1.7";
            areaImage = "tower1.png";
            playBGM("stageBoss");
        }

    } else {
        // 通常階の敵選択
        if (floor <= 9) {
            const basic = ['スライム', 'ゴブリン', 'ゲベロペ'];
            enemyImage = "stage1";
            areaImage = "tower1.png";
            playBGM("battle");
            selected = basic[Math.floor(Math.random() * basic.length)];
        } else if (floor <= 19) {
            const mid = ['ゾンビ', 'マミー', 'ガーゴイル'];
            enemyImage = "stage2";
            areaImage = "tower2.png";
            playBGM("battle");
            selected = mid[Math.floor(Math.random() * mid.length)];
        } else if (floor <= 29) {
            const advanced = ['雪男', 'スノーフェアリー', 'スノーワイバーン'];
            enemyImage = "stage3";
            areaImage = "tower2.png";
            playBGM("battle");
            selected = advanced[Math.floor(Math.random() * advanced.length)];
        } else if (floor <= 39) {
            const advanced = ['ウィッチ', 'レッドドラゴン', '大天使'];
            enemyImage = "stage4";
            areaImage = "tower2.png";
            playBGM("battle");
            selected = advanced[Math.floor(Math.random() * advanced.length)];
        } else if (floor <= 49) {
            const advanced = ['フングリード', 'グルームリッチ', 'ヴェノメギド'];
            enemyImage = "stage5";
            areaImage = "tower2.png";
            playBGM("battle");
            selected = advanced[Math.floor(Math.random() * advanced.length)];
        } else if (floor <= 59) {
            const advanced = ['フレイモン', 'フェニクレスト', 'インフェルナード'];
            enemyImage = "stage6";
            areaImage = "tower3.png";
            playBGM("battle");
            selected = advanced[Math.floor(Math.random() * advanced.length)];
        } else if (floor <= 69) {
            const advanced = ['ルーナリス', 'ノクタリオン', 'グリムヴェイル'];
            enemyImage = "stage7";
            areaImage = "tower3.png";
            playBGM("battle");
            selected = advanced[Math.floor(Math.random() * advanced.length)];
        } else if (floor <= 79) {
            const advanced = ['セレスティコーン', 'セラフィム', 'セラフィオス'];
            enemyImage = "stage10";
            areaImage = "tower3.png";
            playBGM("battle");
            selected = advanced[Math.floor(Math.random() * advanced.length)];
        } else if (floor <= 89) {
            const advanced = ['エレボス', 'グリムセラフ', 'ルシフェル'];
            enemyImage = "stage12";
            areaImage = "tower3.png";
            playBGM("battle");
            selected = advanced[Math.floor(Math.random() * advanced.length)];
        } else if (floor <= 99) {
            const advanced = ['炎獄の覇者イグナトス', '紅蓮の軍神マルザード', '煉獄の魔神ゼグナール'];
            enemyImage = "ver1.7";
            areaImage = "tower3.png";
            playBGM("battle");
            selected = advanced[Math.floor(Math.random() * advanced.length)];
        }
    }

    const stats = baseStats[selected];

    // --- 階層補正 ---
    let hp = stats.hp + floor * 50;
    let attack = stats.attack + Math.floor(floor * 5);
    let level = floor;

    // セット
    enemy.name = selected;
    enemy.hp = hp;
    enemy.maxHP = hp;
    enemy.attack = attack;
    enemy.level = level;

    // 表示
    area.innerHTML = `<img src='ver1.7/${areaImage}' alt='背景' width='100%' height='620px'>`;
    if (floor % 10 === 0) {
        monster.innerHTML = "";
        monster2.innerHTML = `<img class='animate__animated animate__fadeIn' src='${enemyImage}/${stats.img}' alt='敵' width='150%' height='300px'>`;
    } else {
        monster2.innerHTML = "";
        monster.innerHTML = `<img class='animate__animated animate__fadeIn' src='${enemyImage}/${stats.img}' alt='敵' width='100%' height='200px'>`;
    }

    document.getElementById("enemyName").innerHTML = enemy.name;
    document.getElementById("enemyLevel").innerHTML = `Lv.${enemy.level}`;

    console.log(`${floor}階: ${enemy.name} Lv.${enemy.level} HP:${enemy.hp} ATK:${enemy.attack}`);
}

function goNextFloor() {
    // 階数を進める
    tower.floor++;

    // 最高記録更新
    if (tower.floor > tower.highest) {
        tower.highest = tower.floor;
    }

    // 新しい敵を生成
    generateEnemyTower(tower.floor);

    // プレイヤーをリセット（全回復仕様）
    player.hp = player.maxHP;
    player.defending = false;
    player.end = false;

    document.getElementById("playerLevel").innerHTML = player.level;
    document.getElementById("playerAttack").innerHTML = player.attack;
    updateDisplay();

    log(`⚔️ ${tower.floor}階に進んだ！`);
}


//無限の塔：勝利処理
function towerWin() {
    //clearBGM入れる
    const floor = tower.floor;

    // 現在の階を突破
    log(`🎉 ${tower.floor}階を突破！`);

    // 次の階へ
    if (tower.floor > tower.highest) {
        tower.highest = tower.floor;
    }

    // バッジを更新！
    updateTowerBadge(tower.floor);

    // 戦闘継続のためにリセット
    player.defending = false;
    player.end = false;
    player.maxHP += 7;
    player.attack += 3;
    player.level += 1;
    stopBGM();
    updateDisplay();

    let rareItemsHpPotion = document.getElementById("rareItemsHpPotion");
    let rareItemsPwPotion = document.getElementById("rareItemsPwPotion");
    let rareItemsHpUpPotion = document.getElementById("rareItemsHpUpPotion");
    let rareItemsEternalPotion = document.getElementById("rareItemsEternalPotion");
    rareItemsHpPotion.innerHTML = "";
    rareItemsPwPotion.innerHTML = "";
    rareItemsHpUpPotion.innerHTML = "";
    rareItemsEternalPotion.innerHTML = "";

    //ボスモンスターの際はアイテムが必ずドロップする
    if (floor % 10 === 0) {
        console.log(tower.floor);
        if (floor === 100) {
            player.eternalPotion += 1;
            rareItemsEternalPotion.innerHTML = "エターナルポーション × 1"
            let lose = document.getElementById("towerLose");
            lose.style.display = "none";
            let win = document.getElementById("towerWin");
            win.style.display = "block";

            let monster = document.getElementById("monster");
            monster.innerHTML = "";
            let monster2 = document.getElementById("monster2");
            monster2.innerHTML = "";

            let winName = document.getElementById("winNameTower");
            winName.innerHTML = enemy.name;

            let towerEnd = document.getElementById('towerEnd');
            towerEnd.style.display = "block";

            let nextBattleTower = document.getElementById('nextBattleTower');
            nextBattleTower.style.display = "none";

            // ランキングに保存（Firestore）
            saveGameTower();
            saveTowerRanking();
            saveRanking();

            let sectionIds = [];
            let gameUI = document.getElementById("gameUI");
            let logPanel = document.getElementById("logPanel");
            let restartMenuTower = document.getElementById("restartMenuTower");
            sectionIds.push(restartMenuTower.id, gameUI.id, logPanel.id);
            showSection(sectionIds);
            return;
        } else if (floor >= 90) {
            player.pwPotion += 5;
            player.hpupPotion += 5;
            rareItemsHpUpPotion.innerHTML = "体力のポーション × 5";
            rareItemsPwPotion.innerHTML = "力のポーション × 5";
        } else if (floor >= 80) {
            player.pwPotion += 5;
            player.hpupPotion += 5;
            rareItemsHpUpPotion.innerHTML = "体力のポーション × 5";
            rareItemsPwPotion.innerHTML = "力のポーション × 5";
        } else if (floor >= 70) {
            player.pwPotion += 5;
            player.hpupPotion += 5;
            rareItemsHpUpPotion.innerHTML = "体力のポーション × 5";
            rareItemsPwPotion.innerHTML = "力のポーション × 5";
        } else if (floor >= 60) {
            player.pwPotion += 5;
            player.hpupPotion += 5;
            rareItemsHpUpPotion.innerHTML = "体力のポーション × 5";
            rareItemsPwPotion.innerHTML = "力のポーション × 5";
        } else if (floor >= 50) {
            player.pwPotion += 5;
            player.hpupPotion += 5;
            rareItemsHpUpPotion.innerHTML = "体力のポーション × 5";
            rareItemsPwPotion.innerHTML = "力のポーション × 5";
        } else if (floor >= 40) {
            player.pwPotion += 5;
            player.hpupPotion += 3;
            rareItemsHpUpPotion.innerHTML = "体力のポーション × 3";
            rareItemsPwPotion.innerHTML = "力のポーション × 5";
        } else if (floor >= 30) {
            player.pwPotion += 5;
            rareItemsPwPotion.innerHTML = "力のポーション × 5";
        } else if (floor >= 20) {
            player.pwPotion += 3;
            rareItemsPwPotion.innerHTML = "力のポーション × 3";
        } else if (floor >= 10) {
            player.pwPotion += 3;
            rareItemsPwPotion.innerHTML = "力のポーション × 3";
        }
    }

    let rare = (Math.random() < 0.1);
    if (rare) {
        player.hpPotion += 1;
        rareItemsHpPotion.innerHTML = "治癒のポーション × 1";
    } else {
        rareItemsHpPotion.innerHTML = "";
    }

    let lose = document.getElementById("towerLose");
    lose.style.display = "none";
    let win = document.getElementById("towerWin");
    win.style.display = "block";

    let monster = document.getElementById("monster");
    monster.innerHTML = "";
    let monster2 = document.getElementById("monster2");
    monster2.innerHTML = "";

    let winName = document.getElementById("winNameTower");
    winName.innerHTML = enemy.name;

    // ランキングに保存（Firestore）
    saveGameTower();
    saveTowerRanking();
    saveRanking();

    let sectionIds = [];
    let gameUI = document.getElementById("gameUI");
    let logPanel = document.getElementById("logPanel");
    let restartMenuTower = document.getElementById("restartMenuTower");
    sectionIds.push(restartMenuTower.id, gameUI.id, logPanel.id);
    showSection(sectionIds);
}

function towerLose() {
    let rareItemsHpPotion = document.getElementById("rareItemsHpPotion");
    let rareItemsPwPotion = document.getElementById("rareItemsPwPotion");
    let rareItemsHpUpPotion = document.getElementById("rareItemsHpUpPotion");
    let rareItemsEternalPotion = document.getElementById("rareItemsEternalPotion");
    rareItemsHpPotion.innerHTML = "";
    rareItemsPwPotion.innerHTML = "";
    rareItemsHpUpPotion.innerHTML = "";
    rareItemsEternalPotion.innerHTML = "";
    gameEnd();
    log(`💀 ${tower.floor}階で敗北…`);
    // 塔モード終了
    flg.tower = false;
    tower.floor = 1; // リセット

    // ランキングに保存（Firestore）
    saveTowerRanking();

    // 戦闘継続のためにリセット
    player.defending = false;
    player.end = false;

    // 通常画面に戻す処理（必要なら）
    stopBGM();
    let win = document.getElementById("towerWin");
    win.style.display = "none";
    let lose = document.getElementById("towerLose");
    lose.style.display = "block";
    let eName = document.getElementById("eNameTower");
    eName.innerHTML = enemy.name;
    let resultLevel = document.getElementById("resultLevelTower");
    resultLevel.innerHTML = player.level;
    let resultName = document.getElementById("resultNameTower");
    resultName.innerHTML = player.name;
    let resultHP = document.getElementById("resultHPTower");
    resultHP.innerHTML = player.maxHP;
    let resultAttack = document.getElementById("resultAttackTower");
    resultAttack.innerHTML = player.attack;
    // 到達記録を表示 resultTowerFloor
    let resultTower = document.getElementById("resultTower");
    resultTower.innerHTML = tower.highest;

    let sectionIds = [];
    let gameUI = document.getElementById("gameUI");
    let logPanel = document.getElementById("logPanel");
    let restartMenuTower = document.getElementById("restartMenuTower");
    sectionIds.push(restartMenuTower.id, gameUI.id, logPanel.id);
    showSection(sectionIds);
}

//無限の塔ランキングの表示
function showTowerRnaking() {
    let sectionIds = [];
    let towerStartMenu = document.getElementById("towerStartMenu");
    let rankingTower = document.getElementById("rankingTower");

    sectionIds.push(towerStartMenu.id, rankingTower.id);
    showSection(sectionIds);
    loadTowerRanking();
}

//Firestore に プレイヤー名 / 最高到達階 / 記録日時 を保存
async function saveTowerRanking() {
    try {
        const ref = doc(db, "towerRanking", playerId);
        const snap = await getDoc(ref);

        // 現在の最高記録
        let currentHighest = 0;
        if (snap.exists()) {
            currentHighest = snap.data().highest || 0;
        }

        // 新しい記録が低ければ更新しない
        if (tower.highest <= currentHighest) {
            console.log(`⏩ 記録更新なし: 現在(${tower.highest}) <= 保存済(${currentHighest})`);
            return;
        }

        // 新記録なら保存（完全上書き）
        await setDoc(ref, {
            name: player.name || "名無しの勇者",
            highest: tower.highest,
            reachedAt: serverTimestamp()
        });

        console.log("✅ 塔ランキング更新:", player.name, tower.highest);

    } catch (e) {
        console.error("❌ 塔ランキング保存エラー:", e);
    }
}

// プレイヤー名とバッジのみを読み込む関数
async function loadPlayerProfile() {
    try {
        const ref = doc(db, "players", playerId);
        console.log("📄 読み込むドキュメントID:", ref.id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
            const data = snap.data();
            console.log("📦 読み込んだデータ:", data);

            // ✅ ネストされた player オブジェクトから読み込む
            player.name = data.player?.name || "名無し";
            player.badges = data.player?.badges || [];
            player.maxHP = data.player?.maxHP || 100;
            player.attack = data.player?.attack || 10;
            player.pwPotion = data.player?.pwPotion || 0;
            player.hpupPotion = data.player?.hpupPotion || 0;
            player.eternalPotion = data.player?.eternalPotion || 0;

            console.log("プロフィール読み込み成功:", player.name, player.badges);
        } else {
            console.warn("プロフィールが存在しません");
        }
    } catch (e) {
        console.error("プロフィール読み込みエラー:", e);
    }
}


//ランキングを読み込む処理例
async function loadTowerRanking() {
    const rankingTowerList = document.getElementById("rankingTowerList");
    rankingTowerList.innerHTML = "";

    const q = query(
        collection(db, "towerRanking"),
        orderBy("highest", "desc"),   // 高い階数順
        orderBy("reachedAt", "asc"),  // 同じ階なら先着順
        limit(10)
    );

    const snapshot = await getDocs(q);

    snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement("li");
        li.innerHTML = `${data.name} : ${data.highest}階`;
        rankingTowerList.appendChild(li);
    });
}

//無限の塔の階数度とにバッジを付与
async function updateTowerBadge(floor) {
    // 階層に応じてバッジ定義
    let badge = null;

    if (floor >= 100) {
        badge = "💗";
    } else if (floor >= 75) {
        badge = "🖤";
    } else if (floor >= 50) {
        badge = "🤍";
    } else if (floor >= 25) {
        badge = "💛";
    } else if (floor >= 10) {
        badge = "❤️";
    }

    if (!badge) return;

    const towerBadges = ["❤️", "💛", "🤍", "🖤", "💗"];
    player.badges = player.badges.filter(b => !towerBadges.includes(b));
    player.badges.push(badge);

    try {
        await savePlayerData();
        console.log("✅ バッジ更新＆保存完了:", badge);
    } catch (e) {
        console.error("❌ バッジ保存エラー:", e);
    }
}

// ===== セーブ機能 =====
async function saveGameTower() {
    const saveData = {
        player: {
            name: player.name,
            pwPotion: player.pwPotion,
            hpupPotion: player.hpupPotion,
            eternalPotion: player.eternalPotion,
            badges: [...new Set(player.badges)], // 重複排除
        },
        flg: { ...flg } // フラグを丸ごとコピー
    };

    // localStorage に保存
    localStorage.setItem("rpgSaveData", JSON.stringify(saveData));

    // Firestore にも保存（マルチデバイス対応）
    try {
        await setDoc(doc(db, "players", playerId), saveData, { merge: true });
        console.log("✅ Firestore保存成功");
    } catch (e) {
        console.error("❌ Firestore保存エラー:", e);
    }
}

//window
window.saveGameTower = saveGameTower;
window.goNextFloor = goNextFloor;
window.loadTowerRanking = loadTowerRanking;
window.startGameTower = startGameTower;
window.showTowerRnaking = showTowerRnaking;
window.closeTowerPanel = closeTowerPanel;
window.showTowerList = showTowerList;
window.showInstructionsTower = showInstructionsTower;
window.savePlayerData = savePlayerData;
window.saveRanking = saveRanking;
window.loadPlayerData = loadPlayerData;
window.showInstructions = showInstructions;
window.showEnemyList = showEnemyList;
window.showRnaking = showRnaking;
window.loadRanking = loadRanking;
window.changePlayerName = changePlayerName;
window.saveGame = saveGame;
window.loadGame = loadGame;
window.showSection = showSection;
window.playGames = playGames;
window.menuOpen = menuOpen;
window.haveItems = haveItems;
window.menuClose = menuClose;
window.closeBug = closeBug;
window.castleShow = castleShow;
window.buyHpPotion = buyHpPotion;
window.buyPwPotion = buyPwPotion;
window.buyHpUpPotion = buyHpUpPotion;
window.compoundingEternalPotion = compoundingEternalPotion;
window.startGames1 = startGames1;
window.startGames2 = startGames2;
window.startGames3 = startGames3;
window.startGames4 = startGames4;
window.startGames5 = startGames5;
window.startGames6 = startGames6;
window.startGames7 = startGames7;
window.startGames8 = startGames8;
window.startGames9 = startGames9;
window.startGames10 = startGames10;
window.startGames11 = startGames11;
window.startGames12 = startGames12;
window.startGames13 = startGames13;
window.startGames14 = startGames14;
window.startGames15 = startGames15;
window.startGames16 = startGames16;
window.startGames17 = startGames17;
window.startGames18 = startGames18;
window.startGames19 = startGames19;
window.startGamesLast = startGamesLast;
window.extra1 = extra1;
window.extra2 = extra2;
window.extra3 = extra3;
window.extra4 = extra4;
window.extra5 = extra5;
window.defendAction = defendAction;
window.useItems = useItems;
window.playerAttack = playerAttack;
window.useHpPotion = useHpPotion;
window.usePwPotion = usePwPotion;
window.useHpUpPotion = useHpUpPotion;
window.useEternalPotion = useEternalPotion;
window.mapMoveToHeaven = mapMoveToHeaven;
window.mapMoveToUnderground = mapMoveToUnderground;
window.mapGame = mapGame;
window.mapHeavenGame = mapHeavenGame;
window.mapUndergroundGame = mapUndergroundGame;
window.titleGame = titleGame;
window.restartGame = restartGame;
window.showPanel = showPanel;
window.hiddenPanel = hiddenPanel;
window.downloadSessionLog = downloadSessionLog;
window.itemshop = itemshop;
window.weaponshop = weaponshop;
window.closePanel = closePanel;
window.closeClearPanel = closeClearPanel;
window.closeClearPanel2 = closeClearPanel2;
window.closeClearPanel3 = closeClearPanel3;
window.playGames = playGames;
window.loadGame = loadGame;
window.runAway = runAway;
window.flashEffect = flashEffect;
window.showTowerTitle = showTowerTitle;
