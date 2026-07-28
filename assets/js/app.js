/* ==========================================
   WARCOST.LIVE
   app.js v0.3
========================================== */

let currentAmount = 0;
let increasePerSecond = 0;
let lastUpdate = Date.now();

/* ==========================================
   ELEMENTS
========================================== */

const moneyCounter = document.getElementById("moneyCounter");
const warTimer = document.getElementById("warTimer");

const militarySpending = document.getElementById("militarySpending");
const personnelLosses = document.getElementById("personnelLosses");
const tankLosses = document.getElementById("tankLosses");
const aircraftLosses = document.getElementById("aircraftLosses");
const missileLosses = document.getElementById("missileLosses");

/* ==========================================
   HELPERS
========================================== */

function formatMoney(value) {
    return value.toLocaleString("en-US", {
        maximumFractionDigits: 0
    });
}

/* ==========================================
   LIVE COUNTER
========================================== */
function updateCounter() {

    const now = Date.now();
    const elapsed = (now - lastUpdate) / 1000;

    currentAmount += elapsed * increasePerSecond;

    const formatted =
        "$" + formatMoney(currentAmount);

    moneyCounter.textContent = formatted;

    militarySpending.textContent = formatted;

    lastUpdate = now;

}

/* ==========================================
   WAR DURATION
========================================== */

function updateWarDuration(warStartDate) {

    const diff = Date.now() - warStartDate.getTime();

    const days = Math.floor(diff / 86400000);

    warTimer.textContent =
        days.toLocaleString("en-US") + " Days";

}

/* ==========================================
   LOAD DATA
========================================== */

async function loadStats() {

    try {

        const response =
            await fetch("assets/data/stats.json");

        if (!response.ok) {
            throw new Error("Cannot load stats.json");
        }

        const stats =
            await response.json();

        /* ---------- Counter ---------- */

        currentAmount =
            stats.militarySpending.value;

        increasePerSecond =
            stats.militarySpending.perSecond;

        /* ---------- Cards ---------- */

        militarySpending.textContent =
            "$" + formatMoney(stats.militarySpending.value);

        personnelLosses.textContent =
            stats.personnelLosses.value;

        tankLosses.textContent =
            stats.tankLosses.value;

        aircraftLosses.textContent =
            stats.aircraftLosses.value;

        missileLosses.textContent =
            stats.missileLosses.value;

        /* ---------- War Timer ---------- */

        const warStartDate =
            new Date(stats.warStart);

        updateWarDuration(warStartDate);

        updateCounter();

        setInterval(updateCounter, 100);

        setInterval(() => {

            updateWarDuration(warStartDate);

        }, 60000);

        console.log("WarCost.Live data loaded.");

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================
   START
========================================== */

loadStats();