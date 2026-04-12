import { useState, useEffect } from 'react';
import { FileText, ArrowLeft, Truck, RotateCcw, XCircle, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getApiPath } from '../api';

const defaultPolicies = {
  cancellation: `## Cancellation Policy

**Effective Date:** April 2026

At Aacharya Ayurvedam, we understand that plans can change. Here is our cancellation policy:

### Order Cancellation
- Orders can be cancelled **within 2 hours** of placement for a full refund.
- Once an order has been shipped, cancellation is not possible. You may initiate a return instead.
- To cancel an order, visit your **Profile → Orders** section or contact our support team.

### Cancellation by Aacharya Ayurvedam
- We reserve the right to cancel orders if:
  - The product is out of stock.
  - We detect fraudulent or suspicious activity.
  - Payment verification fails.
- In such cases, a full refund will be processed within **5-7 business days**.

### How to Cancel
1. Go to your **Orders** page.
2. Select the order you wish to cancel.
3. Click "Request Cancellation" (available within 2 hours of order placement).
4. You will receive a confirmation email.

For any questions, reach out to us at **support@aacharyaayurvedam.com**.`,

  refund: `## Refund Policy

**Effective Date:** April 2026

We want you to be completely satisfied with your purchase from Aacharya Ayurvedam.

### Refund Eligibility
- Refunds are available for **damaged, defective, or incorrectly shipped** items.
- Requests must be raised within **7 days** of delivery.
- Items must be unused, unopened, and in original packaging.

### Refund Process
1. Contact our support team with your **Order ID** and **photos** of the issue.
2. Our team will review and approve your refund request within **48 hours**.
3. Once approved, the refund will be processed to your original payment method.

### Refund Timeline
| Payment Method | Refund Timeline |
|---|---|
| UPI / Net Banking | 5-7 business days |
| Credit / Debit Card | 7-10 business days |
| Cash on Delivery | Bank transfer within 7-10 days |

### Non-Refundable Items
- Opened or used products (unless defective).
- Products purchased during special clearance sales (marked as "Final Sale").

For refund queries, email **support@aacharyaayurvedam.com**.`,

  returnExchange: `## Return & Exchange Policy

**Effective Date:** April 2026

We strive to deliver the best Ayurvedic products. If you're not fully satisfied, here's how our return & exchange process works:

### Return Eligibility
- Returns are accepted within **7 days** of delivery.
- Products must be **unused, sealed, and in original packaging**.
- Perishable items (oils, fresh preparations) cannot be returned unless damaged on arrival.

### Exchange Process
- Exchanges are available for the **same product** in case of a defective or damaged item.
- For a different product exchange, initiate a return and place a new order.

### How to Initiate a Return
1. Log in to your account and go to **Profile → Orders**.
2. Select the order and click **"Request Return"**.
3. Choose the reason for return and upload relevant photos.
4. Our team will arrange a pickup within **3-5 business days**.

### Important Notes
- Return shipping is **FREE** for defective/damaged items.
- For change-of-mind returns, a minimal shipping fee may apply.
- Refund will be processed after the returned product is received and inspected.`,

  shipping: `## Shipping & Delivery Policy

**Effective Date:** April 2026

We deliver authentic Ayurvedic products across India with care and speed.

### Delivery Timelines
| Region | Estimated Delivery |
|---|---|
| Metro Cities (Delhi, Mumbai, Bangalore, etc.) | 3-5 business days |
| Tier 2 & Tier 3 Cities | 5-7 business days |
| Remote / Rural Areas | 7-10 business days |

### Shipping Charges
- **FREE shipping** on orders above **₹999**.
- Standard shipping charge of **₹99** for orders below ₹999.

### Order Tracking
- Once shipped, you will receive a tracking link via **email and SMS**.
- Track your order anytime through your **Profile → Orders** section.

### Shipping Partners
We partner with trusted logistics providers including **Delhivery, BlueDart, and India Post** to ensure safe and timely delivery.

### Packaging
- All products are packed in **eco-friendly, tamper-proof packaging**.
- Fragile items (glass bottles, oils) include extra protective wrapping.

### Undeliverable Orders
- If delivery fails after 3 attempts, the order is returned to us.
- A full refund (minus shipping charges, if applicable) will be processed.

For shipping queries, contact **support@aacharyaayurvedam.com**.`,
};

const policyTabs = [
  { key: 'cancellation', label: 'Cancellation', icon: XCircle },
  { key: 'refund', label: 'Refund', icon: CreditCard },
  { key: 'returnExchange', label: 'Return & Exchange', icon: RotateCcw },
  { key: 'shipping', label: 'Shipping & Delivery', icon: Truck },
];

