const gameContainer = document.querySelector(".container");
const beginBtn = document.querySelector(".game-start");



// 获取拼图表格及表格行列数
const table = document.querySelector('.image-frame');
const size = table.children[0].children.length;

// 初始化拼图矩阵（将原有html元素存到二维数组中方便操作）
const table_matrix = [];

// 初始化坐标矩阵（记录每个图片的位置）
const table_index = [];

// 记录当前动画是否正在进行
let animationInProgress = false;

// 延迟初始化
let X, Y;
// 初始化游戏状态
let gameState = false;

// 初始化移动次数
let moveCountText = document.querySelector(".move-count span");
let moveCount = 0;
// 获取游戏进程计时器文本元素
let timerText = document.querySelector(".timer span");
const arrowArr = document.querySelectorAll('.iconfont');


const wholtImageSrc = "image/dog_images/dog_materials_1/狗素材1（all）.jpg"

const wholeImage = document.createElement('img');
wholeImage.src = wholtImageSrc;

// 初始化颜色计时器id
let intervalId = null;
// 初始化游戏计时器id
let gameTimerId = null;
// 主题切换
document.querySelector('.theme-picker').addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
        // 移除现有主题类
        document.body.className = '';
        if (e.target.dataset.color === 'mix-change') {
            // 清除之前的定时器
            clearInterval(intervalId);
            intervalId = setInterval(() => {
                const colorRadStr = getRandomColor(false);
                document.body.style.backgroundColor = colorRadStr;
            }, 1000);
        }
        else {
            // 添加新主题类
            clearInterval(intervalId);
            document.body.style.backgroundColor = '';
            document.body.classList.add(`theme-${e.target.dataset.color}`);
        }
    }
});

// 给按钮添加事件
beginBtn.addEventListener("click", gameInit);




document.body.addEventListener('keyup', (e) => {
    if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        wholeImage.style.display = 'none';
    }
    else if (e.key === 'r' || e.key === 'R') {
        gameState = false;
        shufleImageNum();
        moveCount = 0;
        moveCountText.textContent = moveCount;
        timerText.textContent = 0;
        initTimer();
    }
    else if (e.key === 'w' || e.key === 'ArrowUp') {
        arrowArr[0].classList.remove('change');
    }
    else if (e.key === 's' || e.key === 'ArrowDown') {
        arrowArr[1].classList.remove('change');
    }
    else if (e.key === 'a' || e.key === 'ArrowLeft') {
        arrowArr[2].classList.remove('change');
    }
    else if (e.key === 'd' || e.key === 'ArrowRight') {
        arrowArr[3].classList.remove('change');
    }
})

// 绑定按键事件
document.body.addEventListener('keydown', keyBoardListen);

// 获取随机颜色（true：rgb格式字符串，false：16进制格式字符串
function getRandomColor(flag) {

    if (flag) {
        let arr = [];
        let dic = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
        for (let i = 0; i < 6; i++) {
            arr[i] = dic[Math.floor(Math.random() * dic.length)];
        }
        return '#' + arr.join('');
    }
    else {
        let arr = [];
        arr[0] = getRandomBetween(150, 220);
        arr[1] = getRandomBetween(150, 200);
        arr[2] = getRandomBetween(180, 220);
        return `rgb(${arr[0]},${arr[1]},${arr[2]})`
    }
}


