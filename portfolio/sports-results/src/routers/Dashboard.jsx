import Nav from "../components/Nav";
import HamburgerMenu from "../components/HamburgerMenu";
import AddMatchResults from "../components/AddMatchResults";
import AddMedals from "../components/AddMedals";
import HeaderTitle from "../components/HeaderTitle";
import { useState } from "react";
import "./css/Dashboard.css";

const ResultsDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState("dashboard");

  return (
    <div className="results-layout">
      <HamburgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <div className="results-main">
        <Nav
          toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
          isMenuOpen={isMenuOpen}
        />

        <div className="results-content">
          {view === "dashboard" && (
            <>
              <HeaderTitle title="บันทึกผลการแข่งขัน" hideLogo />
              <p className="dashboard-desc">เลือกประเภทการบันทึกผล</p>

              <div className="dashboard-grid">
                <div
                  className="dashboard-card"
                  onClick={() => setView("matches")}
                >
                  <h3>🏆 บันทึกผลการแข่งขัน</h3>
                  <p>บาส / ฟุตบอล / แบด / วอลเลย์</p>
                </div>

                <div
                  className="dashboard-card"
                  onClick={() => setView("medals")}
                >
                  <h3>🥇 บันทึกเหรียญ</h3>
                  <p>Gold / Silver / Bronze</p>
                </div>
              </div>
            </>
          )}

          {/* ===== MATCH RESULTS ===== */}
          {view === "matches" && (
            <>
              <BackButton onClick={() => setView("dashboard")} />
              <AddMatchResults />
            </>
          )}

          {/* ===== MEDALS ===== */}
          {view === "medals" && (
            <>
              <BackButton onClick={() => setView("dashboard")} />
              <AddMedals />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ===== ปุ่มย้อนกลับ ===== */
const BackButton = ({ onClick }) => (
  <button className="back-button" onClick={onClick}>
    ← กลับ
  </button>
);

export default ResultsDashboard;
