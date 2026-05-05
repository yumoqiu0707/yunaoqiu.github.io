let row = 4;
let col = 4;
let rate2 = 90;
let mode = "classic";

let board = [];
let nowScore = 0;
let currentMaxNum = 0;
let bestMaxNum = +localStorage.getItem("super2048BestNum") || 0;
let step = 0;
let winFlag = false;
let historyStack = [];
let hideCells = [];
let timeLeft = 60;
let timer = null;
let surviveTimer = null;

const gameMain = document.getElementById("gameMain");
const nowScoreDom = document.getElementById("nowScore");
const currentMaxDom = document.getElementById("maxNum");
const bestMaxDom = document.getElementById("bestNum");
const stepDom = document.getElementById("stepNum");
const timeDom = document.getElementById("timeNum");
const winModal = document.getElementById("winModal");
const overModal = document.getElementById("overModal");
const endMaxDom = document.getElementById("endMaxNum");
const themeSel = document.getElementById("themeSelect");

themeSel.onchange = function(){
    if(this.value === "dark"){
        document.body.classList.add("dark-theme");
    }else{
        document.body.classList.remove("dark-theme");
    }
};

function initGame() {
    if(timer) clearInterval(timer);
    if(surviveTimer) clearInterval(surviveTimer);
    
    row = +document.getElementById("rowSelect").value;
    col = +document.getElementById("colSelect").value;
    rate2 = +document.getElementById("rateSelect").value;
    mode = document.getElementById("modeSelect").value;

    nowScore = 0;
    currentMaxNum = 0;
    step = 0;
    winFlag = false;
    historyStack = [];
    hideCells = [];
    board = Array(row).fill().map(() => Array(col).fill(0));

    if(mode === "barrier"){
        let wallNum = Math.floor(row*col/6);
        for(let i=0;i<wallNum;i++){
            let r = Math.floor(Math.random()*row);
            let c = Math.floor(Math.random()*col);
            board[r][c] = -1;
        }
    }

    if(mode === "hide"){
        let hideNum = Math.floor(row*col/3);
        for(let i=0;i<hideNum;i++){
            let r = Math.floor(Math.random()*row);
            let c = Math.floor(Math.random()*col);
            hideCells.push(`${r},${c}`);
        }
    }

    if(mode === "time"){
        timeLeft = 60;
        timeDom.innerText = timeLeft;
        timer = setInterval(()=>{
            timeLeft--;
            timeDom.innerText = timeLeft;
            if(timeLeft <= 0){
                clearInterval(timer);
                endMaxDom.innerText = currentMaxNum;
                overModal.style.display = "block";
            }
        },1000);
    }else if(mode === "survive"){
        timeDom.innerText = "自动刷块";
        surviveTimer = setInterval(()=>{
            if(randBlock()){
                render();
                checkGameOver();
            }else{
                clearInterval(surviveTimer);
                endMaxDom.innerText = currentMaxNum;
                overModal.style.display = "block";
            }
        },5000);
    }else{
        timeDom.innerText = "--";
    }

    randBlock();
    randBlock();
    saveHistory();
    render();
    updateScore();
    winModal.style.display = "none";
    overModal.style.display = "none";
}

function randBlock() {
    let empty = [];
    for(let i=0;i<row;i++){
        for(let j=0;j<col;j++){
            if(board[i][j] === 0) empty.push([i,j]);
        }
    }
    if(!empty.length) return false;
    let [x,y] = empty[Math.floor(Math.random()*empty.length)];
    board[x][y] = Math.random()*100 < rate2 ? 2 : 4;
    return true;
}

function saveHistory(){
    historyStack.push(JSON.parse(JSON.stringify(board)));
    if(historyStack.length > 50) historyStack.shift();
}

function undoStep(){
    if(historyStack.length <= 1) return;
    historyStack.pop();
    board = historyStack[historyStack.length-1];
    render();
}

function render() {
    let html = '<div class="grid-container">';
    for(let i=0;i<row;i++){
        html += '<div class="grid-row">';
        for(let j=0;j<col;j++){
            let val = board[i][j];
            let cls = "cell";
            if(mode === "hide" && hideCells.includes(`${i},${j}`)){
                cls += " cHide";
                html += `<div class="${cls}">?</div>`;
                continue;
            }
            if(val === -1) cls += " cWall";
            else if(val > 0) cls += " c"+val;
            html += `<div class="${cls}">${val<=0?'':val}</div>`;
        }
        html += '</div>';
    }
    html += '</div>';
    gameMain.innerHTML = html;
}

