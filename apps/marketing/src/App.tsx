function App() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Eventudio</p>
        <h1>Turn every live event into a branded digital destination.</h1>
        <p className="subtext">
          Launch polished event pages, power livestream operations, and keep teams
          aligned from planning to replay.
        </p>
        <div className="actions">
          <a href="#contact">Book a demo</a>
          <a href="/" className="secondary">
            Explore dashboard
          </a>
        </div>
      </section>

      <section className="grid" id="contact" aria-label="Value propositions">
        <article>
          <h2>For producers</h2>
          <p>Run multi-tenant events with reusable templates and publish controls.</p>
        </article>
        <article>
          <h2>For clients</h2>
          <p>Deliver a single page for stream access, schedules, and resources.</p>
        </article>
        <article>
          <h2>For teams</h2>
          <p>Connect marketing, production, and post-event replay in one system.</p>
        </article>
      </section>
    </main>
  )
}

export default App
