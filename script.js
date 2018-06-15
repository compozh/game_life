// Обработчик нажатия на кнопку отправки формы с параметрами таблицы
var radioAuto = document.getElementById('auto');

var form = document.forms['tableparams'];
form.addEventListener('submit', onSubmit);

var interval = document.getElementById('interval');

var range = document.getElementById('int');
range.addEventListener('change', function () {
    interval.value = this.value;
});

var survive1 = document.getElementById('survive1');
var survive2 = document.getElementById('survive2');
var newBorn = document.getElementById('new');

var startButton = document.getElementById('start');
var stopButton = document.getElementById('stop');

var timer = 0;

stopButton.onclick = function () {
    startButton.disabled = false;
    stopButton.disabled = true;
    clearInterval(timer);
};

startButton.onclick = function () {
    startButton.disabled = true;
    stopButton.disabled = false;

    timer = setInterval(loop, interval.value);
};

// Чтение кол-ва строк и столбцов из полей ввода
function onSubmit (event) {
    var form = event.target;
    var rowcount = form['rowcount'].value;
    var colcount = form['colcount'].value;
    generateTable (rowcount, colcount, 'grid');
    event.preventDefault();
}
// Генерация таблицы согласно заданных параметров
function generateTable(rowCount, colCount, id) {
    var elem = document.getElementById(id);
    elem.innerHTML = ''; // удаление старой таблицы перед созданием новой
    // Обнуление счетчиков
    breedCount = 0;
    bornCount = 0;
    deathCount = 0;

    var tableTag = document.createElement('table');

    for (var i = 0; i < rowCount; i++) {
        var trTag = document.createElement('tr');

        for (var j = 0; j < colCount; j++) {
            var tdTag = document.createElement('td');
            if (radioAuto.checked) {
                tdTag.innerHTML = rand(1);
            } else {
                tdTag.addEventListener('click', function () {
                    this.innerHTML = 1;
                    this.classList.add('life');
                })
            }
            condition(tdTag);
            trTag.appendChild(tdTag);
        }
        tableTag.appendChild(trTag);
    }
    elem.appendChild(tableTag);
}

var sibCount = 0;
var cellStatus = 0;
var breedCount = 0;
var bornCount = 0;
var deathCount = 0;
var n, nw, w, sw, s, se, e, ne = 0;
var table = 0;

