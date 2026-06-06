export default function Field({ label, hint, error, children }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {children}
      {error
        ? <span className="errmsg">{error}</span>
        : hint
          ? <span className="hint">{hint}</span>
          : null}
    </div>
  );
}
