function UiStyles() {
  return (
    <style>{`
      /* =========================================
         GLOBAL DASHBOARD UI POLISH
         ========================================= */

      .dashboard-container {
        width: 100%;
        max-width: 1250px;
        margin: 0 auto;
        padding: 28px 24px 50px;
      }

      .dashboard-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 28px;
        padding: 28px;
        border-radius: 20px;
        background: linear-gradient(
          135deg,
          #eff6ff 0%,
          #ffffff 55%,
          #f8fafc 100%
        );
        border: 1px solid #dbeafe;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
      }

      .dashboard-header h1 {
        margin: 0 0 8px;
        color: #0f172a;
        font-size: 30px;
        line-height: 1.2;
      }

      .dashboard-header p {
        margin: 0;
        color: #64748b;
        font-size: 15px;
      }

      .role-badge {
        flex-shrink: 0;
        padding: 9px 15px;
        border-radius: 999px;
        background: #2563eb;
        color: #ffffff;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.5px;
      }

      .dashboard-section,
      .upcoming-events-section {
        margin-top: 28px;
      }

      .section-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 18px;
      }

      .section-heading h2 {
        margin: 0 0 5px;
        color: #0f172a;
        font-size: 22px;
      }

      .section-heading p {
        margin: 0;
        color: #64748b;
        font-size: 14px;
      }

      .upcoming-events-count {
        padding: 7px 12px;
        border-radius: 999px;
        background: #eff6ff;
        color: #2563eb;
        font-size: 12px;
        font-weight: 700;
        white-space: nowrap;
      }

      /* =========================================
         EVENT GRID
         ========================================= */

      .event-grid,
      .upcoming-events-grid {
        display: grid;
        grid-template-columns: repeat(
          auto-fit,
          minmax(280px, 1fr)
        );
        gap: 20px;
      }

      .event-card,
      .upcoming-event-card {
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 22px;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 18px;
        box-shadow: 0 6px 20px rgba(15, 23, 42, 0.05);
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease,
          border-color 0.2s ease;
      }

      .event-card:hover,
      .upcoming-event-card:hover {
        transform: translateY(-3px);
        border-color: #bfdbfe;
        box-shadow: 0 14px 30px rgba(15, 23, 42, 0.09);
      }

      .event-card h3,
      .upcoming-event-card h3 {
        margin: 12px 0 8px;
        color: #0f172a;
        font-size: 19px;
        line-height: 1.35;
      }

      .event-card > p {
        color: #64748b;
        line-height: 1.6;
      }

      .event-type-badge {
        width: fit-content;
      }

      /* =========================================
         UPCOMING EVENTS
         ========================================= */

      .upcoming-event-card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .going-status-badge {
        padding: 6px 10px;
        border-radius: 999px;
        background: #dcfce7;
        color: #166534;
        font-size: 11px;
        font-weight: 800;
        white-space: nowrap;
      }

      .upcoming-event-description {
        margin: 0 0 18px;
        color: #64748b;
        font-size: 14px;
        line-height: 1.6;
      }

      .upcoming-event-info {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 16px;
      }

      .upcoming-event-info div {
        display: flex;
        align-items: flex-start;
        gap: 10px;
      }

      .upcoming-event-info span {
        width: 22px;
        flex-shrink: 0;
      }

      .upcoming-event-info strong {
        color: #334155;
        font-size: 13px;
        font-weight: 600;
      }

      .upcoming-event-capacity {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-top: auto;
        margin-bottom: 16px;
        padding-top: 14px;
        border-top: 1px solid #e2e8f0;
        color: #64748b;
        font-size: 13px;
      }

      .upcoming-event-details-button {
        width: 100%;
      }

      /* =========================================
         EMPTY STATES
         ========================================= */

      .upcoming-events-empty {
        padding: 40px 24px;
        text-align: center;
        background: #ffffff;
        border: 1px dashed #cbd5e1;
        border-radius: 18px;
      }

      .upcoming-events-empty-icon {
        margin-bottom: 10px;
        font-size: 38px;
      }

      .upcoming-events-empty h3 {
        margin: 0 0 7px;
        color: #0f172a;
      }

      .upcoming-events-empty p {
        margin: 0;
        color: #64748b;
      }

      /* =========================================
         BUTTONS
         ========================================= */

      .button-row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 16px;
      }

      button {
        min-height: 40px;
        border-radius: 9px;
        font-family: inherit;
        font-weight: 600;
        cursor: pointer;
        transition:
          transform 0.15s ease,
          box-shadow 0.15s ease,
          background 0.15s ease;
      }

      button:hover:not(:disabled) {
        transform: translateY(-1px);
      }

      button:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }

      .secondary-button {
        border: 1px solid #cbd5e1;
        background: #ffffff;
        color: #334155;
      }

      .secondary-button:hover:not(:disabled) {
        background: #f8fafc;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
      }

      .danger-button {
        border: 1px solid #fecaca;
        background: #ffffff;
        color: #dc2626;
      }

      .danger-button:hover:not(:disabled) {
        background: #fef2f2;
      }

      /* =========================================
         FORMS
         ========================================= */

      .form-card {
        width: 100%;
        max-width: 760px;
        margin: 0 auto;
        padding: 28px;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 18px;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.07);
      }

      .form-card input,
      .form-card textarea,
      .form-card select {
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 16px;
        padding: 11px 13px;
        border: 1px solid #cbd5e1;
        border-radius: 9px;
        background: #ffffff;
        color: #0f172a;
        font: inherit;
        outline: none;
        transition:
          border-color 0.15s ease,
          box-shadow 0.15s ease;
      }

      .form-card input:focus,
      .form-card textarea:focus,
      .form-card select:focus {
        border-color: #60a5fa;
        box-shadow: 0 0 0 3px #dbeafe;
      }

      /* =========================================
         MOBILE
         ========================================= */

      @media (max-width: 700px) {
        .dashboard-container {
          padding: 18px 14px 35px;
        }

        .dashboard-header {
          align-items: flex-start;
          flex-direction: column;
          padding: 20px;
          border-radius: 16px;
        }

        .dashboard-header h1 {
          font-size: 24px;
        }

        .role-badge {
          align-self: flex-start;
        }

        .section-heading {
          align-items: flex-start;
          flex-direction: column;
        }

        .event-grid,
        .upcoming-events-grid {
          grid-template-columns: 1fr;
        }

        .event-card,
        .upcoming-event-card {
          padding: 18px;
        }

        .button-row {
          flex-direction: column;
        }

        .button-row button {
          width: 100%;
        }

        .form-card {
          padding: 20px;
        }
      }
    `}</style>
  );
}

export default UiStyles;