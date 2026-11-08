export function BotonRosa({ texto, onClick, tipo = 'button', className = 'btn-primary', disabled = false }) {
  return (
    <button className={className} type={tipo} onClick={onClick} disabled={disabled}>
      {texto}
    </button>
  );
}
