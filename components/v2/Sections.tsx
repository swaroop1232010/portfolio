import {
  stats,
  marquee,
  profile,
  services,
  articles,
  projects,
  heroLines,
  aboutText,
  experience,
} from "../../data/content";

const Arrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export function Nav() {
  const items = [
    ["About", "#about"],
    ["Experience", "#experience"],
    ["Work", "#work"],
    ["Writing", "#writing"],
  ];
  return (
    <header className="nav" data-nav>
      <a href="#top" className="nav__logo" data-scroll-to data-magnetic>
        SR<span>.</span>
      </a>
      <nav className="nav__links">
        {items.map(([label, href]) => (
          <a key={href} href={href} data-scroll-to className="nav__link">
            <span data-text={label}>{label}</span>
          </a>
        ))}
      </nav>
      <a href="#contact" data-scroll-to className="nav__cta" data-magnetic>
        Let&apos;s talk
      </a>
    </header>
  );
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__grid">
        <div className="hero__copy">
          <div className="hero__me" data-hero-fade>
            <div className="hero__avatar" data-hero-photo>
              <img src={profile.photo} alt={profile.name} />
            </div>
            <div className="hero__me-text">
              <span className="hero__me-name">{profile.name}</span>
              <span className="hero__me-role">
                <span className="dot" /> {profile.role} · {profile.location} · Open to projects
              </span>
            </div>
          </div>
          <h1 className="hero__title" data-hero-title>
            {heroLines.map((line, i) => (
              <span className="line" key={line}>
                <span className={`line__inner ${i === 2 ? "accent" : ""}`}>{line}</span>
              </span>
            ))}
          </h1>
          <p className="hero__sub" data-hero-fade>
            9+ years building e-commerce platforms, real-time systems and, today, AI agents — with Java,
            Spring Boot, React and Next.js.
          </p>
          <div className="hero__actions" data-hero-fade>
            <a href="#work" data-scroll-to className="btn btn--solid" data-magnetic data-cursor="View work">
              See my work <Arrow />
            </a>
            <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn--ghost" data-magnetic>
              Resume
            </a>
          </div>
        </div>
        <div className="hero__orb" data-orb-anchor aria-hidden="true" />
        <div className="hero__visual">
          <div className="hero__badge" data-float>
            <strong>100%</strong>
            <span>RAG accuracy in my latest experiment</span>
          </div>
          <div className="hero__badge hero__badge--alt" data-float data-float-delay="1">
            <strong>9+</strong>
            <span>years in production</span>
          </div>
        </div>
      </div>
      <div className="hero__scroll" data-hero-fade>
        <span>Scroll</span>
        <i />
      </div>
    </section>
  );
}