// 键盘事件监听
function keyBoardListen(e) {

    // 检查游戏是否已初始化
    if (animationInProgress || table_matrix.length === 0 || table_index.length === 0) {
        return;
    }
    e.preventDefault();

    if (e.ctrlKey && e.key === 'a') {
        wholeImage.style.display = 'block';

    }
    else if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
        oneKeyVictory();

    }
    else if (e.key === 'w' || e.key === 'ArrowUp') {

        const ey = Y + 1;
        arrowArr[0].classList.add('change');
        if (ey < size) {
            imgTopOrBottomMove(ey);

        }
    }
    else if (e.key === 's' || e.key === 'ArrowDown') {
        const ey = Y - 1;
        arrowArr[1].classList.add('change');
        if (ey >= 0) {
            imgTopOrBottomMove(ey);
        }
    }
    else if (e.key === 'a' || e.key === 'ArrowLeft') {
        const ex = X + 1;
        if (ex < size) {
            imgLeftOrRigthMove(ex);
        }
        arrowArr[2].classList.add('change');
    }
    else if (e.key === 'd' || e.key === 'ArrowRight') {
        const ex = X - 1;
        arrowArr[3].classList.add('change');
        if (ex >= 0) {
            imgLeftOrRigthMove(ex);
        }
    }

    if (gameState) {
        setTimeout(() => {
            alert('恭喜你，游戏成功！');
            clearInterval(gameTimerId);
        }, 10);
    }

}

// 一键胜利
function oneKeyVictory() {

    const rightIndexArr = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16]
    ]

    const path = "https://cdn.jsdelivr.net/gh/lyyy-1728/my_puzzle_game@main/image/dog_images/dog_materials_1/狗素材1_";
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            table_matrix[i][j].children[0].src = path + rightIndexArr[i][j] + ".jpg";
        }
    }
    table_matrix[Y][X].children[0].style.visibility = "visible";
    gameState = true;
    document.body.removeEventListener('keydown', keyBoardListen);
}

// 游戏初始化
function gameInit() {
    gameContainer.style.display = "block";

    for (let i = 0; i < size; i++) {
        const tr = document.querySelector(`table tr:nth-child(${i + 1})`);
        table_matrix.push(Array.from(tr.children));

    }

    // 随机生成空白位置坐标
    X = getRandomInt(size);
    Y = getRandomInt(size);
    table_matrix[Y][X].children[0].style.visibility = "hidden";

    // 随机打乱图片
    shufleImageNum();

    // 等待DOM渲染完成后获取图片位置
    setTimeout(() => {
        initTableIndex();
        console.log("表格坐标初始化完成:", table_index);

        // 取消所有图片的默认行为
        disableImageDefaultBehavior();


        const rect = table.getBoundingClientRect();
        // 存储完整位置信息
        const position = {
            top: Math.round(rect.top),
            left: Math.round(rect.left),
            width: Math.round(rect.width),
            height: Math.round(rect.height)
        };
        document.body.appendChild(wholeImage);
        // 为临时图片设置初始位置
        Object.assign(wholeImage.style, {
            position: 'absolute',
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: `${position.width}px`,
            display: 'none',
            zIndex: 1000
        })
    }, 10);

    initMouseControl();

    initTimer();

    const prompt = document.querySelector(".hint");
    prompt.style.display = 'block';


}

// 初始化计时器
function initTimer() {
    // 初始化计时器
    clearInterval(gameTimerId);
    const count = Date.now();
    gameTimerId = setInterval(() => {
        timerText.innerHTML = Math.floor((Date.now() - count) / 1000);
    }, 500)
}

// 取消所有图片的默认行为
function disableImageDefaultBehavior() {
    // 获取所有图片元素
    const allImages = document.querySelectorAll('img');

    // 为每个图片添加事件监听器以阻止默认行为
    allImages.forEach(img => {
        // 阻止右键菜单
        img.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // 阻止拖动行为
        img.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });

        // 阻止选择行为
        img.addEventListener('selectstart', (e) => {
            e.preventDefault();
        });

        // 阻止双击放大（某些浏览器可能支持）
        img.addEventListener('dblclick', (e) => {
            e.preventDefault();
        });
    });

    // 另外，也可以为整个游戏容器添加全局的默认行为阻止
    const gameContainer = document.querySelector('.game-container');
    const gameHint = document.querySelector('.hint');
    if (gameContainer) {
        // 阻止容器内的文本选择
        gameContainer.style.userSelect = 'none';
        gameContainer.style.webkitUserSelect = 'none';
        gameContainer.style.mozUserSelect = 'none';
        gameContainer.style.msUserSelect = 'none';
        // 阻止提示区域的文本选择
        gameHint.style.userSelect = 'none';
        gameHint.style.webkitUserSelect = 'none';
        gameHint.style.mozUserSelect = 'none';
        gameHint.style.msUserSelect = 'none';
        // 阻止右键菜单
        gameContainer.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        // 阻止提示区域的右键菜单
        gameHint.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
}

