import { useNavigate } from "react-router-dom";
import type { Advertisement } from "../../types/ad";

interface Props {
  ad: Advertisement;
}

const AdCard = ({ ad }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/item/${ad.id}`)}
      style={{
        display: "flex",
        gap: "12px",
        padding: "12px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "0.2s",
      }}
    >
      <img
        src={ad.images[0]}
        alt={ad.title}
        style={{
          width: "90px",
          height: "90px",
          borderRadius: "6px",
          objectFit: "cover",
        }}
      />

      <div style={{ flexGrow: 1 }}>
        <div style={{ fontSize: "18px", fontWeight: 600 }}>{ad.title}</div>
        <div style={{ marginTop: "4px" }}>{ad.price} ₽</div>

        <div style={{ fontSize: "14px", marginTop: "4px", color: "#555" }}>
          {ad.category} · {new Date(ad.createdAt).toLocaleDateString()}
        </div>

        <div style={{ marginTop: "6px", display: "flex", gap: "6px" }}>
          <span
            style={{
              padding: "2px 6px",
              fontSize: "12px",
              borderRadius: "4px",
              background:
                ad.status === "approved"
                  ? "#d4f7d4"
                  : ad.status === "rejected"
                  ? "#f7d4d4"
                  : ad.status === "pending"
                  ? "#f7f3d4"
                  : "#eee",
            }}
          >
            {ad.status}
          </span>

          {ad.priority === "urgent" && (
            <span
              style={{
                padding: "2px 6px",
                fontSize: "12px",
                borderRadius: "4px",
                background: "#ffcccc",
              }}
            >
              срочно
            </span>
          )}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/item/${ad.id}`);
        }}
        style={{
          alignSelf: "center",
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid #aaa",
          background: "#f7f7f7",
          cursor: "pointer",
        }}
      >
        Открыть →
      </button>
    </div>
  );
};

export default AdCard;
