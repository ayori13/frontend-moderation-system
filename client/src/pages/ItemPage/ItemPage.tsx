import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAdById,
  approveAd,
  rejectAd,
  requestChanges,
} from "../../api/ads";
import type { Advertisement } from "../../types/ad";

const REASONS = [
  "Запрещенный товар",
  "Неверная категория",
  "Некорректное описание",
  "Проблемы с фото",
  "Подозрение на мошенничество",
  "Другое",
];

type ModalMode = "reject" | "changes" | null;

const ItemPage = () => {
  const { id } = useParams<{ id: string }>();
  const adId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [comment, setComment] = useState("");

  const { data, isLoading, isError } = useQuery<Advertisement>({
    queryKey: ["ad", adId],
    enabled: Number.isFinite(adId),
    queryFn: () => getAdById(adId),
  });

  const approveMutation = useMutation({
    mutationFn: () => approveAd(adId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ad", adId] });
      queryClient.invalidateQueries({ queryKey: ["ads"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (payload: { reason: string; comment?: string }) =>
      rejectAd(adId, payload.reason, payload.comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ad", adId] });
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      closeModal();
    },
  });

  const changesMutation = useMutation({
    mutationFn: (payload: { reason: string; comment?: string }) =>
      requestChanges(adId, payload.reason, payload.comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ad", adId] });
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      closeModal();
    },
  });

  const openModal = (mode: ModalMode) => {
    setModalMode(mode);
    setSelectedReason(REASONS[0]);
    setComment("");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedReason("");
    setComment("");
  };

  const handleSubmitModal = () => {
    if (!selectedReason) return;

    const payload = { reason: selectedReason, comment: comment || undefined };

    if (modalMode === "reject") {
      rejectMutation.mutate(payload);
    } else if (modalMode === "changes") {
      changesMutation.mutate(payload);
    }
  };

  if (!Number.isFinite(adId)) {
    return <div style={{ padding: 20 }}>Некорректный идентификатор объявления</div>;
  }

  if (isLoading) return <div style={{ padding: 20 }}>Загрузка...</div>;
  if (isError || !data) return <div style={{ padding: 20 }}>Ошибка загрузки объявления</div>;

  const ad = data;

  return (
    <div style={{ padding: 20, display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => navigate(-1)}>К списку</button>
        <div>Объявление #{ad.id}</div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.2fr",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              {ad.title}
            </div>
            <div style={{ fontSize: 18 }}>{ad.price} ₽</div>
            <div style={{ color: "#555", marginTop: 4 }}>
              {ad.category} ·{" "}
              {new Date(ad.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 12,
              overflowX: "auto",
            }}
          >
            {ad.images.map((src) => (
              <img
                key={src}
                src={src}
                alt={ad.title}
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 6,
                  objectFit: "cover",
                }}
              />
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <h3>Описание</h3>
            <p>{ad.description}</p>
          </div>

          <div style={{ marginTop: 12 }}>
            <h3>Характеристики</h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
              }}
            >
              <tbody>
                {Object.entries(ad.characteristics || {}).map(
                  ([key, value]) => (
                    <tr key={key}>
                      <td
                        style={{
                          border: "1px solid #eee",
                          padding: "4px 8px",
                          width: "40%",
                          fontWeight: 500,
                        }}
                      >
                        {key}
                      </td>
                      <td
                        style={{
                          border: "1px solid #eee",
                          padding: "4px 8px",
                        }}
                      >
                        {value}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <h3>Продавец</h3>
            <div>{ad.seller.name}</div>
            <div>Рейтинг: {ad.seller.rating}</div>
            <div>Объявлений: {ad.seller.totalAds}</div>
            <div>
              На сайте с{" "}
              {new Date(ad.seller.registeredAt).toLocaleDateString()}
            </div>
          </div>

          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <h3>Статус модерации</h3>
            <div style={{ marginBottom: 8 }}>
              Статус: {ad.status}{" "}
              {ad.priority === "urgent" && "· срочное"}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => approveMutation.mutate()}
                disabled={approveMutation.isPending}
              >
                Одобрить
              </button>
              <button
                onClick={() => openModal("reject")}
                disabled={rejectMutation.isPending || changesMutation.isPending}
                style={{ background: "#ffd6d6" }}
              >
                Отклонить
              </button>
              <button
                onClick={() => openModal("changes")}
                disabled={rejectMutation.isPending || changesMutation.isPending}
                style={{ background: "#fff3cd" }}
              >
                На доработку
              </button>
            </div>
          </div>

          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
              maxHeight: 260,
              overflowY: "auto",
            }}
          >
            <h3>История модерации</h3>
            {ad.moderationHistory.length === 0 && (
              <div>История пуста</div>
            )}
            {ad.moderationHistory.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "6px 0",
                  borderBottom: "1px solid #eee",
                  fontSize: 14,
                }}
              >
                <div>
                  {item.moderatorName} ·{" "}
                  {new Date(item.timestamp).toLocaleString()}
                </div>
                <div>Действие: {item.action}</div>
                {item.reason && <div>Причина: {item.reason}</div>}
                {item.comment && <div>Комментарий: {item.comment}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalMode && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 16,
              borderRadius: 8,
              minWidth: 360,
            }}
          >
            <h3>
              {modalMode === "reject"
                ? "Отклонение объявления"
                : "Запрос на доработку"}
            </h3>

            <div style={{ marginTop: 8, marginBottom: 8 }}>
              Причина:
              <div style={{ marginTop: 4 }}>
                {REASONS.map((r) => (
                  <label
                    key={r}
                    style={{ display: "block", marginBottom: 4 }}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={selectedReason === r}
                      onChange={() => setSelectedReason(r)}
                    />{" "}
                    {r}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              Комментарий:
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ width: "100%", marginTop: 4 }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                marginTop: 8,
              }}
            >
              <button onClick={closeModal}>Отмена</button>
              <button
                onClick={handleSubmitModal}
                disabled={
                  !selectedReason ||
                  rejectMutation.isPending ||
                  changesMutation.isPending
                }
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemPage;
