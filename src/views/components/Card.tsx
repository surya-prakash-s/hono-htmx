import type { FC, PropsWithChildren } from 'hono/jsx';

interface CardProps {
  title?: string;
  subtitle?: string;
  footer?: string;
}

const Card: FC<PropsWithChildren<CardProps>> = ({
  children,
  title,
  subtitle,
  footer,
}) => {
  return (
    <article class="card">
      {(title || subtitle) && (
        <header class="card-header">
          {title && <h3 class="card-title">{title}</h3>}
          {subtitle && <p class="card-subtitle">{subtitle}</p>}
        </header>
      )}
      <div class="card-body">{children}</div>
      {footer && <footer class="card-footer">{footer}</footer>}
    </article>
  );
};

export default Card;
