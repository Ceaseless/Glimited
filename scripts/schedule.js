const quests = ["古龍三昧", "烈種三昧", "超希少", "吹き荒ぶ新風", "始種三昧", "遠き地より"];
const questsEN = ["Elder Dragon Trio", "Burst Species Trio", "Rare Species", "MHFZ Newcomers", "Origin Trio", "Exotics"]
const monsters = [
    "Chameleos, Teostra, Kushala Daora",
    "Zerureusu, Meraginasu, Diorex, Garuba Daora, Varusaburosu",
    "Silver Hypnocatrice, Gold Rathian/Silver Rathalos, White Espinas",
    "Guanzorumu, Zenaserisu, Elzelion",
    "Gureadomosu, Yama Kurai, Toa Tesukatora, Voljang",
    "Stygian Zinogre, Gore Magala, Shagaru Magala"
];

const oneDay = (24 * 60 * 60 * 1000);
const markedQuestIndex = 2; // 超希少 = 2

// 超希少 was active at this JST time -> Calculate rotation from this
const referenceTimestamp = {
    quest: "超希少",
    unixTimestamp: 1783436400000,
    utcTimestamp: "2026-07-08T00:00:00+09:00"
};

function generateSchedule(days = 10) {
    const schedule = [];

    const startIndex = quests.indexOf(referenceTimestamp.quest);
    const referenceDate = new Date(referenceTimestamp.utcTimestamp);

    const todayTimestamp = Date.now();
    const diff = todayTimestamp - referenceTimestamp.unixTimestamp;

    for (let i = 1; i <= days; i++) {
        const activation = new Date(referenceDate);
        activation.setDate(activation.getDate() + Math.floor(diff / oneDay) + i);

        const questIndex = (startIndex + Math.floor(diff / oneDay) + i) % quests.length;

        schedule.push({
            questIndex: questIndex,
            activation: activation.toISOString()
        });
    }

    return schedule;
}

function getCurrentQuestIndex() {
    const now = new Date();

    const referenceDate = new Date(referenceTimestamp.utcTimestamp);
    const startIndex = quests.indexOf(referenceTimestamp.quest);

    let daysElapsed = Math.floor(
        (now - referenceDate) / oneDay
    );

    if (daysElapsed < 0) {
        daysElapsed = 0;
    }

    const index = (startIndex + daysElapsed) % quests.length;
    return index;
}

function formatDate(timestamp) {
    return new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric"
    }).format(new Date(timestamp));
}

function formatTime(timestamp) {
    return new Intl.DateTimeFormat(undefined, {
        timeStyle: "short"
    }).format(new Date(timestamp));
}

function renderSchedule() {
    const tbody = document.getElementById("schedule");

    const schedule = generateSchedule();

    schedule.forEach(entry => {
        const row = document.createElement("tr");
        if (entry.questIndex === markedQuestIndex) {
            row.setAttribute("class", "marked");
        }

        row.innerHTML = `
            <td>${formatDate(entry.activation)}</td>
            <td>${formatTime(entry.activation)}</td>
            <td>${quests[entry.questIndex]}</td>
        `;

        tbody.appendChild(row);
    });
}

// Probably could just pick the first one from the schedule list instead
function updateCurrentQuest() {
    const questIndex = getCurrentQuestIndex()
    const elem = document.getElementById("active-quest")
    if (questIndex === markedQuestIndex) {
        elem.setAttribute("class","rainbow-text")
    }    
    elem.innerHTML = `${quests[questIndex]}<br>(${monsters[questIndex]})`;
}

renderSchedule();
updateCurrentQuest();