export function Marquee() {
  const row = [...marquee, ...marquee];
  return (
    <section className="marquee" aria-label="Technologies">
      <div className="marquee__row" data-marquee="1">
        {row.map((t, i) => (
          <span key={`a${i}`} className="marquee__item">
            {t} <em>✦</em>
          </span>
        ))}
      </div>
      <div className="marquee__row marquee__row--outline" data-marquee="-1">
        {row.map((t, i) => (
          <span key={`b${i}`} className="marquee__item">
            {t} <em>✦</em>
          </span>
        ))}
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="about section" id="about">
      <p className="eyebrow" data-reveal>
        (01) About
      </p>
      <p className="about__text" data-words>
        {aboutText}
      </p>
      <div className="stats">
        {stats.map((s) => (
          <div className="stat" key={s.label} data-reveal>
            <div className="stat__value">
              <span data-count={s.value}>0</span>
              {s.suffix}
            </div>
            <div className="stat__label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section className="exp" id="experience" data-exp>
      <div className="exp__head section">
        <p className="eyebrow">(02) Experience</p>
        <h2 className="h2" data-split>
          Nine years, <span className="accent">one craft.</span>
        </h2>
      </div>
      <div className="exp__track" data-exp-track>
        {experience.map((e, i) => (
          <article className="exp__card" key={e.period} data-cursor="Drag on">
            <div className="exp__index">0{i + 1}</div>
            <p className="exp__period">{e.period}</p>
            <h3 className="exp__role">{e.role}</h3>
            <p className="exp__company">{e.company}</p>
            <ul className="exp__points">
              {e.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <div className="chips">
              {e.stack.map((s) => (
                <span className="chip" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="exp__progress">
        <i data-exp-progress />
      </div>
    </section>
  );
}

export function Work() {
  // Each column gets one tall (3:4), one medium (4:5) and one square card, so they end level.
  const layout = [
    [0, 4, 8],
    [1, 5, 6],
    [2, 3, 7],
  ];
  const cols = layout.map((ids) => ids.map((i) => projects[i]).filter(Boolean));
  const speeds = [-8, 6, -14];
  return (
    <section className="work section" id="work">
      <div className="work__head">
        <p className="eyebrow">(03) Selected work</p>
        <h2 className="h2" data-split>
          Things I&apos;ve <span className="accent">built.</span>
        </h2>
      </div>
      <div className="masonry">
        {cols.map((col, ci) => (
          <div className="masonry__col" key={ci} data-col-speed={speeds[ci]}>
            {col.map((p) => {
              const Tag = p.href ? "a" : "div";
              return (
                <Tag
                  key={p.title}
                  className="card"
                  data-card
                  data-cursor={p.href ? "Open" : "Private"}
                  {...(p.href ? { href: p.href, target: "_blank", rel: "noreferrer" } : {})}
                >
                  <div className="card__media">
                    <img src={p.image} alt={p.title} loading="lazy" />
                    <span className="card__tag">{p.tag}</span>
                  </div>
                  <div className="card__body">
                    <h3>
                      {p.title} {p.href && <Arrow />}
                    </h3>
                    <p>{p.blurb}</p>
                    <div className="chips">
                      {p.stack.map((s) => (
                        <span className="chip" key={s}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </Tag>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section className="services section" id="services">
      <p className="eyebrow">(04) What I do</p>
      <h2 className="h2" data-split>
        How I can <span className="accent">help.</span>
      </h2>
      <div className="stack">
        {services.map((s, i) => (
          <article className="stack__card" key={s.no} data-stack-card style={{ top: `${14 + i * 3}vh` }}>
            <div className="stack__no">{s.no}</div>
            <div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <div className="chips">
                {s.tags.map((t) => (
                  <span className="chip chip--light" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Writing() {
  return (
    <section className="writing section" id="writing" data-writing>
      <p className="eyebrow">(05) Writing</p>
      <h2 className="h2" data-split>
        Notes from the <span className="accent">workbench.</span>
      </h2>
      <ul className="posts">
        {articles.map((a) => (
          <li key={a.href} data-reveal>
            <a href={a.href} target="_blank" rel="noreferrer" className="post" data-post-img={a.image} data-cursor="Read">
              <span className="post__date">{a.date}</span>
              <span className="post__title">{a.title}</span>
              <Arrow />
            </a>
          </li>
        ))}
      </ul>
      <div className="post-preview" data-post-preview aria-hidden="true">
        <img alt="" />
      </div>
      <a href={profile.links.medium} target="_blank" rel="noreferrer" className="btn btn--ghost" data-magnetic>
        All articles on Medium <Arrow />
      </a>
    </section>
  );
}

export function Contact() {
  return (
    <section className="contact" id="contact">
      <img className="contact__bg" src="images/v2/contact-bg.webp" alt="" data-parallax="15" />
      <div className="contact__inner">
        <div className="contact__orb" data-orb-anchor aria-hidden="true" />
        <p className="eyebrow">(06) Contact</p>
        <h2 className="contact__title" data-split>
          Have a project in mind?
          <br />
          <span className="accent">Let&apos;s build it.</span>
        </h2>
        <a href={`mailto:${profile.email}`} className="contact__mail" data-magnetic data-cursor="Say hi">
          {profile.email}
        </a>
        <div className="contact__links">
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" data-magnetic>
            LinkedIn
          </a>
          <a href={profile.links.github} target="_blank" rel="noreferrer" data-magnetic>
            GitHub
          </a>
          <a href={profile.links.medium} target="_blank" rel="noreferrer" data-magnetic>
            Medium
          </a>
          <a href={profile.resume} target="_blank" rel="noreferrer" data-magnetic>
            Resume
          </a>
        </div>
      </div>
      <footer className="footer">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Designed & built with Next.js, GSAP and Lenis</span>
        <a href="#top" data-scroll-to>
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}

export function Preloader() {
  return (
    <div className="loader" data-loader>
      <div className="loader__panel" />
      <div className="loader__panel" />
      <div className="loader__content">
        <span className="loader__name">Swaroop Reddy</span>
        <span className="loader__count" data-loader-count>
          0
        </span>
      </div>
    </div>
  );
}
