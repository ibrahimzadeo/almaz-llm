'use client'

import { useEffect, useState } from 'react'
import Glyph from '@/components/Glyph'
import '../landing.css'

/* Every discipline delta is measured in the same unit — percentage points over
   the baseline model — so they share one axis. AXIS_MAX is that axis; the bar
   widths are derived from it rather than picked to look full. */
const AXIS_MAX = 20

const DISCIPLINES = [
  { name: 'Riyaziyyat və Məntiq', delta: 12 },
  { name: 'Elm və Texnologiya', delta: 14 },
  { name: 'Tarix və Mədəniyyət', delta: 11 },
  { name: 'Hüquq və Hökumət', delta: 15 },
  { name: 'Dil və Ədəbiyyat', delta: 13 },
]

/* Mixed-unit targets can't share the bars' axis, so they are stated as
   target-and-outcome rows instead of being drawn as comparable lengths. */
const TARGETS = [
  { name: 'Tokenization Fertility', target: '≤ 2.2' },
  { name: 'TUMLU Composite Score', target: '+10% baseline' },
  { name: 'Instruction Following', target: '≥ 85%' },
  { name: 'NLU Task Performance', target: '+8% kompozit' },
]

/* Corpus sizes are shown proportionally against the largest source, so the
   scale difference between them is visible rather than implied. */
const CORPUS_MAX = 651

const CORPUS = [
  {
    glyph: 'corpus' as const,
    title: 'Əsas LLM korpusu',
    stat: '651M söz',
    share: 651,
    caption: 'Korpusun ən böyük hissəsi',
    body: 'Wikipedia, xəbərlər, bloqlar, kitablar və hüquqi sənədlərdən ibarət seçilmiş korpus.',
  },
  {
    glyph: 'literature' as const,
    title: 'Ədəbi irs',
    stat: '180M söz',
    share: 180,
    caption: '3,600+ klassik və müasir kitab',
    body: 'Klassik və müasir Azərbaycan ədəbiyyatının rəqəmsallaşdırılmış toplusu.',
  },
  {
    glyph: 'web' as const,
    title: 'Veb miqyaslı kolleksiya',
    stat: '94M söz',
    share: 94,
    caption: 'Təmizlənmiş və təkrarsızlaşdırılmış',
    body: 'Müxtəlif veb məzmunu, keyfiyyət filtrindən keçirilmiş.',
  },
  {
    glyph: 'archive' as const,
    title: 'Sənəd arxivi',
    stat: '1.9M sənəd',
    share: null,
    caption: 'Onillikləri əhatə edir',
    body: 'Xəbərlər, akademik jurnallar, kitablar və dövri nəşrlər.',
  },
  {
    glyph: 'legal' as const,
    title: 'Hüquqi və qanunvericilik',
    stat: 'Tam əhatə',
    share: null,
    caption: 'Qüvvədə olan mətnlər',
    body: 'Qanunlar, qaydalar və konstitusiya sənədlərinin tam dəstəyi.',
  },
  {
    glyph: 'specialized' as const,
    title: 'İxtisaslaşmış məlumatlar',
    stat: 'Ekspert seçimi',
    share: null,
    caption: 'NER · təsnifat · sual-cavab',
    body: 'Xüsusi tapşırıqlar üçün əl ilə hazırlanmış məlumat setləri.',
  },
]

const APPLICATIONS = [
  {
    glyph: 'government' as const,
    title: 'Dövlət və ictimai sektor',
    body: 'Vətəndaş xidmətlərinin avtomatlaşdırılması, sənəd emalı və siyasət tədqiqatları.',
  },
  {
    glyph: 'enterprise' as const,
    title: 'Müəssisə',
    body: 'Müştəri dəstəyi, biliklərin idarə edilməsi və biznes zəkası sistemləri.',
  },
  {
    glyph: 'education' as const,
    title: 'Təhsil',
    body: 'İntellektual repetitorluq, avtomatlaşdırılmış qiymətləndirmə və məzmun yaradılması.',
  },
  {
    glyph: 'media' as const,
    title: 'Media və məzmun',
    body: 'Geniş miqyasda məzmun yaradılması, tərcümə keyfiyyətinin yoxlanılması və jurnalistika.',
  },
  {
    glyph: 'legal' as const,
    title: 'Hüquq və uyğunluq',
    body: 'Müqavilə analizi, tənzimləyici sənədlərin emalı və hüquqi araşdırma.',
  },
  {
    glyph: 'health' as const,
    title: 'Səhiyyə',
    body: 'Tibbi sənədləşmə, xəstə ünsiyyəti və klinik qərarların dəstəklənməsi.',
  },
]

