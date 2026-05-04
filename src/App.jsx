import { useEffect, useState } from "react";
import siteData from "./data";
import "./App.css";

const iconMap = {
  qq: (
    <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.003 2c-2.265 0-6.29 1.364-6.29 7.325v1.195S3.55 14.96 3.55 17.474c0 .665.17 1.026.408 1.026.613 0 .817-.868 1.226-2.715.307-1.379.545-2.194.749-2.194.544 0 .17 1.228.17 3.828 0 2.6.238 4.392 1.396 5.148.783.51 1.767.385 2.174.265.204-.068.408-.17.544-.272.17.102.34.204.544.272.407.12 1.39.246 2.174-.265 1.158-.756 1.396-2.549 1.396-5.148 0-2.6-.374-3.828.17-3.828.204 0 .442.816.749 2.194.409 1.847.613 2.715 1.226 2.715.238 0 .408-.361.408-1.026 0-2.514-3.163-6.954-3.163-6.954V9.325C18.293 3.364 14.268 2 12.003 2z" />
    </svg>
  ),
  wechat: (
    <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.65 2.612c-1.94 0-3.75.803-5.002 2.085-1.222 1.252-1.878 2.837-1.878 4.465 0 3.291 2.97 5.847 6.88 5.847.972 0 1.92-.194 2.807-.558a.644.644 0 01.537.074l1.427.835a.245.245 0 00.126.04c.122 0 .218-.099.218-.222 0-.053-.024-.107-.036-.16l-.292-1.11a.442.442 0 01.16-.498C22.053 18.296 23 16.855 23 15.281c0-3.675-3.447-6.678-7.752-6.678zm-2.438 3.876c.482 0 .873.396.873.884a.879.879 0 01-.873.884.879.879 0 01-.873-.884c0-.488.391-.884.873-.884zm4.86 0c.482 0 .873.396.873.884a.879.879 0 01-.873.884.879.879 0 01-.873-.884c0-.488.391-.884.873-.884z" />
    </svg>
  ),
  game: (
    <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      <line x1="7" y1="9" x2="7" y2="9.01" />
      <line x1="11" y1="12" x2="11" y2="12.01" />
      <line x1="7" y1="15" x2="7" y2="15.01" />
      <line x1="4" y1="10" x2="4" y2="14" />
      <line x1="10" y1="10" x2="10" y2="14" />
    </svg>
  ),
};

function App() {
  const [visible, setVisible] = useState(false);
  const [modal, setModal] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleContactClick = (contact) => {
    if (contact.copyText) {
      setModal(contact);
    } else if (contact.image) {
      setModal(contact);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const closeModal = () => {
    setModal(null);
    setCopied(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <span className="logo">{siteData.name}</span>
          <ul className="nav-links">
            {siteData.navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero">
        <div className="container hero-content">
          <div className="hero-avatar">
            {siteData.avatar ? (
              <img src={siteData.avatar} alt={siteData.name} />
            ) : (
              siteData.name.charAt(0)
            )}
          </div>
          <h1 className="hero-name">{siteData.name}</h1>
          <p className="hero-title">{siteData.title}</p>
          <p className="hero-tagline">{siteData.tagline}</p>
          <div className="hero-cta">
            <a href="#contact" className="btn btn-primary">
              联系我
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about">
        <div className="container">
          <h2 className="section-title">关于我</h2>
          <p>{siteData.about}</p>
        </div>
      </section>

      {/* Skills */}
      <section id="skills">
        <div className="container">
          <h2 className="section-title">技能</h2>
          <div className="skills-grid">
            {siteData.skills.map((skill) => (
              <div className="skill-item" key={skill.name}>
                <div className="skill-header">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-level">{skill.level}%</span>
                </div>
                <div className="skill-bar">
                  <div
                    className="skill-bar-fill"
                    style={{ width: visible ? `${Math.min(skill.level, 100)}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact">
        <div className="container">
          <h2 className="section-title">联系方式</h2>
          <div className="contact-grid">
            {siteData.contacts.map((contact) => (
              <button
                key={contact.label}
                className="contact-card"
                onClick={() => handleContactClick(contact)}
              >
                {iconMap[contact.icon]}
                <span>{contact.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          © {new Date().getFullYear()} {siteData.name}. All Rights Reserved.
        </div>
      </footer>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              &times;
            </button>
            <div className="modal-icon">{iconMap[modal.icon]}</div>
            <h3 className="modal-label">{modal.label}</h3>

            {modal.image ? (
              <img
                src={modal.image}
                alt={modal.detail}
                className="modal-image"
              />
            ) : (
              <p className="modal-detail">{modal.detail}</p>
            )}

            {modal.copyText && (
              <button
                className={`btn btn-primary modal-copy-btn ${copied ? "copied" : ""}`}
                onClick={() => handleCopy(modal.copyText)}
              >
                {copied ? "已复制 ✓" : "复制账号"}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
