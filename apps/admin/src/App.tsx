function App() {
  return (
    <main className="page">
      <header>
        <p className="eyebrow">Eventudio Control Plane</p>
        <h1>Admin Panel</h1>
        <p>
          Scaffolded app for multi-tenant administration, user management,
          brand governance, and operational controls.
        </p>
      </header>

      <section className="cards" aria-label="Scaffolded modules">
        <article>
          <h2>Tenant Management</h2>
          <p>Create, archive, and brand tenants.</p>
        </article>
        <article>
          <h2>Access Control</h2>
          <p>Manage admins, clients, and role permissions.</p>
        </article>
        <article>
          <h2>Operations</h2>
          <p>Monitor event status, API health, and release rollouts.</p>
        </article>
      </section>
    </main>
  )
}

export default App
