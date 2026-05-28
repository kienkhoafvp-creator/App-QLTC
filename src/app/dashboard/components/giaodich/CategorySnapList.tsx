"use client";

import { useRef, useEffect, useState } from "react";
import { TransactionMode } from "./AppTheme";

export interface Category {
  id: string;
  name: string;
  icon: string;
  group: string;
}

// ─── EXPENSE CATEGORIES ────────────────────────────────────────────────────────
export const EXPENSE_CATEGORIES: Category[] = [
  // Ăn uống & Cà phê
  { id: "an-uong", name: "Ăn uống", icon: "🍜", group: "Ăn uống & Cà phê" },
  { id: "ca-phe", name: "Cà phê", icon: "☕", group: "Ăn uống & Cà phê" },
  { id: "nuoc-uong", name: "Nước uống", icon: "🧋", group: "Ăn uống & Cà phê" },
  { id: "an-ngoai", name: "Ăn ngoài", icon: "🍱", group: "Ăn uống & Cà phê" },

  // Di chuyển
  { id: "xang-xe", name: "Xăng xe", icon: "⛽", group: "Di chuyển" },
  { id: "sua-xe", name: "Sửa xe", icon: "🔧", group: "Di chuyển" },
  { id: "grab", name: "Grab/Taxi", icon: "🚕", group: "Di chuyển" },
  { id: "gui-xe", name: "Gửi xe", icon: "🅿️", group: "Di chuyển" },

  // Tiện ích
  { id: "tien-dien", name: "Điện", icon: "⚡", group: "Tiện ích" },
  { id: "tien-nuoc", name: "Nước", icon: "💧", group: "Tiện ích" },
  { id: "gas", name: "Gas", icon: "🔥", group: "Tiện ích" },
  { id: "internet", name: "Internet", icon: "📶", group: "Tiện ích" },
  { id: "dien-thoai", name: "Điện thoại", icon: "📱", group: "Tiện ích" },

  // Nhà cửa
  { id: "thue-nha", name: "Thuê nhà", icon: "🏠", group: "Nhà cửa" },
  { id: "sua-chua", name: "Sửa chữa", icon: "🔨", group: "Nhà cửa" },
  { id: "do-dung", name: "Đồ dùng", icon: "🛋️", group: "Nhà cửa" },

  // Sức khỏe
  { id: "thuoc", name: "Thuốc", icon: "💊", group: "Sức khỏe" },
  { id: "kham-benh", name: "Khám bệnh", icon: "🏥", group: "Sức khỏe" },
  { id: "the-thao", name: "Thể thao", icon: "🏋️", group: "Sức khỏe" },

  // Mua sắm
  { id: "quan-ao", name: "Quần áo", icon: "👗", group: "Mua sắm" },
  { id: "my-pham", name: "Mỹ phẩm", icon: "💄", group: "Mua sắm" },
  { id: "dien-tu", name: "Điện tử", icon: "💻", group: "Mua sắm" },
  { id: "tap-hoa", name: "Tạp hóa", icon: "🛒", group: "Mua sắm" },

  // Giải trí
  { id: "phim", name: "Xem phim", icon: "🎬", group: "Giải trí" },
  { id: "game", name: "Game", icon: "🎮", group: "Giải trí" },
  { id: "du-lich", name: "Du lịch", icon: "✈️", group: "Giải trí" },
  { id: "am-nhac", name: "Âm nhạc", icon: "🎵", group: "Giải trí" },

  // Kinh doanh
  { id: "nhap-hang", name: "Nhập hàng", icon: "📦", group: "Kinh doanh" },
  { id: "ship-hang", name: "Ship hàng", icon: "🚚", group: "Kinh doanh" },
  { id: "marketing", name: "Marketing", icon: "📣", group: "Kinh doanh" },
  { id: "van-phong", name: "Văn phòng", icon: "🏢", group: "Kinh doanh" },
  { id: "luong-nv", name: "Lương NV", icon: "👥", group: "Kinh doanh" },

  // Giáo dục
  { id: "hoc-phi", name: "Học phí", icon: "📚", group: "Giáo dục" },
  { id: "khoa-hoc", name: "Khóa học", icon: "🎓", group: "Giáo dục" },
  { id: "sach", name: "Sách", icon: "📖", group: "Giáo dục" },

  // Khác
  { id: "bao-hiem", name: "Bảo hiểm", icon: "🛡️", group: "Khác" },
  { id: "qua-tang", name: "Quà tặng", icon: "🎁", group: "Khác" },
  { id: "tu-thien", name: "Từ thiện", icon: "❤️", group: "Khác" },
  { id: "khac-chi", name: "Khác", icon: "📌", group: "Khác" },
];

// ─── INCOME CATEGORIES ─────────────────────────────────────────────────────────
export const INCOME_CATEGORIES: Category[] = [
  { id: "luong", name: "Lương", icon: "💼", group: "Thu nhập chính" },
  { id: "thuong", name: "Thưởng", icon: "🏆", group: "Thu nhập chính" },
  { id: "phu-cap", name: "Phụ cấp", icon: "💳", group: "Thu nhập chính" },
  { id: "lam-them", name: "Làm thêm", icon: "⏱️", group: "Thu nhập chính" },

  { id: "ban-hang", name: "Bán hàng", icon: "🛍️", group: "Kinh doanh" },
  { id: "doanh-thu", name: "Doanh thu", icon: "📈", group: "Kinh doanh" },
  { id: "hoa-hong", name: "Hoa hồng", icon: "💹", group: "Kinh doanh" },

  { id: "lai-dau-tu", name: "Lãi đầu tư", icon: "📊", group: "Đầu tư" },
  { id: "co-tuc", name: "Cổ tức", icon: "🏦", group: "Đầu tư" },
  { id: "cho-thue", name: "Cho thuê", icon: "🏘️", group: "Đầu tư" },

  { id: "qua-bieu", name: "Quà biếu", icon: "🎀", group: "Khác" },
  { id: "hoan-tien", name: "Hoàn tiền", icon: "🔄", group: "Khác" },
  { id: "khac-thu", name: "Khác", icon: "📌", group: "Khác" },
];

