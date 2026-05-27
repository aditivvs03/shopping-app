const API = 'http://localhost:3001/api/products';

async function loadProducts() {
  const tbody = document.getElementById('product-tbody');
  try {
    const res = await fetch(API);
    const products = await res.json();

    if (!products.length) {
      tbody.innerHTML = '<tr><td colspan="3">No products found.</td></tr>';
      return;
    }

    tbody.innerHTML = products.map(p => `
      <tr>
        <td>${esc(p.product_name)}</td>
        <td>${esc(p.product_description)}</td>
        <td>
          <button class="btn-edit" onclick="openEdit('${p._id}', '${escJ(p.product_name)}', '${escJ(p.product_description)}')">Edit</button>
          <button class="btn-delete" onclick="deleteProduct('${p._id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch {
    tbody.innerHTML = '<tr><td colspan="3" style="color:#f88;">Could not connect to server. Run: cd server && node index.js</td></tr>';
  }
}

async function addProduct() {
  const name = document.getElementById('add-name').value.trim();
  const desc = document.getElementById('add-desc').value.trim();
  if (!name || !desc) { showMsg('Fill both fields.'); return; }

  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_name: name, product_description: desc })
  });

  document.getElementById('add-name').value = '';
  document.getElementById('add-desc').value = '';
  showMsg('Product added!');
  loadProducts();
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  showMsg('Product deleted.');
  loadProducts();
}

function openEdit(id, name, desc) {
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-name').value = name;
  document.getElementById('edit-desc').value = desc;
  document.getElementById('editModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('editModal').style.display = 'none';
}

async function saveEdit() {
  const id   = document.getElementById('edit-id').value;
  const name = document.getElementById('edit-name').value.trim();
  const desc = document.getElementById('edit-desc').value.trim();
  if (!name || !desc) { showMsg('Fill both fields.'); return; }

  await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_name: name, product_description: desc })
  });

  closeModal();
  showMsg('Product updated!');
  loadProducts();
}

function showMsg(txt) {
  const el = document.getElementById('msg');
  el.textContent = txt;
  setTimeout(() => el.textContent = '', 3000);
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function escJ(s) {
  return String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
}

loadProducts();
