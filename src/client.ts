type ApiResponse = {
  message: string;
  timestamp: string;
};

async function loadData() {
  const res = await fetch("/api/data");
  const data: ApiResponse = await res.json();

  const output = document.getElementById("output");
  if (output) {
    output.textContent = JSON.stringify(data, null, 2);
  }
}

loadData();
