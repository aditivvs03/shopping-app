const API = 'http://localhost:3001/api/products';

// ---- LOAD TABLE ----
async function loadProducts() {
  const tbody = document.getElementById('tableBody');
  try {
    const res = await fetch(API);
    const products = await res.json();
    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="loading">No products yet. Add one below!</td></tr>';
      return;
    }
    tbody.innerHTML = products.map((p, i) => `
      <tr id="row-${p.id}">
        <td>${i + 1}</td>
        <td><strong>${escHtml(p.product_name)}</strong></td>
        <td>${escHtml(p.product_description)}</td>
        <td>
          <button class="btn-edit" onclick="openEditModal(${p.id}, '${escJs(p.product_name)}', '${escJs(p.product_description)}')">Edit</button>
          <button class="btn-del" onclick="openDeleteModal(${p.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="4" class="loading">Could not connect to server. Make sure server is running.</td></tr>';
  }
}

// ---- EDIT ----
function openEditModal(id, name, desc) {
  document.getElementById('editId').value = id;
  document.getElementById('editName').value = name;
  document.getElementById('editDesc').value = desc;
  document.getElementById('editModal').classList.add('open');
}

async function saveEdit() {
  const id = document.getElementById('editId').value;
  const name = document.getElementById('editName').value.trim();
  const desc = document.getElementById('editDesc').value.trim();
  if (!name || !desc) { alert('Both fields are required.'); return; }
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_name: name, product_description: desc })
  });
  if (res.ok) { closeModal('editModal'); loadProducts(); }
  else { alert('Failed to update product.'); }
}

// ---- DELETE ----
function openDeleteModal(id) {
  document.getElementById('deleteId').value = id;
  document.getElementById('deleteModal').classList.add('open');
}

async function confirmDelete() {
  const id = document.getElementById('deleteId').value;
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  if (res.ok) { closeModal('deleteModal'); loadProducts(); }
  else { alert('Failed to delete product.'); }
}

// ---- ADD ----
function openAddModal() {
  document.getElementById('addName').value = '';
  document.getElementById('addDesc').value = '';
  document.getElementById('addModal').classList.add('open');
}

async function submitAdd() {
  const name = document.getElementById('addName').value.trim();
  const desc = document.getElementById('addDesc').value.trim();
  if (!name || !desc) { alert('Both fields are required.'); return; }
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_name: name, product_description: desc })
  });
  if (res.ok) { closeModal('addModal'); loadProducts(); }
  else { alert('Failed to add product.'); }
}

// ---- HELPERS ----
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escJs(str) {
  return str.replace(/'/g, "\\'").replace(/\n/g, ' ');
}

// Init
loadProducts();
