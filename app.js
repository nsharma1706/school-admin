const serviceUrl = window.SCHOOL_SERVICE_URL || 'http://localhost:8000';
const list = document.querySelector('#students');
const status = document.querySelector('#status');

function render(students) {
  list.innerHTML = students.map((student) => `<tr><td>${student.name}</td><td>${student.email}</td><td>${student.course}</td><td>${student.phone}</td><td>${new Date(student.created_at).toLocaleString()}</td></tr>`).join('') || '<tr><td colspan="5">No students registered yet.</td></tr>';
}

async function load() {
  const response = await fetch(`${serviceUrl}/students`);
  render(await response.json());
}

function connect() {
  const socket = new WebSocket(serviceUrl.replace(/^http/, 'ws') + '/ws/students');
  socket.onopen = () => { status.textContent = 'Live updates connected'; };
  socket.onmessage = (event) => render(JSON.parse(event.data));
  socket.onclose = () => { status.textContent = 'Updates disconnected'; setTimeout(connect, 2000); };
}

load().catch(() => { status.textContent = 'Unable to load students'; });
connect();