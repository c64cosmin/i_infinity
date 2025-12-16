"use strict";
async function loadData() {
    const res = await fetch("/api/data");
    const data = await res.json();
    const output = document.getElementById("output");
    if (output) {
        output.textContent = JSON.stringify(data, null, 2);
    }
}
loadData();
