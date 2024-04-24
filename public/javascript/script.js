let selectPrefecture = "";
let selectMountain = "";
let selectCourseInfo = [];
let hikesData = [];
let bpWeight = "";
let csResult = "";

let modal = document.querySelector('#modal');
let modalOverlay = document.querySelector('#modal-overlay');
let closeButton = document.querySelector('#close-button');

async function fetchPrefecturesData() {
    try {
        const response = await fetch('http://localhost:3000/api/prefectures');
        if (!response.ok) {
            throw new Error('Network response of prefectures was not ok');
        }
        const prefecturesData = await response.json();
        displayPrefecturesData(prefecturesData);
    } catch (error) {
        console.error('There has been a problem with your fetch operation of prefectures', error);
    }
}

async function fetchHikesData() {
    try {
        const response = await fetch('http://localhost:3000/api/hikes');
        if (!response.ok) {
            throw new Error('Network response of hikes was not ok');
        }
        hikesData = await response.json();
    } catch (error) {
        console.error('There has been a problem with your fetch operation of hikes', error);
    }
}

// 県名の選択
function displayPrefecturesData(prefecturesData) {
    console.log(prefecturesData);
    let select = document.createElement('select');
    const option = document.createElement('option');
    option.text = "選択してください";
    select.appendChild(option);
    select.id = 'prefectureSelect';
    for (let i = 0; i < prefecturesData.length; i++) {
        let option = document.createElement('option');
        option.value = prefecturesData[i].name;
        option.text = prefecturesData[i].name;
        select.appendChild(option);
    }
    document.getElementById('dropdown-prefectures').innerHTML = '';
    document.getElementById('dropdown-prefectures').appendChild(select);
    document.getElementById('prefectureSelect').addEventListener('change', function() {
        selectPrefecture = this.value;
        console.log(selectPrefecture);
        displayHikesData(hikesData);
        document.getElementById('courses').style.display = 'none';
        document.getElementById('hiking-days').style.display = 'none';
        document.getElementById('backpack-weight').style.display = 'none';
        document.getElementById('popup').style.display = 'none';
    });
}

// 山岳名の選択
function displayHikesData(hikesData) {
    console.log(hikesData);
    let matchedPrefecture = hikesData.filter(hike => selectPrefecture.includes(hike.prefectures));
    console.log(matchedPrefecture);
    let select = document.createElement('select');
    const option = document.createElement('option');
    option.text = "選択してください";
    select.appendChild(option);
    select.id = 'hikesSelect';
    for (let i = 0; i < matchedPrefecture.length; i++) {
        let option = document.createElement('option');
        option.text = matchedPrefecture[i].mountain;
        option.value = matchedPrefecture[i].mountain;
        select.appendChild(option);
    }
    document.getElementById('dropdown-mountains').innerHTML = '';
    document.getElementById('dropdown-mountains').appendChild(select);
    document.getElementById('mountains').style.display = 'block';
    document.getElementById('hikesSelect').addEventListener('change', function() {
        selectMountain = this.value;
        console.log(selectMountain);
        displayCoursesData(hikesData);
        document.getElementById('hiking-days').style.display = 'none';
        document.getElementById('backpack-weight').style.display = 'none';
        document.getElementById('courseInfoDisplay').style.display = 'none';
        document.getElementById('popup').style.display = 'none';
    });
}

// 県名の接尾辞を削除
function formatPrefectureName(prefectureName) {
    if (prefectureName === '北海道') {
        return prefectureName;
    } else {
        return prefectureName.replace(/(都|府|県)$/, '');
    }
}

// コース名の選択
function displayCoursesData(hikesData) {
    let formattedSelectPrefecture = formatPrefectureName(selectPrefecture);
    console.log(formattedSelectPrefecture);
    let matchedMountains = hikesData.filter(hike => hike.mountain === selectMountain && hike.prefectures === formattedSelectPrefecture);
    console.log(matchedMountains);
    let select = document.createElement('select');
    const option = document.createElement('option');
    option.text = "選択してください";
    select.appendChild(option);
    select.id = 'courseSelect';
    for (let i = 0; i < matchedMountains.length; i++) {
        let option = document.createElement('option');
        option.text = matchedMountains[i].course
        option.value = matchedMountains[i].course
        select.appendChild(option);
    }
    document.getElementById('dropdown-courses').innerHTML = '';
    document.getElementById('dropdown-courses').appendChild(select);
    document.getElementById('courses').style.display = 'block';
    document.getElementById('courseSelect').addEventListener('change', function () {
        let selectCourse = this.value;
        console.log(selectCourse);
        let selectCourseInfo = hikesData.filter(hike => hike.course === selectCourse)
        console.log(selectCourseInfo);
        calculateCourseScore(selectCourseInfo);
        document.getElementById('courseInfoDisplay').style.display = 'block';
        document.getElementById('popup').style.display = 'none';
    });
}

