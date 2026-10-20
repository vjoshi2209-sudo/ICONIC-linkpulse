import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import "./App.css";

const API = "http://localhost:3000";



function HolographicGlobe() {
  const globeRef = useRef(null);

  useFrame(({ clock }) => {
    if (globeRef.current) {
      globeRef.current.rotation.y =
        clock.getElapsedTime() * 0.12;
    }
  });

  return (
    <group ref={globeRef}>
      <mesh>
        <sphereGeometry args={[1.45, 40, 40]} />
        <meshBasicMaterial
          color="#245bff"
          wireframe
          transparent
          opacity={0.22}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshBasicMaterial
          color="#101d52"
          transparent
          opacity={0.12}
        />
      </mesh>


      <mesh rotation={[Math.PI / 2.5, 0.3, 0]}>
        <torusGeometry args={[1.8, 0.008, 8, 120]} />
        <meshBasicMaterial
          color="#54dfff"
          transparent
          opacity={0.75}
        />
      </mesh>

      <mesh rotation={[0.5, 0, 0.7]}>
        <torusGeometry args={[2, 0.006, 8, 120]} />
        <meshBasicMaterial
          color="#9b72ff"
          transparent
          opacity={0.65}
        />
      </mesh>
    </group>
  );
}

function ThreeDBackground() {
  return (
    <div className="three-background" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.8} />
        <pointLight
          position={[3, 3, 4]}
          intensity={25}
          color="#655bff"
        />
        <pointLight
          position={[-3, -2, 3]}
          intensity={15}
          color="#35dfff"
        />

        <HolographicGlobe />
      </Canvas>
    </div>
  );
}

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [allLinks, setAllLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");

  // TEAM ICONIC INTRO SCREEN
  const [showIntro, setShowIntro] = useState(true);

useEffect(() => {
  // Intro stays visible until the user clicks ENTER LINKPULSE.
}, []);

  async function loadLinks() {
    setLoadingLinks(true);
    setError("");

    try {
      const response = await fetch(`${API}/api/links`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load links");
      }

      setAllLinks(data);
    } catch (err) {
      setError(err.message || "Could not connect to the backend");
    } finally {
      setLoadingLinks(false);
    }
  }

  useEffect(() => {
    loadLinks();
  }, []);

  async function shortenUrl(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setShortUrl("");
    setAnalytics(null);

    if (!url.trim()) {
      setError("Please enter a URL first.");
      return;
    }
    const expiryDate = new Date(expiresAt);

if (
  !expiresAt ||
  Number.isNaN(expiryDate.getTime()) ||
  expiryDate.getTime() <= Date.now()
) {
  setError("Please select a future expiry date and time.");
  return;
}

    setLoading(true);

    try {
      const response = await fetch(`${API}/api/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  url: url.trim(),
  expiresAt: expiryDate.toISOString(),
}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL");
      }

      setShortUrl(data.shortUrl);
      setMessage("Your short link is ready!");
      <p className="expiry-info">
  <strong>Expiry date:</strong>{" "}
  {expiresAt
    ? new Date(expiresAt).toLocaleString()
    : "Not set"}
</p>
      await loadLinks();
    } catch (err) {
      setError(err.message || "Could not connect to the backend");
    } finally {
      setLoading(false);
    }
  }

  async function loadAnalytics(linkToCheck = shortUrl) {
    if (!linkToCheck) return;

    setError("");
    setAnalytics(null);

    const code = linkToCheck.split("/").pop();

    try {
      const response = await fetch(`${API}/api/analytics/${code}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load analytics");
      }

      setAnalytics(data);
    } catch (err) {
      setError(err.message || "Could not load analytics");
    }
  }

  async function copyUrl(link = shortUrl) {
    try {
      await navigator.clipboard.writeText(link);
      setMessage("Link copied to clipboard!");
      setError("");
    } catch {
      setError("Copy failed. Please copy the link manually.");
    }
  }

  const totalClicks = allLinks.reduce(
    (total, link) => total + (Number(link.clicks) || 0),
    0
  );

  return (
    <>
      {/* =====================================
          SCREEN 1: UNIVERSITY + TEAM INTRO
          ===================================== */}

      {showIntro && (
        <section className="intro-screen">
          <div className="intro-grid" />

          <div className="intro-orb orb-one" />
          <div className="intro-orb orb-two" />

          <div className="intro-content">
            <div className="university-logo">
              <span>GEHU</span>
            </div>

            <p className="intro-kicker">WELCOME TO</p>

            <h1 className="university-title">
              GRAPHIC ERA
              <span>HILL UNIVERSITY</span>
            </h1>

            <div className="intro-line" />

            <p className="team-label">PRESENTING TEAM</p>

            <h2 className="team-title">ICONIC</h2>

            <div className="team-members">
              <span>VIVEK</span>
              <span>PAWAN</span>
              <span>PRASANT</span>
              <span>YESHARTH</span>
              <span>DHRUV</span>
            </div>

            <p className="launch-text">
              INNOVATION STARTS HERE
            </p>

            <button
              type="button"
              className="intro-skip"
              onClick={() => setShowIntro(false)}
            >
              ENTER LINKPULSE →
            </button>
          </div>
        </section>
      )}

      {/* =====================================
          SCREEN 2: YOUR ACTUAL LINKPULSE WEBSITE
          ===================================== */}

      <main className="app website-reveal">
  <ThreeDBackground />

  {/* Tumhara existing website code yahin rahega */}
        <div className="ambient-background">
          <div className="background-grid" />
          <div className="ambient-orb orb-one" />
          <div className="ambient-orb orb-two" />
          <div className="ambient-orb orb-three" />
        </div>

        <nav className="navbar">
          <a className="brand" href="#home">
            <span className="brand-icon">↗</span>
            <span className="brand-name">
              LINK<span>PULSE</span>
            </span>
          </a>

          <div className="nav-right">
            <span className="status-dot" />
            <span>Local server</span>
            <a href="#dashboard" className="nav-link">
              Dashboard
            </a>
          </div>
        </nav>

        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              URL SHORTENER &amp; ANALYTICS
            </span>

            {/* FUTURISTIC 3D GRAPHIC */}

            <div className="hero-visual">
              <div className="hero-image-layer">
</div>
              <div className="hero-glow" />

              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="orbit orbit-three" />

              <div className="floating-cube cube-one" />
              <div className="floating-cube cube-two" />
              <div className="floating-cube cube-three" />

              <div className="hero-core">
                <svg
                  width="78"
                  height="78"
                  viewBox="0 0 100 100"
                  fill="none"
                  aria-label="LINKPULSE link graphic"
                  role="img"
                >
                  <path
                    d="M40 60L31 69C23 77 11 65 19 57L34 42C40 36 49 36 55 42"
                    stroke="#82DFFF"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M60 40L69 31C77 23 89 35 81 43L66 58C60 64 51 64 45 58"
                    stroke="#B6A5FF"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M38 62L62 38"
                    stroke="#FFFFFF"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="floating-label label-one">
                <span className="label-dot" />
                Live link tracking
              </div>

              <div className="floating-label label-two">
                <span className="label-icon">↗</span>
                Smart URL
              </div>
            </div>

            <h1>
              Links that work
              <br />
              <span>smarter.</span>
            </h1>

            <p className="subtitle">
              Create short links, share them anywhere, and keep track of every
              click from one simple dashboard.
            </p>
             
             <div className="expiry-field">
  <label htmlFor="expiry-date">
    Choose link expiry date and time
  </label>

  <input
    id="expiry-date"
    type="datetime-local"
    value={expiresAt}
    min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)}
    onChange={(event) => setExpiresAt(event.target.value)}
    required
  />
