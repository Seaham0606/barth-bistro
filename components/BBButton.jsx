// BBButton — primary call-to-action
// Variants: 'solid' (default), 'ghost'
// Sizes: 'md' (default), 'sm'
function BBButton({ children, href, onClick, variant = 'solid', size = 'md', showArrow = true, className = '' }) {
  const cls = `bbbtn ${variant === 'ghost' ? 'ghost' : ''} ${size === 'sm' ? 'small' : ''} ${className}`.trim();
  const inner = (
    <>
      <span>{children}</span>
      {showArrow && <span className="arr"></span>}
    </>
  );
  if (href) {
    return <a href={href} className={cls} onClick={onClick}>{inner}</a>;
  }
  return <button type="button" className={cls} onClick={onClick}>{inner}</button>;
}

window.BBButton = BBButton;
