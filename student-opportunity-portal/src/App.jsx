import { useEffect, useMemo, useState } from 'react';

const opportunities = [
  { id: 1, title: 'Frontend Developer Intern', company: 'BrightByte Technologies', type: 'Internship', mode: 'Remote', duration: '8 weeks', stipend: '₹8,000 / month', category: 'Technology', description: 'Build responsive web pages and work with a friendly product team.', skills: ['HTML', 'CSS', 'React'], tag: 'Popular' },
  { id: 2, title: 'Data Analytics Project', company: 'Campus Data Lab', type: 'Project', mode: 'Hybrid', duration: '4 weeks', stipend: 'Certificate', category: 'Data', description: 'Explore a sample dataset, find patterns, and present useful insights.', skills: ['Excel', 'SQL', 'Python'], tag: 'Beginner friendly' },
  { id: 3, title: 'Python Developer Intern', company: 'CodeNest Studio', type: 'Internship', mode: 'On-site', duration: '6 weeks', stipend: '₹6,000 / month', category: 'Technology', description: 'Help create small Python utilities and test application features.', skills: ['Python', 'Problem solving'], tag: 'New' },
  { id: 4, title: 'Student Community Website', company: 'Open Campus Group', type: 'Project', mode: 'Remote', duration: '3 weeks', stipend: 'Portfolio project', category: 'Technology', description: 'Collaborate on a simple website for sharing student events.', skills: ['JavaScript', 'React', 'CSS'], tag: 'Team project' },
  { id: 5, title: 'Business Research Intern', company: 'MarketMinds', type: 'Internship', mode: 'Remote', duration: '5 weeks', stipend: '₹5,000 / month', category: 'Business', description: 'Research market information and prepare short summary reports.', skills: ['Research', 'Excel', 'Communication'], tag: 'Flexible' },
  { id: 6, title: 'UI Design Mini Project', company: 'Design Circle', type: 'Project', mode: 'Hybrid', duration: '2 weeks', stipend: 'Certificate', category: 'Design', description: 'Create clean screen layouts for a student-focused mobile app.', skills: ['Figma', 'Creativity'], tag: 'Creative' }
];