function loop () {
    table = document.querySelector('table');
    function cell(row, col) {
        return table.rows[row].cells[col].textContent;
    } // Возвращает содержимое ячейки по координатам
    function lastRow() {
        return table.rows.length - 1;
    } // Возвращает последнюю строку
    function lastCol(i) {
        return table.rows[i].cells.length - 1;
    } // Возвращает последнюю колонку по номеру строки
    for (var i = 0; i <= lastRow(); i++) {
        for (var j = 0; j <= lastCol(i); j++) {
            // Подсчет соседей
            // 1.Правило для соседа на "севере" - n
            if (i === 0) { // Исключение только если это верхняя строка, тогда сосед на "севере", будет на "дне"
                n = cell(lastRow(), j);
            } else { // В остальных случаях сосед на "севере", будет "этажем" выше
                n = cell(i - 1, j);
            }
            // 2.Правило для соседа на "северо-западе" - nw
            if (i === 0 && j !== lastCol(i)) { // 1.Исключение - если это верхняя строка, но не правый верхний угол, то сосед на "северо-западе", будет на "дне" правее
                nw = cell(lastRow(), j + 1);
            } else if (j === lastCol(i) && i !== 0) { // 2.Исключение - если это правая крайняя колонка, но не правый верхний угол, то сосед на "северо-западе", будет слева выше
                nw = cell(i - 1, 0);
            } else if (i === 0 && j === lastCol(i)) { // 3.Исключение - если это правый верхний угол, то сосед на "северо-западе", будет на "дне" слева
                nw = cell(lastRow(), 0);
            } else { // В остальных случаях сосед на "северо-западе", будет "этажем" выше и правее
                nw = cell(i - 1, j + 1);
            }
            // 3.Правило для соседа на "западе" - w
            if (j === lastCol(i)) { // Исключение только если это правая крайняя колонка, тогда сосед на "западе", будет скраю слева
                w = cell(i, 0);
            } else { // В остальных случаях сосед на "западе", будет правее
                w = cell(i, j + 1);
            }
            // 4.Правило для соседа на "юго-западе" - sw
            if (j === lastCol(i) && i !== lastRow()) { // 1.Исключение - если это правая крайняя колонка, но не правый нижний угол, то сосед на "юго-западе", будет скраю слева ниже
                sw = cell(i + 1, 0);
            } else if (i === lastRow() && j !== lastCol(i)) { // 2.Исключение - если это нижняя строка, но не правый нижний угол, то сосед на "юго-западе", будет вверху правее
                sw = cell(0, j + 1);
            } else if (i === lastRow() && j === lastCol(i)) { // 3.Исключение - если это правый нижний угол, то сосед на "юго-западе", будет в верхнем левом углу
                sw = cell(0, 0);
            } else { // В остальных случаях сосед на "юго-западе", будет "этажем" ниже и правее
                sw = cell(i + 1, j + 1);
            }
            // 5.Правило для соседа на "юге" - s
            if (i === lastRow()) { // Исключение только если это нижняя строка, тогда сосед на "юге", будет вверху
                s = cell(0, j);
            } else { // В остальных случаях сосед на "севере", будет "этажем" выше
                s = cell(i + 1, j);
            }
            // 6.Правило для соседа на "юго-востоке" - se
            if (i === lastRow() && j !== 0) { // 1.Исключение - если это нижняя строка, но не левый нижний угол, то сосед на "юго-востоке", будет вверху левее
                se = cell(0, j - 1);
            } else if (j === 0 && i !== lastRow()) { // 2.Исключение - если это первый столбец, но не левый нижний угол, то сосед на "юго-востоке", будет в последней колонке ниже
                se = cell(i + 1, lastCol(i));
            } else if (i === lastRow() && j === 0) { // 3.Исключение - если это левый нижний угол, то сосед на "юго-востоке", будет вверхнем правом углу
                se = cell(0, lastCol(i));
            } else { // В остальных случаях сосед на "юго-востоке", будет "этажем" ниже и левее
                se = cell(i + 1, j - 1);
            }
            // 7.Правило для соседа на "востоке" - e
            if (j === 0) { // Исключение только если это первая колонка, тогда сосед на "востоке", будет в последней колонке
                e = cell(i, lastCol(i));
            } else { // В остальных случаях сосед на "востоке", будет левее
                e = cell(i, j - 1);
            }
            // 8.Правило для соседа на "северо-востоке" - nе
            if (j === 0 && i !== 0) { // 1.Исключение - если это первая колонка, но не правый верхний угол, то сосед на "северо-востоке", будет в последней колонке выше
                ne = cell(i - 1, lastCol(i));
            } else if (i === 0 && j !== 0) { // 2.Исключение - если это первая строка, но не правый верхний угол, то сосед на "северо-востоке", будет внизу левее
                ne = cell(lastRow(), j - 1);
            } else if (i === 0 && j === 0) { // 3.Исключение - если это правый верхний угол, то сосед на "северо-востоке", будет в нижнем правом углу
                ne = cell(lastRow(), lastCol(i));
            } else { // В остальных случаях сосед на "северо-востоке", будет "этажем" выше и левее
                ne = cell(i - 1, j - 1);
            }
            // Преобразование пометок в числа для корректного подсчета
            if (n == '+') n = 0;
            if (nw == '+') nw = 0;
            if (w == '+') w = 0;
            if (sw == '+') sw = 0;
            if (s == '+') s = 0;
            if (se == '+') se = 0;
            if (e == '+') e = 0;
            if (ne == '+') ne = 0;
            if (n == '-') n = 1;
            if (nw == '-') nw = 1;
            if (w == '-') w = 1;
            if (sw == '-') sw = 1;
            if (s == '-') s = 1;
            if (se == '-') se = 1;
            if (e == '-') e = 1;
            if (ne == '-') ne = 1;
            // Суммирование соседей и определиние нового состояния
            sibCount = (+n + +nw + +w + +sw + +s + +se + +e + +ne);
            // Определение текущего состояния ячейки
            cellStatus = cell(i, j);
            // Если место не занято, но имеется оптимальное колво соседей - рождается, иначе остается пустым
            if (cellStatus == 0 && sibCount == newBorn.value) {
                table.rows[i].cells[j].textContent = '+';
                clearClass(table.rows[i].cells[j]);
                if (document.getElementById('borned').checked) table.rows[i].cells[j].classList.add('born');
            }
            // Если ныне живущий не имеет оптимальное колво соседей - умирает, иначе остается жить
            if (cellStatus == 1 && sibCount != survive1.value && sibCount != survive2.value) {
                table.rows[i].cells[j].textContent = '-';
                clearClass(table.rows[i].cells[j]);
                if (document.getElementById('dead').checked) table.rows[i].cells[j].classList.add('death');
            }
        }
    }
    setTimeout(function () {
        for (var i = 0; i <= lastRow(); i++) {
            for (var j = 0; j <= lastCol(i); j++) {
                // Определение текущего состояния ячейки
                cellStatus = cell(i, j);
                // Подсчет претендентов на жизнь
                if (cellStatus == '+') {
                    table.rows[i].cells[j].textContent = 1;
                    clearClass(table.rows[i].cells[j]);
                    table.rows[i].cells[j].classList.add('life');
                    bornCount++; // Подсчет рождений
                }
                // Подсчет претендентов на смерть
                if (cellStatus == '-') {
                    table.rows[i].cells[j].textContent = 0;
                    clearClass(table.rows[i].cells[j]);
                    table.rows[i].cells[j].classList.add('empty');
                    deathCount++; // Подсчет смертей
                }
            }
        }
    }, 150);
    // Вывод статистики
    document.getElementById('breed').textContent = breedCount++;
    document.getElementById('fall').textContent = deathCount;
    document.getElementById('born').textContent = bornCount;
    document.getElementById('stat').textContent = Math.round(bornCount / deathCount * 1000) / 10 + '%';
}

// Генерация случайных целых чисел от 0 до заданного максимума (включительно)
function rand (max) {
    return Math.floor(Math.random() * (max + 1));
}
// "Расскрашивание ячеек" (присвоение класса соответсвующего значению)
function condition (targ) {
    var cell = targ.innerHTML;
    var clas = function (slyle) {
        targ.classList.add(slyle);
    };
    if (cell == 3) {
        clas('born');
    } else if (cell == 2) {
        clas('death');
    } else if (cell == 1) {
        clas('life');
    } else {
        clas('empty');
    }
}
// Очиска классов
function clearClass (tar) {
    tar.classList.remove('death');
    tar.classList.remove('life');
    tar.classList.remove('born');
    tar.classList.remove('empty');
}