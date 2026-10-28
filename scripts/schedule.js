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

// questIndex = floor((timestamp + 0x7e90) / 0x15180) % 6 (Function: +0x405b30)
// Quest order is the same as ferias' list

const DAY_SECONDS = 24 * 60 * 60;
const JST_OFFSET_SECONDS = 9 * 60 * 60;
const MARKED_QUEST_INDEX = 2; // 超希少 = 2

// Date.now() is in milliseconds
function getJstDayNumber(nowMs) {
    return Math.floor((nowMs / 1000 + JST_OFFSET_SECONDS) / DAY_SECONDS);
}

function generateSchedule(days = 10, nowMs = Date.now()) {
    const today = getJstDayNumber(nowMs);
    const schedule = [];

    for (let i = 1; i <= days; i++) {
        const day = today + i;

        schedule.push({
            questIndex: day % quests.length,
            // Back to milliseconds
            activation: new Date((day * DAY_SECONDS - JST_OFFSET_SECONDS) * 1000).toISOString()
        });

    }
    return schedule;
}

function getCurrentQuestIndex(nowMs = Date.now()) {
    return getJstDayNumber(nowMs) % quests.length;
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
        if (entry.questIndex === MARKED_QUEST_INDEX) {
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
    if (questIndex === MARKED_QUEST_INDEX) {
        elem.setAttribute("class", "marked")
    }
    elem.innerHTML = `${quests[questIndex]}<br>(${monsters[questIndex]})`;
}

renderSchedule();
updateCurrentQuest();