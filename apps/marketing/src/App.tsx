const problems = [
  'Describe a significant problem your ideal customer profile has.',
  'Explain how this problem impacts their goals or daily operations.',
  'Show the cost of leaving this workflow unresolved.'
]

const faq = [
  {
    question: 'What does this product do?',
    answer:
      'This is a demo application built with Achromatic. It helps teams ship a SaaS marketing site quickly.'
  },
  {
    question: 'How will this benefit my business?',
    answer:
      'By centralizing customer data and automation workflows, teams can move faster with better visibility.'
  },
  {
    question: 'Is my data safe?',
    answer:
      'Security is handled with modern infrastructure and access controls, with encryption in transit and at rest.'
  },
  {
    question: 'What kind of integrations are available?',
    answer:
      'The template is built to integrate with CRM, analytics, and communication tools.'
  }
]

const testimonials = [
  {
    name: 'David Zhang',
    role: 'VP of Sales at GlobalTech Solutions',
    quote:
      'Our team efficiency has improved dramatically since implementation.'
  },
  {
    name: 'Maria Rodriguez',
    role: 'Customer Success Director at Cloud Dynamics',
    quote: 'We have seen a major increase in conversion rates.'
  },
  {
    name: 'James Wilson',
    role: 'Head of Business Development at Velocity Inc',
    quote: 'Essential tool for any growing business.'
  }
]

function App() {
  return (
    <main className="page" id="top">
      <section className="hero">
        <p className="eyebrow">New!</p>
        <h1>Your revolutionary Next.js SaaS</h1>
        <p className="subtext">
          This is a demo application built with Achromatic. It will save you time
          and effort building your next SaaS.
        </p>
        <div className="actions">
          <a href="#cta">Start for free</a>
          <a href="#faq" className="secondary">
            Talk to sales
          </a>
        </div>
      </section>

      <section className="logos" aria-label="Trusted by fast-growing companies">
        <p>Trusted by fast-growing companies around the world</p>
        <ul>
          <li>Vercel</li>
          <li>Deel</li>
          <li>Resend</li>
          <li>Notion</li>
        </ul>
      </section>

      <section className="section">
        <h2>Attention Grabbing Title</h2>
        <div className="grid">
          {problems.map((problem) => (
            <article key={problem}>
              <h3>Problem</h3>
              <p>{problem}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>The next-gen SaaS</h2>
        <p className="subtext">
          The engine that builds, scales and grows your company to the next level.
        </p>
        <ul className="feature-list">
          <li>AI-driven insights</li>
          <li>Smart automation</li>
          <li>Adaptive workflows</li>
          <li>Predictive analytics</li>
          <li>Natural language processing</li>
          <li>Auto task prioritization</li>
        </ul>
      </section>

      <section className="stats" aria-label="Stats">
        <article>
          <strong>55%</strong>
          <p>Increased conversion</p>
        </article>
        <article>
          <strong>4x</strong>
          <p>Improved retention</p>
        </article>
        <article>
          <strong>97%</strong>
          <p>Satisfaction rate</p>
        </article>
        <article>
          <strong>450+</strong>
          <p>Customers in 85 countries</p>
        </article>
      </section>

      <section className="section">
        <h2>What people say</h2>
        <div className="grid">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name}>
              <p>{testimonial.quote}</p>
              <h3>{testimonial.name}</h3>
              <p>{testimonial.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq">
          {faq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="cta" id="cta">
        <h2>Ready to start?</h2>
        <a href="#top">Start for free</a>
      </section>
    </main>
  )
}

export default App
