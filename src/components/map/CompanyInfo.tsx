import { FiNavigation, FiWind, FiMap, FiCamera, FiGlobe, FiLayers, FiUsers, FiAward, FiCompass } from "react-icons/fi";

const services = [
  { Icon: FiNavigation, title: "Aerial LiDAR",             desc: "A LiDAR system uses a laser sensor with a GPS receiver and INS unit for precise terrain mapping." },
  { Icon: FiWind,       title: "UAV Mapping",              desc: "GIS-based UAV surveys capture, store and analyse spatially referenced mapping data efficiently." },
  { Icon: FiMap,        title: "Mobile LiDAR",             desc: "Mobile LiDAR offers numerous benefits over conventional ground surveys and aerial mapping." },
  { Icon: FiCamera,     title: "Ortho Photography",        desc: "Aerial LiDAR topography with rectified orthophotography and direct geo-references." },
  { Icon: FiLayers,     title: "Digital Photogrammetry",   desc: "State-of-the-art facilities covering a wide range of photogrammetric service requirements." },
  { Icon: FiGlobe,      title: "GIS",                      desc: "Tools to capture, store, analyse and manage spatially referenced geographic mapping data." }
];

const stats = [
  { Icon: FiAward,   value: "15+",  label: "Years" },
  { Icon: FiLayers,  value: "200+", label: "Projects" },
  { Icon: FiUsers,   value: "40+",  label: "Experts" },
  { Icon: FiCompass, value: "18+",  label: "Countries" }
];

export default function CompanyInfo() {
  return (
    <div style={s.page}>
      <div style={s.wrap}>

        {/* HEADING */}
        <div style={s.headWrap}>
          <p style={s.eyebrow}>Dharni Geospatial Technologies</p>
          <h1 style={s.heading}>Welcome to Geospatial Consulting Services</h1>
          <div style={s.bar} />
        </div>

        {/* MAIN GRID */}
        <div style={s.grid}>

          {/* LEFT */}
          <div style={s.card}>
            <div style={s.logoRow}>
              <div style={s.iconBox}><FiGlobe size={20} color="#f5a623" /></div>
              <div>
                <div style={s.coName}>Dharni Geospatial</div>
                <a href="https://www.dharanigeospatialtechnologies.com/" target="_blank" rel="noreferrer" style={s.link}>
                  dharanigeospatialtechnologies.com ↗
                </a>
              </div>
            </div>

            <div style={s.divider} />

            <p style={s.body} >
           From Inception, our company engages well experienced domain expertise to provide customized and innovative Geospatial services. We hire the most capable resources, provide continuous technical training and ensure them to be updated with latest technology, so that they can deliver superior value to our global clients.
            </p>
            <p style={s.body}> We have executed several complex projects and earned industry reputation for delivering high quality products under demanding and stipulated deadlines. Our commitment is to set technical standards in the industry and deliver reliable and accurate services to global clientele.
</p>
            <p style={s.body}>
              We enable clients to execute projects successfully through our specialized staff
              and strategic partners worldwide.
            </p>

            {/* STATS */}
            <div style={s.statsRow}>
              {stats.map(({ Icon, value, label }) => (
                <div key={label} style={s.statItem}>
                  <Icon size={15} color="#f5a623" />
                  <div style={s.statVal}>{value}</div>
                  <div style={s.statLbl}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div style={s.servicesCol}>
            <div style={s.eyebrow2}>OUR SERVICES</div>
            <div style={s.servicesGrid}>
              {services.map(({ Icon, title, desc }) => (
                <div key={title} style={s.sCard}>
                  <div style={s.sIconBox}><Icon size={17} color="#f5a623" /></div>
                  <div>
                    <div style={s.sTitle}>{title}</div>
                    <div style={s.sDesc}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* CTA */}
        <div style={s.bottom}>
          <button
            style={s.btn}
            onMouseEnter={e => (e.currentTarget.style.background = "#d4891a")}
            onMouseLeave={e => (e.currentTarget.style.background = "#f5a623")}
          >
            <FiMap size={15} style={{ marginRight: 8 }} />
            Explore Map View
          </button>
        </div>

      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    width: "100%", minHeight: "100vh",
    display: "flex", justifyContent: "center", alignItems: "center",
    color: "white", fontFamily: "Inter, Segoe UI, sans-serif",
    padding: "40px 20px", boxSizing: "border-box"
  },
  wrap: { width: "100%", maxWidth: 1040 },

  /* heading */
  headWrap: { textAlign: "center", marginBottom: 36 },
  eyebrow: { fontSize: 12, fontWeight: 600, color: "white", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" },
  heading: { fontSize: 24, fontWeight: 800, color: "#f5a623", margin: "0 0 10px", letterSpacing: 0.5 },
  bar: { width: 56, height: 3, background: "linear-gradient(90deg,#f5a623,#ffd25a)", borderRadius: 4, margin: "0 auto" },

  /* grid */
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },

  /* left card */
  card: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(245,166,35,0.18)",
    borderRadius: 12, padding: "22px 22px", boxSizing: "border-box"
  },
  logoRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 14 },
  iconBox: {
    width: 38, height: 38, borderRadius: 8,
    background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
  },
  coName: { fontSize: 15, fontWeight: 700, color: "#f5a623" },
  link: { color: "white", fontSize: 11, textDecoration: "none" },
  divider: { height: 1, background: "rgba(245,166,35,0.15)", margin: "0 0 14px" },
  body: { color: "white", fontSize: 13, lineHeight: 1.65, marginBottom: 10 },

  /* stats */
  statsRow: {
    display: "grid", gridTemplateColumns: "repeat(4,1fr)",
    gap: 8, marginTop: 18, paddingTop: 16,
    borderTop: "1px solid rgba(245,166,35,0.12)"
  },
  statItem: { textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 },
  statVal: { fontSize: 20, fontWeight: 800, color: "#f5a623" },
  statLbl: { fontSize: 10, color: "white" },

  /* services */
  servicesCol: { display: "flex", flexDirection: "column", gap: 10 },
  eyebrow2: { fontSize: 11, fontWeight: 700, color: "white", letterSpacing: 2 },
  servicesGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, flex: 1 },
  sCard: {
    display: "flex", alignItems: "flex-start", gap: 10,
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 9, padding: "13px 13px"
  },
  sIconBox: {
    width: 32, height: 32, borderRadius: 7,
    background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.18)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
  },
  sTitle: { fontSize: 12, fontWeight: 700, color: "#ffd25a", marginBottom: 4, letterSpacing: 0.4 },
  sDesc: { fontSize: 12, color: "white", lineHeight: 1.55 },

  /* cta */
  bottom: { marginTop: 28, textAlign: "center" },
  btn: {
    background: "#f5a623", border: "none", padding: "11px 30px",
    fontSize: 14, fontWeight: 600, color: "white", borderRadius: 8,
    cursor: "pointer", transition: "background 0.2s",
    display: "inline-flex", alignItems: "center"
  }
};