function moveLeft(arr) {
    let res = arr.filter(v => v!==0 && v!==-1);
    for(let i=0;i<res.length-1;i++){
        if(res[i] === res[i+1]){
            res[i] *= 2;
            let add = res[i];
            nowScore += add;
            
            if(res[i] > currentMaxNum){
                currentMaxNum = res[i];
                if(currentMaxNum > bestMaxNum){
                    bestMaxNum = currentMaxNum;
                    localStorage.setItem("super2048BestNum", bestMaxNum);
                }
            }

            Effect.showFloatScore(window.innerWidth/2, 200, add);
            AudioMgr.playMerge();

            res[i+1] = 0;
            if(res[i]===2048 && !winFlag){
                winFlag = true;
                setTimeout(()=>winModal.style.display="block",200);
            }
        }
    }
    res = res.filter(v=>v);
    while(res.length < col) res.push(0);
    return res;
}

function move(dir) {
    if(mode === "reverse"){
        if(dir === "down" || dir === "right") return;
    }

    let old = JSON.parse(JSON.stringify(board));

    if(dir === "left"){
        for(let i=0;i<row;i++) board[i] = moveLeft(board[i]);
    }
    if(dir === "right"){
        for(let i=0;i<row;i++) board[i] = moveLeft(board[i].reverse()).reverse();
    }
    if(dir === "up"){
        for(let j=0;j<col;j++){
            let colArr = [];
            for(let i=0;i<row;i++) colArr.push(board[i][j]);
            colArr = moveLeft(colArr);
            for(let i=0;i<row;i++) board[i][j] = colArr[i];
        }
    }
    if(dir === "down"){
        for(let j=0;j<col;j++){
            let colArr = [];
            for(let i=0;i<row;i++) colArr.push(board[i][j]);
            colArr = moveLeft(colArr.reverse()).reverse();
            for(let i=0;i<row;i++) board[i][j] = colArr[i];
        }
    }

    if(JSON.stringify(old) !== JSON.stringify(board)){
        step++;
        AudioMgr.playMove();
        
        if(mode === "step" && step >= 100){
            endMaxDom.innerText = currentMaxNum;
            overModal.style.display = "block";
        }
        saveHistory();
        randBlock();
        render();
        updateScore();
        checkGameOver();
    }
}

function updateScore() {
    nowScoreDom.innerText = nowScore;
    currentMaxDom.innerText = currentMaxNum;
    bestMaxDom.innerText = bestMaxNum;
    stepDom.innerText = step;
}

function checkGameOver() {
    for(let i=0;i<row;i++)
        for(let j=0;j<col;j++)
            if(board[i][j] === 0) return;

    for(let i=0;i<row;i++){
        for(let j=0;j<col;j++){
            let cur = board[i][j];
            if(cur === -1) continue;
            if(j<col-1 && cur===board[i][j+1]) return;
            if(i<row-1 && cur===board[i+1][j]) return;
        }
    }
    if(surviveTimer) clearInterval(surviveTimer);
    if(timer) clearInterval(timer);
    endMaxDom.innerText = currentMaxNum;
    overModal.style.display = "block";
}

document.addEventListener("keydown",e=>{
    switch(e.key.toLowerCase()){
        case "arrowleft":case "a": move("left");break;
        case "arrowright":case "d": move("right");break;
        case "arrowup":case "w": move("up");break;
        case "arrowdown":case "s": move("down");break;
    }
});

// 添加手机滑动支持
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, false);

document.addEventListener("touchend", e => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, false);

function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 50; // 最小滑动距离

    // 确保滑动距离足够大
    if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
        return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 水平滑动
        if (deltaX > 0) {
            move("right");
        } else {
            move("left");
        }
    } else {
        // 垂直滑动
        if (deltaY > 0) {
            move("down");
        } else {
            move("up");
        }
    }
}

document.getElementById("restart").onclick = initGame;
document.getElementById("undo").onclick = undoStep;
document.getElementById("goOn").onclick = ()=>winModal.style.display="none";
document.getElementById("gameEnd").onclick = ()=>{
    winModal.style.display="none";
    overModal.style.display="block";
    endMaxDom.innerText = currentMaxNum;
};
document.getElementById("resetBtn").onclick = initGame;

initGame();