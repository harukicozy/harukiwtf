const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

function show(name) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  panels.forEach(p => p.classList.toggle('active', p.id === name));
}

tabs.forEach(t => t.addEventListener('click', () => {
  show(t.dataset.tab);
  history.replaceState(null, '', '#' + t.dataset.tab);
}));

const initial = location.hash.slice(1);
if (document.getElementById(initial)) show(initial);