// Simple markdown renderer for headings, bold, tables, and lists
const renderMarkdown = (text) => {
  if (!text) return null;
  
  const lines = text.split('\n');
  const elements = [];
  let inTable = false;
  let tableRows = [];
  let tableHeaders = [];

  const processInline = (line) => {
    // Bold
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return line;
  };
  
  const flushTable = () => {
    if (tableHeaders.length > 0) {
      elements.push(
        <div key={`table-${elements.length}`} className="policy-table-wrap">
          <table className="policy-table">
            <thead>
              <tr>{tableHeaders.map((h, i) => <th key={i}>{h.trim()}</th>)}</tr>
            </thead>
            <tbody>
              {tableRows.map((row, ri) => (
                <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell.trim()}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    inTable = false;
    tableRows = [];
    tableHeaders = [];
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Table detection
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed.split('|').filter(c => c.trim() !== '');
      // Separator row
      if (cells.every(c => /^[-:\s]+$/.test(c))) return;
      
      if (!inTable) {
        inTable = true;
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      return;
    } else if (inTable) {
      flushTable();
    }

    if (trimmed === '') {
      elements.push(<br key={idx} />);
    } else if (trimmed.startsWith('## ')) {
      elements.push(<h2 key={idx}>{trimmed.slice(3)}</h2>);
    } else if (trimmed.startsWith('### ')) {
      elements.push(<h3 key={idx}>{trimmed.slice(4)}</h3>);
    } else if (trimmed.startsWith('- ')) {
      elements.push(
        <li key={idx} dangerouslySetInnerHTML={{ __html: processInline(trimmed.slice(2)) }} />
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      elements.push(
        <li key={idx} className="ordered" dangerouslySetInnerHTML={{ __html: processInline(trimmed.replace(/^\d+\.\s/, '')) }} />
      );
    } else {
      elements.push(
        <p key={idx} dangerouslySetInnerHTML={{ __html: processInline(trimmed) }} />
      );
    }
  });

  if (inTable) flushTable();

  return elements;
};

const Policies = () => {
  const [activePolicy, setActivePolicy] = useState('cancellation');
  const [policies, setPolicies] = useState(defaultPolicies);

  useEffect(() => {
    fetch(getApiPath('/api/content/policies'))
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setPolicies(prev => ({ ...prev, ...data }));
        }
      })
      .catch(() => {/* Use defaults */});
  }, []);

  const activeTab = policyTabs.find(t => t.key === activePolicy);
  const IconComp = activeTab?.icon || FileText;

  return (
    <div className="policies-page fade-in">
      <section className="policies-hero">
        <div className="container text-center">
          <FileText size={40} style={{ color: 'var(--color-accent)', marginBottom: '16px' }} />
          <h1>Our Policies</h1>
          <p className="text-lg text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Transparency and trust are at the core of everything we do. Read our policies to understand how we serve you.
          </p>
        </div>
      </section>

      <section className="policies-content-section">
        <div className="container">
          <div className="policies-layout">
            {/* Sidebar Tabs */}
            <aside className="policies-sidebar">
              {policyTabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    className={`policy-tab-btn ${activePolicy === tab.key ? 'active' : ''}`}
                    onClick={() => setActivePolicy(tab.key)}
                  >
                    <TabIcon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </aside>

            {/* Policy Content */}
            <div className="policy-content glass">
              <div className="policy-content-header">
                <IconComp size={24} />
                <h2>{activeTab?.label} Policy</h2>
              </div>
              <div className="policy-body">
                {renderMarkdown(policies[activePolicy])}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .policies-hero {
          padding: 140px 0 60px;
          background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-bg) 100%);
        }
        .policies-hero h1 {
          font-size: 3rem;
          margin-bottom: 12px;
        }

        .policies-content-section {
          padding: 60px 0 80px;
        }
        .policies-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 40px;
          align-items: start;
        }

        .policies-sidebar {
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: sticky;
          top: 100px;
        }
        .policy-tab-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border: 2px solid transparent;
          border-radius: var(--radius-sm);
          background: var(--color-surface);
          color: var(--color-text);
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
          font-family: var(--font-family);
        }
        .policy-tab-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }
        .policy-tab-btn.active {
          background: var(--color-primary);
          color: #fff;
          border-color: var(--color-primary);
          box-shadow: var(--shadow-md);
        }

        .policy-content {
          padding: 40px;
          border-radius: var(--radius-md);
          min-height: 400px;
        }
        .policy-content-header {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--color-primary);
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid var(--color-surface);
        }
        .policy-content-header h2 {
          margin: 0;
        }

        .policy-body h2 {
          font-size: 1.5rem;
          margin-top: 8px;
          margin-bottom: 12px;
        }
        .policy-body h3 {
          font-size: 1.15rem;
          margin-top: 24px;
          margin-bottom: 8px;
        }
        .policy-body p {
          color: var(--color-text-muted);
          line-height: 1.7;
          margin-bottom: 4px;
        }
        .policy-body li {
          color: var(--color-text-muted);
          line-height: 1.7;
          margin-left: 24px;
          margin-bottom: 6px;
          list-style: disc;
        }
        .policy-body li.ordered {
          list-style: decimal;
        }
        .policy-body strong {
          color: var(--color-text);
        }

        .policy-table-wrap {
          overflow-x: auto;
          margin: 16px 0;
        }
        .policy-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .policy-table th, .policy-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        [data-theme='dark'] .policy-table th,
        [data-theme='dark'] .policy-table td {
          border-color: rgba(255,255,255,0.08);
        }
        .policy-table th {
          background: var(--color-surface);
          font-weight: 600;
          color: var(--color-primary);
        }
        .policy-table td {
          color: var(--color-text-muted);
        }

        @media (max-width: 768px) {
          .policies-hero h1 { font-size: 2.2rem; }
          .policies-layout {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .policies-sidebar {
            position: static;
            flex-direction: row;
            overflow-x: auto;
            gap: 8px;
            padding-bottom: 8px;
          }
          .policy-tab-btn {
            white-space: nowrap;
            padding: 10px 16px;
            font-size: 0.85rem;
          }
          .policy-content {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default Policies;
