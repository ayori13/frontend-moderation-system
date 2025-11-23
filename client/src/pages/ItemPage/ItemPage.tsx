import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdById, getAds, approveAd, rejectAd, requestChanges } from "../../api/ads";
import "./ItemPage.css";

const ACTION_REASONS = [
  "Запрещенный товар",
  "Неверная категория",
  "Некорректное описание",
  "Проблемы с фото",
  "Подозрение на мошенничество",
  "Другое",
];

type ModalMode = "reject" | "request" | null;

const ItemPage = () => {
  const { id } = useParams();
  const adId = Number(id);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [imgIndex, setImgIndex] = useState(0);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [comment, setComment] = useState("");

  const adQuery = useQuery({
    queryKey: ["ad", adId],
    queryFn: () => getAdById(adId),
  });

  const listQuery = useQuery({
    queryKey: ["all-ads"],
    queryFn: () => getAds({ limit: 9999 }),
  });

  const approve = useMutation({
    mutationFn: () => approveAd(adId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ad", adId] }),
  });

  const reject = useMutation({
    mutationFn: () => rejectAd(adId, selectedReason, comment),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ad", adId] });
      closeModal();
    },
  });

  const request = useMutation({
    mutationFn: () => requestChanges(adId, selectedReason, comment),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ad", adId] });
      closeModal();
    },
  });

  const openModal = (mode: ModalMode) => {
    setModalMode(mode);
    setSelectedReason(ACTION_REASONS[0]);
    setComment("");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedReason("");
    setComment("");
  };

  const handleSubmit = () => {
    if (!selectedReason) return;
    if (modalMode === "reject") reject.mutate();
    if (modalMode === "request") request.mutate();
  };

  if (adQuery.isLoading || listQuery.isLoading)
    return <div style={{ padding: 20 }}>Загрузка…</div>;
  if (adQuery.isError || !adQuery.data)
    return <div style={{ padding: 20 }}>Объявление не найдено</div>;

  const ad = adQuery.data;
  const images = ad.images ?? [];

  const nextImg = () => setImgIndex((i) => (i + 1 < images.length ? i + 1 : 0));
  const prevImg = () => setImgIndex((i) => (i - 1 >= 0 ? i - 1 : images.length - 1));

  const adsList = listQuery.data?.ads ?? [];
  const index = adsList.findIndex((a) => a.id === adId);
  const prevAd = index > 0 ? adsList[index - 1] : null;
  const nextAd = index < adsList.length - 1 ? adsList[index + 1] : null;

  return (
    <div className="page page-layout page-item">
      <div className="page-content">
        <div className="panel panel-gallery">
          {images.length ? (
            <div className="gallery-wrapper">
              <img src={images[imgIndex]} className="gallery-image" />

              {images.length > 1 && (
                <>
                  <button className="gallery-arrow left" onClick={prevImg}>‹</button>
                  <button className="gallery-arrow right" onClick={nextImg}>›</button>
                </>
              )}
            </div>
          ) : (
            <div className="no-image">Нет изображений</div>
          )}
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">{ad.title}</div>
          </div>
          <div className="panel-body ad-description">
            <div className="ad-price">{ad.price} ₽</div>
            <div className="ad-meta">
              Категория: {ad.category} · {new Date(ad.createdAt).toLocaleDateString()}
            </div>
            <p>{ad.description}</p>
          </div>
        </div>

        {ad.characteristics && (
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Характеристики</div>
            </div>
            <div className="panel-body">
              <div className="char-grid">
                {Object.entries(ad.characteristics).map(([k, v]) => (
                  <div key={k} className="char-row">
                    <div className="char-key">{k}</div>
                    <div className="char-value">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="page-sidebar">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Продавец</div>
          </div>
          <div className="panel-body seller">
            <strong>{ad.seller.name}</strong>
            <div className="muted">Рейтинг: {ad.seller.rating}</div>
            <div className="muted">Объявлений: {ad.seller.totalAds}</div>
            <div className="muted">
              На сайте с {new Date(ad.seller.registeredAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Действия</div>
          </div>

          <div className="panel-body mod-actions">
            <button className="btn btn-approve" onClick={() => approve.mutate()}>
              Одобрить
            </button>

            <button className="btn btn-reject" onClick={() => openModal("reject")}>
              Отклонить
            </button>

            <button className="btn btn-request" onClick={() => openModal("request")}>
              На доработку
            </button>

            <button className="btn btn-ghost" onClick={() => navigate("/list")}>
              ← Назад
            </button>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">История модерации</div>
          </div>
          <div className="panel-body history-grid">
            {ad.moderationHistory?.length ? (
              [...ad.moderationHistory].reverse().map((m) => (
                <div key={m.id} className="history-item">
                  <div className="history-top">
                    <strong>{m.action}</strong> — {m.moderatorName}
                  </div>
                  {m.reason && <div className="history-reason">Причина: {m.reason}</div>}
                  {m.comment && <div className="history-comment">{m.comment}</div>}
                  <div className="history-date">{new Date(m.timestamp).toLocaleString()}</div>
                </div>
              ))
            ) : (
              <div className="muted">Нет истории.</div>
            )}
          </div>
        </div>
      </div>

      {/* ---- НАВИГАЦИЯ В САМОМ НИЗУ ---- */}
      <div className="bottom-nav">
        <button className="btn btn-ghost" disabled={!prevAd} onClick={() => navigate(`/item/${prevAd?.id}`)}>
          ◀ Предыдущее
        </button>

        <button className="btn btn-ghost" onClick={() => navigate("/list")}>
          К списку
        </button>

        <button className="btn btn-ghost" disabled={!nextAd} onClick={() => navigate(`/item/${nextAd?.id}`)}>
          Следующее ▶
        </button>
      </div>

      {modalMode && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalMode === "reject" ? "Отклонить объявление" : "На доработку"}</h3>
              <button className="modal-close" onClick={closeModal}>✖</button>
            </div>

            <div className="modal-body">
              <div className="reason-list">
                {ACTION_REASONS.map((r) => (
                  <label key={r} className="reason-radio">
                    <input
                      type="radio"
                      name="reason"
                      checked={selectedReason === r}
                      onChange={() => setSelectedReason(r)}
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>

              <textarea
                className="input modal-textarea"
                placeholder="Комментарий (необязательно)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <div className="modal-actions">
                <button className="btn btn-ghost" onClick={closeModal}>Отмена</button>

                <button
                  className="btn btn-primary"
                  disabled={!selectedReason}
                  onClick={handleSubmit}
                >
                  Отправить
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ItemPage;
