'use client'

import { useEffect, useState } from 'react'
import Glyph from '@/components/Glyph'
import '../landing.css'

/* Chinar: the speech-recognition line. Business-facing copy; every number on the
   page is one we measured on human-transcribed Azerbaijani calls (1,073 clips) or
   on the decode benchmarks, never a vendor's claim. Exact WERs stay out until the
   papers are out; the page states relative and operational facts only. */

const STATS = [
  // Paired on the same 147 human-transcribed call clips (2026-10-13, score_kit.py): Chinar F
  // (F8 v5f, as served) 33.20% WER vs the cloud API 43.29%, difference -10.09 points,
  // 95% CI [-12.79, -7.49]. 10.09 / 43.29 = 23% fewer errors.
  { number: '23%', label: 'daha az səhv — real zəng mərkəzi danışığında, beynəlxalq bulud xidməti ilə müqayisədə' },
  { number: '8 kHz', label: 'telefon səsi üçün xüsusi öyrədilib — studiya yazısı üçün yox' },
  { number: '100%', label: 'məlumat sizin serverlərinizdə qalır — heç bir zəng xaricə göndərilmir' },
  // Chinar P greedy decoding: real-time factor 0.038 on four CPU cores = ~26x faster than real time.
  { number: '26×', label: 'real vaxtdan sürətli — adi prosessorda, GPU olmadan (Chinar P)' },
]

type Model = {
  name: string
  family: string
  tagline: string
  body: string
  points: string[]
  best: string
  accent: string
}

const MODELS: Model[] = [
  {
    name: 'Chinar F',
    family: 'Sürətli transducer',
    tagline: 'Zəng mərkəzləri üçün ən dəqiq seçim',
    body:
      'Real Azərbaycan telefon zəngləri üzərində öyrədilib: səs-küy, bir-birinin sözünü kəsən danışıq, adlar, nömrələr. Yüngül model olduğu üçün minlərlə zəngi aşağı xərclə emal edir.',
    points: [
      'Telefon danışığında ən yüksək dəqiqlik',
      'Kiçik və sürətli — böyük həcmlər üçün ucuz',
      'Real vaxtda və ya toplu emal',
      'Tezliklə: rus dili və dillərarası keçid',
    ],
    best: 'Zənglərin 100% yoxlanılması, analitika, açar söz axtarışı',
    accent: 'var(--gold)',
  },
  {
    name: 'Chinar L',
    family: 'Böyük dil-nitq modeli',
    tagline: 'Oxumağa hazır, səliqəli mətn',
    body:
      'Durğu işarələri, böyük hərflər və rəqəmlərlə yazır: nəticə redaktəsiz protokola, hesabata və ya subtitrə çevrilir. Zənglərdə də yüksək dəqiqlik saxlayır.',
    points: [
      'Durğu işarələri və böyük hərflər',
      'Rəqəmlər rəqəm kimi: məbləğlər, tarixlər, nömrələr',
      'Uzun yazılar: iclaslar, müsahibələr, efirlər',
      'Telefonda Chinar F-ə yaxın dəqiqlik',
    ],
    best: 'İclas protokolları, subtitrlər, hesabatlar, müştəri yazışmaları',
    accent: 'var(--saffron)',
  },
  {
    name: 'Chinar P',
    family: 'Kompakt FastConformer',
    tagline: 'Minimal infrastruktur, sıfır bulud xərci',
    body:
      'Adi server prosessorunda işləyir — videokart tələb etmir. Beynəlxalq bulud xidmətləri səviyyəsində dəqiqliyi öz ofisinizdə, internetsiz təmin edir.',
    points: [
      'GPU tələb etmir: real vaxtdan ~26 dəfə sürətli',
      'Durğu işarələri və böyük hərflərlə yazır',
      'Bulud xidmətləri səviyyəsində dəqiqlik',
      'Filiallar, kiçik ofislər, qapalı şəbəkələr',
    ],
    best: 'Kiçik komandalar, filiallar, internetə çıxışı olmayan sistemlər',
    accent: 'var(--accent-teal)',
  },
]