</div>

            <form className="url-form" onSubmit={shortenUrl}>
              <span className="input-icon">↗</span>

              <input
                type="url"
                placeholder="https://example.com/your-long-url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                aria-label="Long URL"
                required
              />

              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading ? "Creating..." : "Shorten URL"}
                {!loading && <span>↗</span>}
              </button>
            </form>

            <p className="form-hint">
              <span>✓</span> Fast and simple
              <span>✓</span> Click tracking
              <span>✓</span> Easy sharing
            </p>

            {error && (
              <div className="alert error-alert">{error}</div>
            )}

            {message && (
              <div className="alert success-alert">{message}</div>
            )}

            {shortUrl && (
              <div className="result-card">
                <div className="result-heading">
                  <div className="result-check">✓</div>
                  <div>
                    <h3>Your link is ready</h3>
                    <p>Copy it and share it anywhere.</p>
                  </div>
                </div>

                <div className="result-link-row">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {shortUrl}
                  </a>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => copyUrl(shortUrl)}
                  >
                    Copy link
                  </button>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => loadAnalytics(shortUrl)}
                  >
                    Analytics
                  </button>
                </div>

                {analytics && (
                  <div className="inline-analytics">
                    <div>
                      <span>Total clicks</span>
                      <strong>{analytics.clicks}</strong>
                    </div>

                    <div className="original-url">
                      <span>Original URL</span>
                      <a
                        href={analytics.originalUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {analytics.originalUrl}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* DASHBOARD */}

        <section className="dashboard" id="dashboard">
          <div className="section-heading">
            <div>
              <span className="section-kicker">OVERVIEW</span>
              <h2>Your dashboard</h2>
              <p>
                Manage your links and monitor their performance.
              </p>
            </div>

            <button
              type="button"
              className="refresh-button"
              onClick={loadLinks}
              disabled={loadingLinks}
            >
              <span>{loadingLinks ? "◌" : "↻"}</span>
              {loadingLinks ? "Refreshing..." : "Refresh links"}
            </button>
          </div>

          <div className="stats-grid">
            <article className="stat-card">
              <div className="stat-top">
                <span>Total links</span>
                <span className="stat-icon purple">↗</span>
              </div>

              <strong>{allLinks.length}</strong>
              <p>Links created on this server</p>

              <div className="mini-visual purple-bars">
                {Array.from({ length: 7 }, (_, i) => (
                  <span key={i} />
                ))}
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Total clicks</span>
                <span className="stat-icon blue">⌁</span>
              </div>

              <strong>{totalClicks}</strong>
              <p>Tracked link visits</p>

              <div className="mini-visual blue-bars">
                {Array.from({ length: 7 }, (_, i) => (
                  <span key={i} />
                ))}
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Average clicks</span>
                <span className="stat-icon cyan">▥</span>
              </div>

              <strong>
                {allLinks.length
                  ? (totalClicks / allLinks.length).toFixed(1)
                  : "0"}
              </strong>

              <p>Clicks per link</p>

              <div className="mini-visual cyan-bars">
                {Array.from({ length: 7 }, (_, i) => (
                  <span key={i} />
                ))}
              </div>
            </article>
          </div>

          <div className="links-panel">
            <div className="panel-heading">
              <div>
                <h3>All links</h3>
                <p>Your recently created short links</p>
              </div>

              <span className="count-badge">
                {allLinks.length} links
              </span>
            </div>

            {loadingLinks && allLinks.length === 0 ? (
              <div className="empty-state">
                Loading your links...
              </div>
            ) : allLinks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">↗</div>
                <h3>No links yet</h3>
                <p>
                  Create your first short link using the form above.
                </p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="links-table">
                  <thead>
                    <tr>
                      <th>SHORT LINK</th>
                      <th>DESTINATION</th>
                      <th>CLICKS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {allLinks.map((link) => (
                      <tr key={link.code}>
                        <td>
                          <a
                            className="short-link"
                            href={link.shortUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span className="link-symbol">↗</span>
                            {link.shortUrl}
                          </a>
                        </td>

                        <td>
                          <a
                            className="destination-link"
                            href={link.originalUrl}
                            target="_blank"
                            rel="noreferrer"
                            title={link.originalUrl}
                          >
                            {link.originalUrl}
                          </a>
                        </td>

                        <td>
                          <span className="click-count">
                            {link.clicks ?? 0}
                          </span>
                        </td>

                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="icon-button"
                              title="Copy short link"
                              aria-label="Copy short link"
                              onClick={() => copyUrl(link.shortUrl)}
                            >
                              Copy
                            </button>

                            <button
                              type="button"
                              className="icon-button"
                              title="View analytics"
                              aria-label="View analytics"
                              onClick={() =>
                                loadAnalytics(link.shortUrl)
                              }
                            >
                              Stats
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {analytics && (
              <div className="analytics-panel">
                <div>
                  <span className="section-kicker">
                    LINK ANALYTICS
                  </span>
                  <h3>Click overview</h3>
                </div>

                <div className="analytics-metric">
                  <span>Total clicks</span>
                  <strong>{analytics.clicks}</strong>
                </div>

                <div className="analytics-destination">
                  <span>Destination URL</span>
                  <a
                    href={analytics.originalUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {analytics.originalUrl}
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FEATURES */}

        <section className="features">
          <div className="features-heading">
            <span className="section-kicker">
              BUILT FOR SIMPLICITY
            </span>
            <h2>Everything in one place.</h2>
          </div>

          <div className="features-grid">
            <article className="feature-card">
              <div className="feature-icon purple">↗</div>
              <h3>Simple links</h3>
              <p>
                Create compact URLs that are easy to share and manage.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon blue">▥</div>
              <h3>Click analytics</h3>
              <p>
                Check click counts and understand link activity.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon cyan">⌘</div>
              <h3>Link management</h3>
              <p>
                Keep your generated links together in one dashboard.
              </p>
            </article>
          </div>
        </section>

        {/* FOOTER */}

        <footer className="footer">
          <a className="brand footer-brand" href="#home">
            <span className="brand-icon">↗</span>
            <span className="brand-name">
              LINK<span>PULSE</span>
            </span>
          </a>

          <p>Smarter Links. Better Insights.</p>
          <span>© 2026 LINKPULSE · TEAM ICONIC</span>
        </footer>
      </main>
    </>
  );
}

export default App;