// 初始化鼠标控制功能
function initMouseControl() {
    let isMouseDown = false;
    let startX, startY;
    const sensitivity = 20; // 鼠标滑动灵敏度阈值

    // 为拼图表格添加鼠标按下事件
    table.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        startX = e.clientX;
        startY = e.clientY;
        e.preventDefault(); // 防止默认行为
    });

    // 为整个文档添加鼠标移动事件
    document.addEventListener('mousemove', (e) => {
        if (!isMouseDown || animationInProgress || gameState) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // 检测水平滑动（左右）
        if (Math.abs(deltaX) > sensitivity && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                // 向右滑动
                const ex = X - 1;
                if (ex >= 0) {
                    imgLeftOrRigthMove(ex);
                    isMouseDown = false; // 防止连续触发
                }
            } else {
                // 向左滑动
                const ex = X + 1;
                if (ex < size) {
                    imgLeftOrRigthMove(ex);
                    isMouseDown = false; // 防止连续触发
                }
            }
        }
        // 检测垂直滑动（上下）
        else if (Math.abs(deltaY) > sensitivity) {
            if (deltaY > 0) {
                // 向下滑动
                const ey = Y - 1;
                if (ey >= 0) {
                    imgTopOrBottomMove(ey);
                    isMouseDown = false; // 防止连续触发
                }
            } else {
                // 向上滑动
                const ey = Y + 1;
                if (ey < size) {
                    imgTopOrBottomMove(ey);
                    isMouseDown = false; // 防止连续触发
                }
            }
        }
    });

    // 为整个文档添加鼠标松开事件
    document.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    // 为整个文档添加鼠标离开事件
    document.addEventListener('mouseleave', () => {
        isMouseDown = false;
    });
}

// 初始化图片位置坐标
function initTableIndex() {
    // 清空之前的坐标数据
    table_index.length = 0;

    for (let i = 0; i < size; i++) {
        const tempArr = [];
        for (let j = 0; j < size; j++) {
            // 获取图片元素并确认是img标签
            const tdElement = table_matrix[i][j];
            const imgElement = tdElement.querySelector('img');

            if (imgElement) {
                // 先检查元素是否在视口中
                if (imgElement.offsetParent !== null) {
                    // 使用 getBoundingClientRect() 获取准确位置
                    const rect = imgElement.getBoundingClientRect();
                    // 存储完整位置信息
                    const position = {
                        top: Math.round(rect.top),
                        left: Math.round(rect.left),
                        width: Math.round(rect.width),
                        height: Math.round(rect.height)
                    };
                    tempArr.push(position);
                    console.log(`图片[${i},${j}]位置:`, position);
                } else {
                    console.warn(`图片[${i},${j}]不在视口中，无法获取坐标`);
                    tempArr.push({ top: 0, left: 0, width: 0, height: 0 });
                }
            } else {
                console.warn(`图片[${i},${j}]不存在`);
                tempArr.push({ top: 0, left: 0, width: 0, height: 0 });
            }
        }
        table_index.push(tempArr);
    }
}


