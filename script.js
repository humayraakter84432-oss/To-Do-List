   let tasks = [];
    let nextId = 1;
    let editingId = null;

    function render() {
      const list = document.getElementById('list');
      const count = document.getElementById('count');
      const total = tasks.length;
      const done = tasks.filter(t => t.done).length;

      count.textContent = total === 0 ? '' : done + ' of ' + total + ' completed';

      if (total === 0) {
        list.innerHTML = '<div class="empty">No tasks yet. Add one above!</div>';
        return;
      }

      list.innerHTML = tasks.map(t => {
        if (editingId === t.id) {
          return `<div class="todo-item">
            <input class="item-edit" id="edit-${t.id}" type="text" value="${escHtml(t.text)}"
              onkeydown="if(event.key==='Enter') saveEdit(${t.id}); if(event.key==='Escape') cancelEdit();" />
            <button class="txt-btn confirm" onclick="saveEdit(${t.id})">Save</button>
            <button class="txt-btn danger" onclick="cancelEdit()">Cancel</button>
          </div>`;
        }
        return `<div class="todo-item ${t.done ? 'done' : ''}">
          <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggle(${t.id})" />
          <span class="item-text">${escHtml(t.text)}</span>
          <button class="txt-btn" onclick="startEdit(${t.id})">Edit</button>
          <button class="txt-btn danger" onclick="deleteTask(${t.id})">Delete</button>
        </div>`;
      }).join('');

      if (editingId !== null) {
        const el = document.getElementById('edit-' + editingId);
        if (el) { el.focus(); el.select(); }
      }
    }

    function escHtml(s) {
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;')
              .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }
    function addTask() {
      const input = document.getElementById('newTask');
      const text = input.value.trim();
      if (!text) return;
      tasks.push({ id: nextId++, text, done: false });
      input.value = '';
      render();
    }
    function deleteTask(id) {
      tasks = tasks.filter(t => t.id !== id);
      if (editingId === id) editingId = null;
      render();
    }
    function toggle(id) {
      const t = tasks.find(t => t.id === id);
      if (t) t.done = !t.done;
      render();
    }
    function startEdit(id) { editingId = id; render(); }
    function saveEdit(id) {
      const input = document.getElementById('edit-' + id);
      const text = input ? input.value.trim() : '';
      if (!text) return;
      const t = tasks.find(t => t.id === id);
      if (t) t.text = text;
      editingId = null;
      render();
    }
    function cancelEdit() { editingId = null; render(); }

    render();