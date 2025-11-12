import "../styles/pageFooter.css";

function PageFooter() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Left Column */}
        <div className="left-column">
          <h3>Contact</h3>
          <p>123 Main Street, Ladkrabang, Bangkok 10520</p>
          <p>Tel: +66 99 123 4567</p>
          <p>Email: contact@example.com</p>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <h3>About Us</h3>
          <p>
            This project is built by <strong>SE students</strong> as part of a
            software engineering journey.  
          </p>
          <p>
            Check out the source code on{" "}
            <a
              href="https://github.com/RaphOwO"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SE students. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default PageFooter;