// 時間の変換
function convertTimeToHours(time) {
    let hour = parseInt(time.split(':')[0], 10);
    let minutes = parseInt(time.split(':')[1], 10);
    time = hour + (minutes / 60);
    time = Math.round(time * 1000) / 1000;
    return time;
}

// 距離の変換
function convertMeterToKm(m) {
    return m / 1000;
}

// コース定数の計算
function calculateCourseScore(information) {
    let courseInfoDisplay = document.getElementById('courseInfoDisplay');
    courseInfoDisplay.innerHTML = '';
    for (let i = 0; i < information.length; i++) {
        let info = information[i];
        console.log('山岳情報', info);
        console.log('タイム', info.duration);
        let durationHours = convertTimeToHours(info.duration);
        console.log(durationHours);
        let distanceKm = info.distance;
        console.log(distanceKm);
        let cumulativeUpKm = convertMeterToKm(info.cumulative_up);
        console.log(cumulativeUpKm);
        let cumulativeDownKm = convertMeterToKm(info.cumulative_down);
        console.log(cumulativeDownKm);
        let courseScore = (1.8 * durationHours) + (0.3 * distanceKm) + (10 * cumulativeUpKm) + (0.6 * cumulativeDownKm);
        csResult = Math.round((courseScore) * 1000) / 1000;
        console.log(`${info.course}のコーススコア：`, csResult);

        // コース情報を表示するための新しいdiv要素を作成
        let courseDiv = document.createElement('div');
        courseDiv.className = 'course-info';
        courseDiv.innerHTML = `
                               <h3>🕐 ${info.duration}</h3>
                               <h3>👣 ${info.distance}km</h3>
                               <h3>↗️ ${info.cumulative_up}m</h3>
                               <p>引用：<a href="${info.url}">株式会社ヤマップ (YAMAP INC.)</a></p>`;
        courseInfoDisplay.appendChild(courseDiv);
    }
    document.getElementById('hiking-days').style.display = 'block';
    selectBackpackWeight();
}

document.getElementById('hiking-days').addEventListener('change', function() {
    let selectedValue = document.querySelector('input[name="hiking-days"]:checked').value;

    if (selectedValue === 'option1') {
        document.getElementById('option-info').innerHTML = 'パッキングした状態のザックの重量を選択してください。<br>ザックの重量に関する一般的なガイドラインとして、日帰り登山の場合は体重の10%以下が理想的。';
    } else {
        document.getElementById('option-info').innerHTML = 'パッキングした状態のザックの重量を選択してください。<br>ザックの重量に関する一般的なガイドラインとして、1泊以上の長期登山の場合は体重の20%以下が理想的。';
    }
});

function selectBackpackWeight() {
    let select = document.createElement('select');
    const option = document.createElement('option');
    option.text = '選択してください'
    select.appendChild(option);
    select.id = 'bpWeightSelect';
    for (let i = 0; i < 50; i++) {
        let option = document.createElement('option');
        option.text = (i + 1) + 'kg';
        option.value = i + 1;
        select.appendChild(option);
    }
    document.getElementById('dropdown-backpack-weight').innerHTML = '';
    document.getElementById('dropdown-backpack-weight').appendChild(select);
    document.getElementById('backpack-weight').style.display = 'block';
    document.getElementById('bpWeightSelect').addEventListener('change', function() {
    let backPackweight = this.value;
    bpWeight = parseInt(backPackweight, 10);
    console.log(bpWeight);
    fetchUserWeight();
    });
}

async function fetchUserWeight() {
    try {
        const response = await fetch('http://localhost:3000/api/user-weight');
        if (!response.ok) {
            throw new Error('Failed to fetch user weight');
        }
        const data = await response.json();
        const weight = data.weight;
        console.log(weight);
        calculateWaterRequired(csResult, bpWeight, weight);
    } catch (error) {
        console.log(error.message);
    }
}


function calculateWaterRequired(score, backPackWeight, userWeight) {
    console.log(score, backPackWeight, userWeight);
    let ec = score * (backPackWeight + userWeight);
    console.log(ec);
    let waterRequired = Math.round(((ec / 1000) * 0.8) * 100) / 100;
    console.log(waterRequired);
    openModalWindow(waterRequired);
}

function openModalWindow(result) {
    document.getElementById('calculationResult').textContent = result + 'L';
    modal.classList.toggle("closed");
    modalOverlay.classList.toggle("closed");
}

function closeModalWindow() {
    modal.classList.toggle("closed");
    modalOverlay.classList.toggle("closed");
}

document.getElementById('close-button').addEventListener('click', function() {
    closeModalWindow()
})

window.addEventListener('DOMContentLoaded', (event) => {
    fetchPrefecturesData();
    fetchHikesData();
});