const BENEFITS = [
  {
    glyph: 'phone' as const,
    title: 'Hər zəngə nəzarət, seçmə yox',
    body: 'Keyfiyyət şöbəsi zənglərin bir neçə faizini deyil, hamısını yoxlayır: skript pozuntuları, kobudluq, həll olunmamış müraciətlər avtomatik tapılır.',
  },
  {
    glyph: 'speech' as const,
    title: 'Müştərinin səsi — rəqəmlərdə',
    body: 'Hər zəng axtarıla bilən mətnə çevrilir. Şikayətlərin, məhsul adlarının və rəqiblərin nə qədər tez-tez çəkildiyini həftə yox, gün ərzində görün.',
  },
  {
    glyph: 'speed' as const,
    title: 'Operatorlar üçün daha az yazı işi',
    body: 'Zəngin mətni və ALMAZ ilə qısa xülasəsi CRM-ə avtomatik düşür. Operator növbəti müştəriyə daha tez keçir.',
  },
  {
    glyph: 'shield' as const,
    title: 'Məlumat suverenliyi',
    body: 'Modellər sizin infrastrukturunuzda işləyir. Müştəri zəngləri, şəxsi məlumatlar və kommersiya sirləri təşkilatdan kənara çıxmır.',
  },
  {
    glyph: 'legal' as const,
    title: 'Uyğunluq və audit',
    body: 'Razılaşmaların, açıqlamaların və hüquqi xəbərdarlıqların həqiqətən səsləndiyini sübut edin — mətn axtarışı ilə, saatlarla dinləmədən.',
  },
  {
    glyph: 'domain' as const,
    title: 'Proqnozlaşdırıla bilən xərc',
    body: 'Dəqiqəyə görə ödəniş yoxdur. Həcm artdıqca xərc artmır — eyni server daha çox zəng emal edir.',
  },
]

/* A model-picker, not a leaderboard: the three are compared on what a buyer chooses
   between, so the cells are words, not scores. */
const COMPARE: { row: string; f: string; l: string; p: string }[] = [
  { row: 'Telefon zənglərində dəqiqlik', f: 'Ən yüksək', l: 'Yüksək', p: 'Bulud səviyyəsində' },
  { row: 'Oxunaqlı mətn (durğu, rəqəm)', f: 'Əsas', l: 'Ən yaxşı', p: 'Yaxşı' },
  { row: 'Avadanlıq', f: 'CPU və ya GPU', l: 'GPU', p: 'Yalnız CPU' },
  { row: 'Böyük həcmlərdə xərc', f: 'Ən aşağı', l: 'Orta', p: 'Aşağı' },
]

