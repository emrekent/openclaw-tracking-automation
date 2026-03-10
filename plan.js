const fs = require('fs');
const path = require('path');

const AUDIT_FILE = path.join(__dirname, 'audit-report.json');
const PLAN_FILE = path.join(__dirname, 'gtm-tracking-plan.json');

function mapEvent(element) {
  let gtmEvent = 'interact';
  let metaEvent = 'CustomEvent';

  const tag = element.tag ? element.tag.toLowerCase() : '';
  const text = element.text ? element.text.toLowerCase() : '';
  
  if (tag === 'form' || text.includes('sign up') || text.includes('register')) {
    gtmEvent = 'generate_lead';
    metaEvent = 'Lead';
  } else if (tag === 'button' || text.includes('buy') || text.includes('add to cart')) {
    gtmEvent = 'click_button';
    metaEvent = 'CustomEvent';
    if (text.includes('buy') || text.includes('add to cart')) {
      gtmEvent = 'add_to_cart';
      metaEvent = 'AddToCart';
    }
  } else if (tag === 'a') {
    gtmEvent = 'click_link';
    metaEvent = 'CustomEvent';
  }

  return { gtmEvent, metaEvent };
}

function generatePlan() {
  if (!fs.existsSync(AUDIT_FILE)) {
    console.error(`Error: Could not find ${AUDIT_FILE}`);
    process.exit(1);
  }

  console.log(`Reading audit report from: ${AUDIT_FILE}`);
  const auditData = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf-8'));
  const elements = auditData.elements || [];
  const trackingPlan = [];

  for (const el of elements) {
    const { gtmEvent, metaEvent } = mapEvent(el);

    // Build a simple selector for trigger matching
    let selector = el.tag || '*';
    if (el.id) {
      selector += `#${el.id}`;
    } else if (el.classes && el.classes.length > 0) {
      selector += `.${el.classes.join('.')}`;
    }

    trackingPlan.push({
      element: {
        tag: el.tag,
        text: el.text || '',
        id: el.id || '',
        classes: el.classes || []
      },
      trigger: {
        type: el.tag || 'unknown',
        css_selector: selector
      },
      tags: {
        gtm: {
          event: gtmEvent,
          parameters: {
            element_text: el.text || '',
            element_id: el.id || '',
            element_classes: (el.classes || []).join(' '),
            element_url: el.href || ''
          }
        },
        meta: {
          event: metaEvent
        }
      }
    });
  }

  const output = {
    url: auditData.url,
    generated_at: new Date().toISOString(),
    plan: trackingPlan
  };

  fs.writeFileSync(PLAN_FILE, JSON.stringify(output, null, 2));
  console.log(`Successfully generated tracking plan at: ${PLAN_FILE}`);
}

generatePlan();
