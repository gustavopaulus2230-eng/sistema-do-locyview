const MAX_PRICE_CENTS = 99999999999;

function amountInCents(value) {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw) return { error: 'Informe o valor em reais. Use 0,00 se o preço for zero.' };

  let integer;
  let fraction = '';
  if (/^\d+(?:,\d{1,2})?$/.test(raw)) {
    [integer, fraction = ''] = raw.split(',');
  } else if (/^\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?$/.test(raw)) {
    [integer, fraction = ''] = raw.split(',');
    integer = integer.replace(/\./g, '');
  } else if (/^\d+\.\d{1,2}$/.test(raw)) {
    [integer, fraction] = raw.split('.');
  } else {
    return { error: 'Use um valor positivo ou zero, como 1.500,00, com até duas casas decimais.' };
  }

  const cents = Number(`${integer}${fraction.padEnd(2, '0')}`);
  if (!Number.isSafeInteger(cents) || cents > MAX_PRICE_CENTS) {
    return { error: 'O valor máximo é R$ 999.999.999,99.' };
  }
  return { cents };
}

function formatAmount(cents) {
  const integer = String(Math.floor(cents / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${integer},${String(cents % 100).padStart(2, '0')}`;
}

export function priceDraftFromString(price) {
  const text = typeof price === 'string' ? price.trim().slice(0, 40) : '';
  if (/^sob consulta$/i.test(text)) return { mode: 'consult', amount: '', text: '' };

  const standard = text.match(/^(A partir de )?R\$\s*(.+)$/i);
  if (standard && !amountInCents(standard[2]).error) {
    return { mode: standard[1] ? 'from' : 'fixed', amount: standard[2], text: '' };
  }
  return { mode: 'custom', amount: '', text };
}

export function priceResult(draft) {
  if (draft?.mode === 'consult') return { valid: true, price: 'Sob consulta', error: '' };
  if (draft?.mode === 'custom') {
    const text = typeof draft.text === 'string' ? draft.text.trim() : '';
    if (text.length > 40) return { valid: false, price: '', error: 'Use até 40 caracteres no texto do preço.' };
    return text
      ? { valid: true, price: text, error: '' }
      : { valid: false, price: '', error: 'Informe o texto do preço ou escolha Sob consulta.' };
  }
  if (draft?.mode === 'fixed' || draft?.mode === 'from') {
    const amount = amountInCents(draft.amount);
    if (amount.error) return { valid: false, price: '', error: amount.error };
    const prefix = draft.mode === 'from' ? 'A partir de R$ ' : 'R$ ';
    return { valid: true, price: `${prefix}${formatAmount(amount.cents)}`, error: '' };
  }
  return { valid: false, price: '', error: 'Escolha como o preço será exibido.' };
}
