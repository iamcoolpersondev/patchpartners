import RequestForm from "./request-form";

const services = [
  { icon: "↗", title: "Build it", text: "Landing pages, web apps, dashboards and small tools built cleanly from scratch." },
  { icon: "✦", title: "Fix it", text: "Broken layouts, bugs, deployment problems, performance issues and confusing UX." },
  { icon: "◎", title: "Polish it", text: "Make an existing project feel faster, clearer, more modern and more professional." },
];

export default function Home() {
  return (
    <main>
      <nav className="nav shell">
        <a className="brand" href="#"><span className="brandMark">P</span><span>Patch Partners</span></a>
        <div className="navLinks">
          <a href="#services">What we do</a>
          <a href="#request">Start a request</a>
        </div>
        <a className="button buttonSmall" href="#request">Get help</a>
      </nav>

      <section className="hero shell">
        <div className="eyebrow"><span className="dot" /> Small team. Useful software.</div>
        <h1>We fix what’s broken.<br/><span>And build what’s next.</span></h1>
        <p className="heroText">Patch Partners is a friendly software studio run by a small group of developers. Tell us what you need fixed or made, and we’ll turn it into a clear plan.</p>
        <div className="heroActions">
          <a className="button" href="#request">Tell us what you need <span>→</span></a>
          <a className="textLink" href="#services">See what we do <span>↓</span></a>
        </div>
        <div className="heroPanel">
          <div className="statusPill"><span className="dot" /> Taking new requests</div>
          <div className="miniGrid">
            <div><strong>Clear</strong><span>Simple communication</span></div>
            <div><strong>Practical</strong><span>No unnecessary complexity</span></div>
            <div><strong>Friendly</strong><span>People you can actually talk to</span></div>
          </div>
        </div>
      </section>

      <section id="services" className="section shell">
        <div className="sectionHead">
          <div><p className="kicker">WHAT WE DO</p><h2>Software help without the fuss.</h2></div>
          <p>Whether it needs a tiny patch or a fresh build, we focus on making the result reliable, polished and easy to use.</p>
        </div>
        <div className="cards">
          {services.map((s) => (
            <article className="card" key={s.title}>
              <div className="cardIcon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="process shell">
        <p className="kicker">HOW IT WORKS</p>
        <div className="steps">
          <div><span>01</span><h3>Send the request</h3><p>Explain what you want built or what is not working.</p></div>
          <div><span>02</span><h3>We review it</h3><p>We look through the details and work out the best next step.</p></div>
          <div><span>03</span><h3>We get to work</h3><p>You get clear communication while we fix, build and polish.</p></div>
        </div>
      </section>

      <section id="request" className="requestSection">
        <div className="shell requestGrid">
          <div className="requestCopy">
            <p className="kicker">START A REQUEST</p>
            <h2>What can we help you with?</h2>
            <p>Give us the details. You do not need to know the technical words—just describe what you want to happen.</p>
            <div className="friendlyNote"><span>✦</span><p><strong>Not sure how to explain it?</strong><br/>That’s completely fine. A rough description is enough to start.</p></div>
          </div>
          <RequestForm />
        </div>
      </section>

      <footer className="footer shell">
        <a className="brand" href="#"><span className="brandMark">P</span><span>Patch Partners</span></a>
        <p>Software fixing + making, by people who care about the details.</p>
        <span>© {new Date().getFullYear()} Patch Partners</span>
      </footer>
    </main>
  );
}
