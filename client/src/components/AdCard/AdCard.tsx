import { Link } from "react-router-dom";
import type { Advertisement } from "../../types/ad";

interface Props {
  ad: Advertisement;
}

const STATUS_LABEL: Record<Advertisement["status"], string> = {
  pending: "На модерации",
  approved: "Одобрено",
  rejected: "Отклонено",
  draft: "Черновик",
};

const AdCard = ({ ad }: Props) => {
  const created = new Date(ad.createdAt).toLocaleDateString();
  const priorityLabel = ad.priority === "urgent" ? "Срочное" : "Обычное";

  return (
    <article className="ad-card">
      <div className="ad-card-media">
        <img
          src={ad.images[0]}
          alt={ad.title}
          className="ad-card-image"
        />
      </div>

      <div className="ad-card-body">
        <header className="ad-card-header">
          <div>
            <h3 className="ad-card-title">{ad.title}</h3>
            <div className="ad-card-meta">
              <span>{ad.category}</span>
              <span className="dot" />
              <span>{created}</span>
            </div>
          </div>
          <div className="ad-card-price">
            {ad.price.toLocaleString()} ₽
          </div>
        </header>

        <div className="ad-card-tags">
          <span className={`badge badge--status badge--status-${ad.status}`}>
            {STATUS_LABEL[ad.status]}
          </span>
          <span
            className={
              "badge badge--priority" +
              (ad.priority === "urgent" ? " badge--priority-urgent" : "")
            }
          >
            {priorityLabel}
          </span>
        </div>

        <footer className="ad-card-footer">
          <span className="muted">ID {ad.id}</span>
          <Link to={`/item/${ad.id}`} className="btn btn-primary btn-sm">
            Открыть →
          </Link>
        </footer>
      </div>
    </article>
  );
};

export default AdCard;
