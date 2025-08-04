<script>
  // Contoh halaman yang dilindungi dengan route guard
  export let params = {};
</script>

<div class="protected-page">
  <h1>🔐 Protected Page</h1>
  <p>Selamat! Anda berhasil mengakses halaman yang dilindungi route guard.</p>
  <p>Params: {JSON.stringify(params)}</p>
  
  <div class="info">
    <h3>Route Guard Features:</h3>
    <ul>
      <li>✅ beforeEnter function executed</li>
      <li>✅ Navigation allowed</li>
      <li>✅ Component rendered</li>
    </ul>
  </div>
  
  <a href="/">← Kembali ke Home</a>
</div>

<style>
  .protected-page {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .info {
    background: #e8f5e8;
    padding: 15px;
    border-radius: 8px;
    margin: 20px 0;
  }
  
  .info ul {
    margin: 10px 0;
    padding-left: 20px;
  }
  
  a {
    color: #007acc;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
</style>