interface Props {
  mode: TransactionMode;
  selectedId: string;
  onSelect: (cat: Category) => void;
  extraCategories?: Category[];
  onAddCategory?: (cat: Category) => void;
}

export default function CategorySnapList({ mode, selectedId, onSelect, extraCategories = [], onAddCategory }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const accent = mode === "chi" ? "#FF6B35" : "#00C896";
  const baseCategories = mode === "chi" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const categories = [...baseCategories, ...extraCategories];
  const [isAdding, setIsAdding] = useState(false);
  const [newGroup, setNewGroup] = useState("");
  const [newName, setNewName] = useState("");

  // Group categories
  const groups = categories.reduce<Record<string, Category[]>>((acc, cat) => {
    if (!acc[cat.group]) acc[cat.group] = [];
    acc[cat.group].push(cat);
    return acc;
  }, {});

  const [activeGroup, setActiveGroup] = useState(Object.keys(groups)[0]);

  useEffect(() => {
    const groupNames = Object.keys(groups);
    if (!groupNames.length) return;
    if (!activeGroup || !groups[activeGroup]) setActiveGroup(groupNames[0]);
  }, [activeGroup, groups]);

  const handleAddCategory = () => {
    const group = newGroup.trim();
    const name = newName.trim();
    if (!group || !name || !onAddCategory) return;

    const cat: Category = {
      id: `custom-${Date.now()}`,
      name,
      icon: "📌",
      group,
    };

    onAddCategory(cat);
    setActiveGroup(group);
    setNewGroup("");
    setNewName("");
    setIsAdding(false);
  };

  // Snap selected to center
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !selectedId) return;
    const el = container.querySelector(`[data-cat-id="${selectedId}"]`) as HTMLElement;
    if (!el) return;
    container.scrollTo({
      left: el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2,
      behavior: "smooth",
    });
  }, [selectedId]);

  // Hide add form when clicking/touching outside the component
  useEffect(() => {
    const handler = (e: Event) => {
      if (!isAdding) return;
      const target = e.target as Node | null;
      if (rootRef.current && target && !rootRef.current.contains(target)) {
        setIsAdding(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [isAdding]);

  return (
    <div ref={rootRef} className="flex flex-col gap-2">
      <div className="px-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B9BB4]">🏷️ Hạng mục</span>
          {selectedId && (
            <span className="text-[11px] font-bold" style={{ color: accent }}>
              {categories.find((c) => c.id === selectedId)?.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAdding((s) => !s)}
            className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-lg hover:bg-slate-600"
            aria-label="Thêm hạng mục"
          >
            +
          </button>
        </div>
      </div>

      {/* Group filter tabs – LinkedIn style */}

      <div
        className="flex gap-2 px-3 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {Object.keys(groups).map((g) => (
          <button
            key={g}
            onClick={() => setActiveGroup(g)}
            className={[
              "flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-bold border transition-all duration-200",
              activeGroup === g
                ? "text-white border-transparent"
                : "text-[#8B9BB4] bg-[#1C2333] border-[#2A3550] hover:text-white",
            ].join(" ")}
            style={
              activeGroup === g
                ? { background: accent, borderColor: accent, boxShadow: `0 0 12px ${accent}55` }
                : {}
            }
          >
            {g}
          </button>
        ))}
      </div>

      {/* Inline add form */}
      {isAdding && (
        <div className="px-3 mt-2 grid grid-cols-[1fr_1fr_min-content] gap-2 items-center">
          <input
            placeholder="Chủ đề (ví dụ: Nhà cửa)"
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-full px-3 py-1 text-sm text-white"
          />
          <input
            placeholder="Tên hạng mục (ví dụ: Thuê nhà)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-full px-3 py-1 text-sm text-white"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-sm font-bold"
          >
            Thêm
          </button>
        </div>
      )}

      {/* Categories scroll – snap center */}
      <div
        ref={scrollRef}
        className="flex gap-3 px-3 pb-2 overflow-x-auto"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
          {(groups[activeGroup] || []).map((cat) => {
            const active = cat.id === selectedId;
            return (
              <button
                key={cat.id}
                data-cat-id={cat.id}
                onClick={() => onSelect(cat)}
                className={[
                  "flex-shrink-0 flex flex-col items-center gap-1 rounded-2xl px-2 py-2 min-w-[64px] border transition-all duration-200 active:scale-95",
                  active
                    ? "border-transparent text-white"
                    : "bg-[#1C2333] border-[#2A3550] text-[#8B9BB4] hover:text-white hover:border-[#4A5568]",
                ].join(" ")}
                style={{
                  scrollSnapAlign: "center",
                  scrollSnapStop: "always",
                  ...(active ? { background: `${accent}22`, borderColor: accent, boxShadow: `0 0 18px ${accent}44` } : {}),
                }}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="text-[11px] font-bold text-center leading-tight mt-1">{cat.name}</span>
                {active && (
                  <div
                    className="w-5 h-1 rounded-full mt-2"
                    style={{ background: accent }}
                  />
                )}
              </button>
            );
          })}
      </div>
    </div>
  );
}
