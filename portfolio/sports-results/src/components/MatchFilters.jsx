// src/components/MatchFilters.jsx
import SortButton from "./SortButton";

const MatchFilters = ({
    filters,
    setFilters,
    sportOptions,
    categoryOptions,
    dateOptions,
    sportIcon,
    categoryIcon,
    dateIcon,
    hideDate = false
}) => {
    return (
        <>
            <div className="filters-header">หมวดหมู่จัดเรียงตาม</div>
            <div className="filters-warpper">
                <div className="filters">

                    <SortButton
                        value={filters.sport}
                        onChange={(value) =>
                            setFilters(f => ({ ...f, sport: value }))
                        }
                        options={sportOptions}
                        placeholder="เลือกกีฬา"
                        position="left"
                    />

                    <SortButton
                        value={filters.category}
                        onChange={(value) =>
                            setFilters(f => ({ ...f, category: value }))
                        }
                        options={categoryOptions}
                        placeholder="เลือกประเภท"
                        position="left"
                    />

                    {!hideDate && (
                        <SortButton
                            value={filters.date}
                            onChange={(value) =>
                                setFilters(f => ({ ...f, date: value }))
                            }
                            options={dateOptions}
                            placeholder="เลือกวัน"
                            position="left"
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default MatchFilters;
