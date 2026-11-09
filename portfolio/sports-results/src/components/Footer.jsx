import "./css/Footer.css";

function Footerbox() {
  return (
    <footer className="footer">
      <a
        href="https://sab.wu.ac.th/?"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-link"
      >
        <h3>องค์การบริหาร องค์การนักศึกษา มหาวิทยาลัยวลัยลักษณ์</h3>
      </a>
      <p>
        อาคารกิจกรรม ชั้น 1 มหาวิทยาลัยวลัยลักษณ์ 222 ไทยบุรี ท่าศาลา
        นครศรีธรรมราช 80160 โทร. 075-476519
      </p>
      <h3 className="footer-author">
        Author : Banyapon Chaithong & IT Team | Copyright &copy;{" "}
        องค์การบริหาร องค์การนักศึกษา มหาวิทยาลัยวลัยลักษณ์
      </h3>
    </footer>
  );
}

export default Footerbox;
