function App() {
  return (
    <main className="page">
      <header>
        <p className="eyebrow">Eventudio Documentation</p>
        <h1>Docs App</h1>
        <p>
          Scaffolded docs portal for product guides, API references, runbooks,
          and onboarding playbooks.
        </p>
      </header>

      <section className="cards" aria-label="Scaffolded docs sections">
        <article>
          <h2>Platform Guides</h2>
          <p>Tenant setup, branding, and event publishing workflows.</p>
        </article>
        <article>
          <h2>API Reference</h2>
          <p>Endpoints, contracts, and integration examples.</p>
        </article>
        <article>
          <h2>Operations</h2>
          <p>Runbooks for incidents, deploys, and reliability checks.</p>
        </article>
      </section>
    </main>
  )
}

export default App
