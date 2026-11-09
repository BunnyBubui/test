import "../../styles/button/CategoryButton.css";

const CategoryButton = ({ shop, setShop, shops }) => {
    return (
        <div className="filter-row">

            <button
                onClick={() => setShop("")}
                className={`filter-select-main ${shop === "" ? "filter-active" : ""}`}
            >
                ทุกร้าน
            </button>

            {shops.map((s) => (
                <button
                    key={s.shop_id}
                    onClick={() => setShop(s.shop_id)}
                    className={`filter-select ${shop == s.shop_id ? "filter-active" : ""}`}
                >
                    {s.title}
                </button>
            ))}

        </div>
    );
};

export default CategoryButton;
