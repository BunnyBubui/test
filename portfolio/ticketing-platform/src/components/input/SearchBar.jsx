import { Search, SearchCheck, XCircle } from "lucide-react";

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  onSearch,
  onClear,
}) {
  return (
    <div className="admin-search-container">
      <Search size={18} />
      <input
        type="text"
        placeholder="ค้นหาด้วยชื่อ, รหัสนักศึกษา หรือเบอร์โทร..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />

      <button className="admin-search-btn" onClick={onSearch}>
        <SearchCheck size={18} /> ค้นหา
      </button>

      {searchTerm && (
        <button className="admin-clear-btn" onClick={onClear}>
          <XCircle size={18} /> ล้าง
        </button>
      )}
    </div>
  );
}