// 图片左右移动
function imgLeftOrRigthMove(ex) {

    // 确保坐标数据已初始化
    if (table_index.length === 0 || table_index[Y] === undefined ||
        table_index[Y][ex] === undefined || table_index[Y][X] === undefined) {
        console.error("坐标数据未初始化或无效");
        return;
    }



    // 设置动画锁为true
    animationInProgress = true;


    // 创建临时图片，赋予移动起始图片路径，并添加到body中
    const tempImage = document.createElement('img');
    tempImage.src = table_matrix[Y][ex].children[0].src;
    document.body.appendChild(tempImage);

    // 为临时图片设置初始位置和过渡属性
    Object.assign(tempImage.style, {
        position: 'absolute',
        top: `${table_index[Y][ex].top}px`,
        left: `${table_index[Y][ex].left}px`,
        width: `${table_index[Y][ex].width}px`,
        height: `${table_index[Y][ex].height}px`,
        transition: 'all 80ms ease-out'
    })

    // 交换位置
    let temp = table_matrix[Y][X].children[0].src;
    table_matrix[Y][X].children[0].src = table_matrix[Y][ex].children[0].src;
    table_matrix[Y][ex].children[0].src = temp;

    // 延时确定移动位置，并隐藏移动起始图片
    setTimeout(() => {
        tempImage.style.top = `${table_index[Y][X].top}px`;
        tempImage.style.left = `${table_index[Y][X].left}px`;
        table_matrix[Y][ex].children[0].style.visibility = "hidden";
    }, 0)



    // 监听过渡结束事件
    tempImage.addEventListener('transitionend', () => {

        // 移除临时图片
        tempImage.remove();
        table_matrix[Y][X].children[0].style.visibility = "visible";
        X = ex;
    });

    // 添加超时兜底，防止transitionend事件不触发导致锁一直不释放
    setTimeout(() => {
        if (animationInProgress) {
            animationInProgress = false;
        }
    }, 100);
    moveCountText.innerHTML = ++moveCount;
}

// 图片上下移动
function imgTopOrBottomMove(ey) {

    // 确保坐标数据已初始化
    if (table_index.length === 0 || table_index[ey] === undefined ||
        table_index[ey][X] === undefined || table_index[Y][X] === undefined) {
        console.error("坐标数据未初始化或无效");
        return;
    }


    // 设置动画锁为true
    animationInProgress = true;


    // 创建临时图片，赋予移动起始图片路径，并添加到body中
    const tempImage = document.createElement('img');
    tempImage.src = table_matrix[ey][X].children[0].src;
    document.body.appendChild(tempImage);
    // 为临时图片设置初始位置和过渡属性
    Object.assign(tempImage.style, {
        position: 'absolute',
        top: `${table_index[ey][X].top}px`,
        left: `${table_index[ey][X].left}px`,
        width: `${table_index[ey][X].width}px`,
        height: `${table_index[ey][X].height}px`,
        transition: 'all 80ms ease-out'
    })

    // 交换位置
    let temp = table_matrix[Y][X].children[0].src;
    table_matrix[Y][X].children[0].src = table_matrix[ey][X].children[0].src;
    table_matrix[ey][X].children[0].src = temp;

    // 延时确定移动位置，并隐藏移动起始图片
    setTimeout(() => {
        tempImage.style.top = `${table_index[Y][X].top}px`;
        tempImage.style.left = `${table_index[Y][X].left}px`;
        table_matrix[ey][X].children[0].style.visibility = "hidden";
    }, 0)



    // 监听过渡结束事件
    tempImage.addEventListener('transitionend', () => {

        // 移除临时图片
        tempImage.remove();
        table_matrix[Y][X].children[0].style.visibility = "visible";
        Y = ey;
    });

    // 添加超时兜底，防止transitionend事件不触发导致锁一直不释放
    setTimeout(() => {
        if (animationInProgress) {
            animationInProgress = false;
        }
    }, 100);
    moveCountText.innerHTML = ++moveCount;
}

// 打乱图片
function shufleImageNum() {
    const randomArr = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16]
    ]
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const x = getRandomInt(size);
            const y = getRandomInt(size);
            const temp = randomArr[i][j];
            randomArr[i][j] = randomArr[x][y];
            randomArr[x][y] = temp;
        }
    }
    const path = "image/dog_images/dog_materials_1/狗素材1_";
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            table_matrix[i][j].children[0].src = path + randomArr[i][j] + ".jpg";
        }
    }
}

// 获取从0到max - 1的随机整数
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// 获取从min到max的随机整数
function getRandomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}