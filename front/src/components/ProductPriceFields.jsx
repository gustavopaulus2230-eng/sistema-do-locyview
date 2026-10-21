import React, { useId } from 'react';
import { priceResult } from '../utils/productPricing';
import '../styles/priceFields.css';

export default function ProductPriceFields({ value, onChange, error, inputRef, autoFocus = false }) {
  const id = useId();
  const draft = value || { mode: 'consult', amount: '', text: '' };
  const hasAmount = draft.mode === 'fixed' || draft.mode === 'from';
  const hasText = draft.mode === 'custom';
  const result = priceResult(draft);
  const hintId = `${id}-price-hint`;
  const errorId = `${id}-price-error`;
  const describedBy = `${hintId}${error ? ` ${errorId}` : ''}`;
  const change = patch => onChange({ ...draft, ...patch });

  return <fieldset className="lv-price-fields">
    <legend>Preço do produto</legend>
    <p className="lv-price-description">Escolha como o valor aparece no catálogo e nos detalhes.</p>
    <div className="lv-price-control">
      <label htmlFor={`${id}-price-mode`}>Exibição do preço</label>
      <select id={`${id}-price-mode`} value={draft.mode} onChange={event => change({ mode: event.target.value })} ref={!hasAmount && !hasText ? inputRef : undefined} autoFocus={autoFocus && !hasAmount && !hasText} aria-describedby={!hasAmount && !hasText ? describedBy : undefined} aria-invalid={!hasAmount && !hasText && error ? true : undefined}>
        <option value="fixed">Preço fixo</option>
        <option value="from">A partir de</option>
        <option value="consult">Sob consulta</option>
        <option value="custom">Texto personalizado</option>
      </select>
    </div>
    {hasAmount && <div className="lv-price-control">
      <label htmlFor={`${id}-price-amount`}>Valor em reais</label>
      <div className="lv-price-amount"><span aria-hidden="true">R$</span><input ref={inputRef} autoFocus={autoFocus} id={`${id}-price-amount`} type="text" inputMode="decimal" value={draft.amount || ''} onChange={event => change({ amount: event.target.value })} maxLength={24} autoComplete="off" placeholder="0,00" aria-describedby={describedBy} aria-invalid={Boolean(error)} /></div>
    </div>}
    {hasText && <div className="lv-price-control">
      <label htmlFor={`${id}-price-text`}>Texto do preço</label>
      <input ref={inputRef} autoFocus={autoFocus} id={`${id}-price-text`} type="text" value={draft.text || ''} onChange={event => change({ text: event.target.value })} maxLength={40} placeholder="Ex.: Planos personalizados" aria-describedby={describedBy} aria-invalid={Boolean(error)} />
    </div>}
    <p id={hintId} className="lv-price-hint">{draft.mode === 'consult' ? 'O catálogo mostrará “Sob consulta”, sem um valor numérico.' : hasText ? 'Até 40 caracteres. Textos de preços já cadastrados são preservados.' : 'Use vírgula para os centavos. Ex.: 1.500,00. Zero também é aceito.'}</p>
    {error && <p id={errorId} className="lv-price-error" role="alert">{error}</p>}
    <div className={`lv-price-summary${result.valid ? '' : ' is-pending'}`}>
      <span>{result.valid ? 'Como aparece no catálogo' : 'Complete o preço'}</span>
      {result.valid ? <strong>{result.price}</strong> : <p>{error ? 'O preço será mostrado aqui depois da correção.' : result.error}</p>}
    </div>
  </fieldset>;
}