export default function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    const target = document.getElementById(id)
    if (target) {
      e.preventDefault()
      setMenuOpen(false)
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="landing-body">
      {/* Without JS the observer never adds .is-visible, so reveal the content outright. */}
      <noscript>
        <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>

      {/* Navigation */}
      <nav className={`landing-nav${menuOpen ? ' is-menu-open' : ''}`}>
        <a href="/" className="logo" style={{ textDecoration: 'none' }}>
          ALMAZ<span>.</span>
        </a>
        <ul className={`nav-links${menuOpen ? ' is-open' : ''}`} id="nav-links">
          <li>
            <a href="/about" style={{ color: 'var(--gold)' }}>
              Haqqımızda
            </a>
          </li>
          <li>
            <a href="/chinar">Chinar</a>
          </li>
          <li>
            <a href="#data" onClick={(e) => handleNavClick(e, 'data')}>
              Məlumat
            </a>
          </li>
          <li>
            <a href="#benchmarks" onClick={(e) => handleNavClick(e, 'benchmarks')}>
              Nəticələr
            </a>
          </li>
          <li>
            <a href="#applications" onClick={(e) => handleNavClick(e, 'applications')}>
              Tətbiqlər
            </a>
          </li>
        </ul>
        <a href="/" className="nav-cta">
          Başla
        </a>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          aria-label={menuOpen ? 'Menyunu bağla' : 'Menyunu aç'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            {menuOpen ? (
              <>
                <path d="M5 5 L19 19" />
                <path d="M19 5 L5 19" />
              </>
            ) : (
              <>
                <path d="M3 7 H21" />
                <path d="M3 12 H21" />
                <path d="M3 17 H21" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Page Header */}
      <section
        style={{
          minHeight: '42vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '10rem 2rem 5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="hero-bg" />
        <div className="hero-pattern" />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '760px' }}>
          <span className="section-label" style={{ marginBottom: '1.5rem', display: 'block' }}>
            Haqqımızda
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 600,
              letterSpacing: '-0.025em',
              textWrap: 'balance',
              lineHeight: 1.08,
              marginBottom: '1.5rem',
              color: 'var(--pearl)',
            }}
          >
            Azərbaycan dilini{' '}
            <span
              style={{
                background: 'linear-gradient(96deg, var(--gold), var(--saffron))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              dərindən
            </span>
            <br />
            anlayan süni intellekt
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1.15rem',
              color: 'var(--silver)',
              fontWeight: 300,
              lineHeight: 1.7,
            }}
          >
            10 milyondan çox insanın danışdığı dil üçün yerli olaraq yaradılmış birinci peşəkar dil modeli.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-grid">
          <div className="stat-item reveal">
            <div className="stat-number">38,139</div>
            <div className="stat-label">TUMLU benchmark sualı, 11 fənn üzrə</div>
          </div>
          <div className="stat-item reveal">
            <div className="stat-number">4.6×</div>
            <div className="stat-label">Daha az token, eyni Azərbaycan mətni üçün</div>
          </div>
          <div className="stat-item reveal">
            <div className="stat-number">651M</div>
            <div className="stat-label">Söz — əsas təlim korpusu</div>
          </div>
          <div className="stat-item reveal">
            <div className="stat-number">11</div>
            <div className="stat-label">Qiymətləndirilmiş bilik sahəsi</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="about-grid">
          <div className="about-visual">
            <div className="about-orbit">
              <div className="orbit-dot"></div>
            </div>
            <div className="about-diamond"></div>
          </div>
          <div className="about-content">
            <h2>
              Azərbaycan dilində <span>düşünən</span> süni intellekt
            </h2>
            <p>
              Uzun müddətdir ki, 10 milyondan çox insanın danışdığı Azərbaycan dili süni intellekt tərəfindən kifayət
              qədər diqqət görmürdü. Qlobal modellər ona sonradan əlavə edilmiş bir dil kimi yanaşır, sözləri parçalayır
              və Şərqlə Qərbin kəsişməsində yerləşən bu xalqın zəngin linqvistik irsini tam dərk etmir.
            </p>
            <p>
              ALMAZ bunu dəyişir. Azərbaycan dilinin unikal simvollarını, aqqlütinativ morfologiyasını və mədəni
              kontekstini anlamaq üçün süni intellektin mətn emal metodunu kökündən yenidən işlədik.
            </p>
            <div className="about-features">
              <div className="feature-item">
                <div className="feature-icon">ə</div>
                <div className="feature-text">
                  <h4>Yerli simvol dəstəyi</h4>
                  <p>ə simvolu və Azərbaycan dilinə məxsus hərflərin yüksək səviyyədə tanınması</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Glyph name="morphology" size={22} />
                </div>
                <div className="feature-text">
                  <h4>Morfoloji ustalıq</h4>
                  <p>Mürəkkəb şəkilçilər mənalı vahidlər kimi başa düşülür</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Glyph name="speed" size={22} />
                </div>
                <div className="feature-text">
                  <h4>4.6× daha səmərəli</h4>
                  <p>İnqilabi tokenizator xərcləri kəskin şəkildə azaldır</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Glyph name="domain" size={22} />
                </div>
                <div className="feature-text">
                  <h4>Sahə ekspertizası</h4>
                  <p>Hüquqi, elmi və mədəni biliklər daxil edilmişdir</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Section */}
      <section className="data-section" id="data">
        <div className="section-header">
          <span className="section-label">Təlim bünövrəsi</span>
          <h2>Ən yaxşı Azərbaycan mətnləri üzərində qurulub</h2>
          <p>
            ALMAZ-ın zəkası süni intellekt təlimi üçün indiyə qədər toplanmış ən əhatəli Azərbaycan dili məlumat
            toplusuna əsaslanır.
          </p>
        </div>
        <div className="data-cards">
          {CORPUS.map((item) => (
            <div className="data-card reveal" key={item.title}>
              <span className="data-card-icon">
                <Glyph name={item.glyph} size={30} />
              </span>
              <h3>{item.title}</h3>
              <div className="data-stat">{item.stat}</div>
              <p>{item.body}</p>
              {item.share !== null && (
                <div className="corpus-bar" aria-hidden="true">
                  <i style={{ width: `${(item.share / CORPUS_MAX) * 100}%` }} />
                </div>
              )}
              <div className="corpus-cap">{item.caption}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Benchmark Section */}
      <section className="benchmark" id="benchmarks">
        <div className="benchmark-content">
          <div className="benchmark-text">
            <h2>
              <span>Gold-standard</span> benchmarklar tərəfindən təsdiqlənib
            </h2>
            <p>
              ALMAZ, 11 akademik fənn üzrə 38,139 yerli sualı özündə birləşdirən TUMLU benchmarkı ilə yoxlanılıb.
              Tərcümə yoxdur, süni məlumat yoxdur. Ekspertlər tərəfindən təsdiqlənmiş real Azərbaycan məzmunu.
            </p>
            <ul className="benchmark-list">
              {TARGETS.map((item) => (
                <li key={item.name}>
                  <span className="benchmark-name">{item.name}</span>
                  <span className="benchmark-value">{item.target}</span>
                </li>
              ))}
            </ul>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '1rem', marginBottom: 0 }}>
              Bütün hədəflərə çatıldı. Fərqli ölçü vahidləri olduğu üçün bu göstəricilər sütun kimi deyil, hədəf
              dəyəri ilə göstərilir.
            </p>
          </div>
          <div className="benchmark-visual">
            <div className="benchmark-bars">
              {DISCIPLINES.map((item) => (
                <div className="bar-item reveal" key={item.name}>
                  <div className="bar-label">
                    <span>{item.name}</span>
                    <span>+{item.delta}%</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(item.delta / AXIS_MAX) * 100}%` }} />
                    <span className="bar-zero" aria-hidden="true" />
                  </div>
                </div>
              ))}
              <div className="bar-scale" aria-hidden="true">
                <span>0%</span>
                <span>baseline üzərində fərq</span>
                <span>+{AXIS_MAX}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="applications" id="applications">
        <div className="section-header">
          <span className="section-label">İstifadə sahələri</span>
          <h2>Real dünya təsiri üçün yaradılıb</h2>
          <p>
            Dövlət xidmətlərindən müəssisə avtomatlaşdırılmasına qədər ALMAZ Azərbaycanın rəqəmsal təcrübələrini
            gücləndirir.
          </p>
        </div>
        <div className="apps-grid">
          {APPLICATIONS.map((item) => (
            <div className="app-card reveal" key={item.title}>
              <span className="app-icon">
                <Glyph name={item.glyph} size={30} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-bg"></div>
        <div className="cta-content">
          <h2>
            <span>ALMAZ</span> ilə qurmağa hazırsınız?
          </h2>
          <p>Məhsullarına və xidmətlərinə Azərbaycan dilində süni intellekt gətirən təşkilatlara qoşulun.</p>
          <div className="hero-cta-group">
            <a href="/" className="btn-primary">
              Giriş əldə edin
            </a>
            <a href="mailto:contact@almaz.ai" className="btn-secondary">
              Əlaqə saxlayın
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div>
            <div className="footer-logo">ALMAZ</div>
            <div className="footer-tagline">Azərbaycan dilində danışan AI. Yerli olaraq.</div>
          </div>
          <div className="footer-links">
            <a href="/chinar">Chinar</a>
            <a href="#">Sənədlər</a>
            <a href="#">API İstinad</a>
            <a href="#">Tədqiqat</a>
            <a href="#">Əlaqə</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