export default function ChinarPage() {
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
            <a href="/about">Haqqımızda</a>
          </li>
          <li>
            <a href="/chinar" style={{ color: 'var(--gold)' }}>
              Chinar
            </a>
          </li>
          <li>
            <a href="#models" onClick={(e) => handleNavClick(e, 'models')}>
              Modellər
            </a>
          </li>
          <li>
            <a href="#benefits" onClick={(e) => handleNavClick(e, 'benefits')}>
              Biznes üçün
            </a>
          </li>
        </ul>
        <a href="mailto:contact@almaz.ai?subject=Chinar%20pilot" className="nav-cta">
          Pilot
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

      {/* Header */}
      <section
        style={{
          minHeight: '46vh',
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
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
          <span className="section-label" style={{ marginBottom: '1.5rem', display: 'block' }}>
            Chinar · nitqin tanınması
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
            Hər zəng —{' '}
            <span
              style={{
                background: 'linear-gradient(96deg, var(--gold), var(--saffron))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              axtarıla bilən
            </span>
            <br />
            məlumat
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1.15rem',
              color: 'var(--silver)',
              fontWeight: 300,
              lineHeight: 1.7,
              marginBottom: '2.25rem',
            }}
          >
            Azərbaycan nitqini mətnə çevirən üç model. Real Azərbaycan zəngləri üzərində öyrədilib və sizin
            serverlərinizdə işləyir — müştəri məlumatı heç vaxt təşkilatdan çıxmır.
          </p>
          <div className="hero-cta-group" style={{ justifyContent: 'center' }}>
            <a href="mailto:contact@almaz.ai?subject=Chinar%20pilot" className="btn-primary">
              Öz zənglərinizdə sınayın
            </a>
            <a href="#models" className="btn-secondary" onClick={(e) => handleNavClick(e, 'models')}>
              Modelləri müqayisə edin
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="stats-grid">
          {STATS.map((item) => (
            <div className="stat-item reveal" key={item.number}>
              <div className="stat-number">{item.number}</div>
              <div className="stat-label">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Models */}
      <section className="data-section" id="models">
        <div className="section-header">
          <span className="section-label">Modellər</span>
          <h2>Üç model, bir məqsəd: dəqiq Azərbaycan mətni</h2>
          <p>
            Hər biri fərqli biznes ehtiyacı üçün qurulub. Birini seçin, ya da birlikdə istifadə edin: Chinar F
            bütün zəngləri emal edir, Chinar L vacib olanları oxunaqlı protokola çevirir.
          </p>
        </div>
        <div className="data-cards">
          {MODELS.map((m) => (
            <div className="data-card reveal" key={m.name} style={{ borderTop: `2px solid ${m.accent}` }}>
              <span className="data-card-icon" style={{ color: m.accent }}>
                <Glyph name="speech" size={30} />
              </span>
              <div className="corpus-cap" style={{ marginBottom: '0.35rem' }}>
                {m.family}
              </div>
              <h3>{m.name}</h3>
              <div className="data-stat" style={{ fontSize: '1.05rem' }}>
                {m.tagline}
              </div>
              <p>{m.body}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem' }}>
                {m.points.map((pt) => (
                  <li
                    key={pt}
                    style={{
                      display: 'flex',
                      gap: '0.6rem',
                      color: 'var(--silver)',
                      fontSize: '0.92rem',
                      lineHeight: 1.5,
                      marginBottom: '0.45rem',
                    }}
                  >
                    <span aria-hidden="true" style={{ color: m.accent }}>
                      ◆
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="corpus-cap">
                <strong style={{ color: 'var(--pearl)', fontWeight: 500 }}>Ən yaxşı seçim: </strong>
                {m.best}
              </div>
            </div>
          ))}
        </div>

        {/* Model picker */}
        <div className="reveal" style={{ maxWidth: '960px', margin: '3.5rem auto 0', overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.95rem',
              minWidth: '560px',
            }}
          >
            <caption
              style={{ captionSide: 'top', textAlign: 'left', color: 'var(--muted)', fontSize: '0.85rem', padding: '0 0 0.75rem' }}
            >
              Hansı model sizin üçündür?
            </caption>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--muted)', fontWeight: 400 }} />
                {['Chinar F', 'Chinar L', 'Chinar P'].map((n) => (
                  <th
                    key={n}
                    scope="col"
                    style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--pearl)', fontWeight: 600 }}
                  >
                    {n}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((r) => (
                <tr key={r.row} style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <th scope="row" style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--silver)', fontWeight: 400 }}>
                    {r.row}
                  </th>
                  <td style={{ padding: '0.75rem', color: 'var(--pearl)' }}>{r.f}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--pearl)' }}>{r.l}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--pearl)' }}>{r.p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Business benefits */}
      <section className="applications" id="benefits">
        <div className="section-header">
          <span className="section-label">Biznes üçün</span>
          <h2>Səsdən qərara qədər</h2>
          <p>
            Zəng mərkəzinin danışıqları şirkətin ən böyük, amma ən az istifadə olunan məlumat mənbəyidir. Chinar onu
            oxunan, axtarılan və ölçülən məlumata çevirir.
          </p>
        </div>
        <div className="apps-grid">
          {BENEFITS.map((item) => (
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

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-bg"></div>
        <div className="cta-content">
          <h2>
            <span>Öz zənglərinizdə</span> yoxlayın
          </h2>
          <p>
            Bir neçə yüz zəng göndərin — Chinar-ın nəticəsini mövcud həllinizlə eyni səslər üzərində müqayisə edək.
            Səs yazıları yalnız sınaq üçün istifadə olunur və sonra silinir.
          </p>
          <div className="hero-cta-group">
            <a href="mailto:contact@almaz.ai?subject=Chinar%20pilot" className="btn-primary">
              Pilot layihə istəyin
            </a>
            <a href="/about" className="btn-secondary">
              ALMAZ haqqında
            </a>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '2rem', marginBottom: 0 }}>
            Dəqiqlik insanlar tərəfindən yazılmış real Azərbaycan zəng mərkəzi danışıqlarında, söz səhvi nisbəti (WER)
            ilə ölçülüb.
          </p>
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
            <a href="/about">Haqqımızda</a>
            <a href="/chinar">Chinar</a>
            <a href="mailto:contact@almaz.ai">Əlaqə</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