function App() {
  const [user, setUser] = useState(() => localStorage.getItem('sop-user') || '');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [activePage, setActivePage] = useState('Explore');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [applications, setApplications] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sop-applications') || '[]'); }
    catch { return []; }
  });
  const [notice, setNotice] = useState('');

  useEffect(() => localStorage.setItem('sop-applications', JSON.stringify(applications)), [applications]);

  const filtered = useMemo(() => opportunities.filter(item => {
    const matchesType = filter === 'All' || item.type === filter;
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || [item.title, item.company, item.category, item.description, ...item.skills].join(' ').toLowerCase().includes(term);
    return matchesType && matchesSearch;
  }), [filter, search]);

  function signIn(event) {
    event.preventDefault();
    const cleanName = nameInput.trim();
    const cleanEmail = emailInput.trim();
    if (!cleanName || !cleanEmail) return;
    setUser(cleanName);
    localStorage.setItem('sop-user', cleanName);
  }

  function apply(item) {
    if (applications.some(app => app.id === item.id)) {
      setNotice('You have already applied to this opportunity.');
      return;
    }
    setApplications([...applications, { ...item, appliedOn: new Date().toLocaleDateString() }]);
    setNotice(`Application submitted for ${item.title}!`);
  }

  function withdraw(id) {
    setApplications(applications.filter(item => item.id !== id));
    setNotice('Application withdrawn.');
  }

  function logout() {
    setUser('');
    localStorage.removeItem('sop-user');
    setActivePage('Explore');
  }

  if (!user) {
    return <main className="login-screen">
      <section className="login-card">
        <div className="brand-mark">SP</div>
        <p className="eyebrow">YOUR NEXT STEP STARTS HERE</p>
        <h1>Student Opportunity Portal</h1>
        <p className="muted">Discover internships, build projects, and keep your applications in one place.</p>
        <form onSubmit={signIn} className="login-form">
          <label>Student name</label>
          <input value={nameInput} onChange={e => setNameInput(e.target.value)} placeholder="Enter your name" required />
          <label>Email address</label>
          <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="you@example.com" required />
          <button className="primary full" type="submit">Continue to portal <span>→</span></button>
        </form>
        <p className="tiny">Demo sign-in · No password required</p>
      </section>
    </main>;
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark small">SP</div><span>Student<span className="brand-light">Portal</span></span></div>
      <p className="nav-label">WORKSPACE</p>
      {['Explore', 'My Applications'].map(page => <button key={page} className={`nav-link ${activePage === page ? 'selected' : ''}`} onClick={() => { setActivePage(page); setNotice(''); }}>
        <span className="nav-icon">{page === 'Explore' ? '⌕' : '▤'}</span>{page}
        {page === 'My Applications' && <span className="nav-count">{applications.length}</span>}
      </button>)}
      <div className="sidebar-bottom">
        <div className="help-card"><span>✦</span><strong>Keep growing</strong><p>Every small project adds to your experience.</p></div>
        <button className="logout" onClick={logout}>↪ Sign out</button>
      </div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <div className="mobile-brand">SP <span>StudentPortal</span></div>
        <div className="top-right"><span className="status-dot"></span><span>Student workspace</span><div className="avatar">{user.charAt(0).toUpperCase()}</div></div>
      </header>

      <div className="content">
        <section className="welcome-row">
          <div><p className="eyebrow">STUDENT DASHBOARD</p><h1>{activePage === 'Explore' ? `Welcome back, ${user.split(' ')[0]}!` : 'My Applications'}</h1>
            <p className="muted">{activePage === 'Explore' ? 'Find an opportunity that helps you learn, create, and grow.' : 'Track the opportunities you have applied to.'}</p>
          </div>
          <div className="date-chip">✦ &nbsp; Learn something new today</div>
        </section>

        {notice && <div className="notice"><span>✓</span>{notice}<button onClick={() => setNotice('')}>×</button></div>}

        {activePage === 'Explore' ? <>
          <section className="hero">
            <div className="hero-copy"><span className="hero-pill">OPPORTUNITIES FOR STUDENTS</span><h2>Your future is<br/>one click away.</h2><p>Explore practical experiences and turn what you learn into something real.</p><button className="hero-button" onClick={() => document.getElementById('opportunities').scrollIntoView({ behavior: 'smooth' })}>Explore opportunities <span>↘</span></button></div>
            <div className="hero-art"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="art-card"><span className="art-star">✦</span><div className="art-lines"><i></i><i></i><i></i></div><div className="art-check">✓</div></div><div className="floating-note">✨ &nbsp; New possibilities</div></div>
          </section>

          <section className="stats">
            <div className="stat-card"><span className="stat-icon purple">⌕</span><div><strong>{opportunities.length}</strong><p>Opportunities</p></div></div>
            <div className="stat-card"><span className="stat-icon orange">▤</span><div><strong>{opportunities.filter(o => o.type === 'Internship').length}</strong><p>Internships</p></div></div>
            <div className="stat-card"><span className="stat-icon green">✓</span><div><strong>{applications.length}</strong><p>Applied</p></div></div>
          </section>

          <section id="opportunities" className="opportunity-section">
            <div className="section-heading"><div><p className="eyebrow">FIND YOUR FIT</p><h2>Explore opportunities</h2></div><span className="results">{filtered.length} results</span></div>
            <div className="filters">
              <div className="search-box"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search roles, skills, companies..." /></div>
              <div className="filter-buttons">{['All', 'Internship', 'Project'].map(type => <button key={type} className={filter === type ? 'filter-active' : ''} onClick={() => setFilter(type)}>{type}</button>)}</div>
            </div>
            <div className="opportunity-grid">
              {filtered.map(item => {
                const applied = applications.some(app => app.id === item.id);
                return <article className="opportunity-card" key={item.id}>
                  <div className="card-top"><div className={`company-icon icon-${item.id}`}>{item.company.split(' ').map(w => w[0]).join('').slice(0, 2)}</div><span className="tag">{item.tag}</span></div>
                  <p className="company">{item.company}</p><h3>{item.title}</h3><p className="description">{item.description}</p>
                  <div className="skill-list">{item.skills.map(skill => <span key={skill}>{skill}</span>)}</div>
                  <div className="meta"><span>◷ {item.duration}</span><span>⌖ {item.mode}</span></div>
                  <div className="card-bottom"><div><strong>{item.stipend}</strong><small>{item.type} · {item.category}</small></div><button className={applied ? 'applied-button' : 'apply-button'} onClick={() => apply(item)} disabled={applied}>{applied ? 'Applied ✓' : 'Apply now →'}</button></div>
                </article>;
              })}
              {filtered.length === 0 && <div className="empty-state">No opportunities found. Try another search.</div>}
            </div>
          </section>
        </> : <section className="applications-section">
          {applications.length === 0 ? <div className="empty-large"><div>▤</div><h2>No applications yet</h2><p>Explore the available opportunities and apply to the ones that interest you.</p><button className="primary" onClick={() => setActivePage('Explore')}>Browse opportunities →</button></div> :
            <div className="application-list">{applications.map(item => <article className="application-card" key={item.id}><div className={`company-icon icon-${item.id}`}>{item.company.split(' ').map(w => w[0]).join('').slice(0, 2)}</div><div className="application-info"><span className="company">{item.company}</span><h3>{item.title}</h3><p>{item.type} · Applied on {item.appliedOn}</p></div><span className="application-status">Submitted</span><button className="withdraw" onClick={() => withdraw(item.id)}>Withdraw</button></article>)}</div>}
        </section>}
        <footer>Student Opportunity Portal <span>Built with React · Learning through opportunities</span></footer>
      </div>
    </main>
  </div>;
}

export default App;
