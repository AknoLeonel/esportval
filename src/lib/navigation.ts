type AnchorLike = { href: string; target?: string | null; hasDownload?: boolean };
type ClickLike = {
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
};

/**
 * O clique vai trocar de página dentro do site? (para acender a barra de progresso de rota)
 * Ignora links externos, nova aba, download, cliques com modificador e âncoras da mesma página.
 */
export function startsRouteChange(anchor: AnchorLike, click: ClickLike, current: string): boolean {
  if (click.button !== 0 || click.metaKey || click.ctrlKey || click.shiftKey || click.altKey)
    return false;
  if (anchor.hasDownload || (anchor.target && anchor.target !== "_self")) return false;
  let next: URL;
  let here: URL;
  try {
    here = new URL(current);
    next = new URL(anchor.href, here);
  } catch {
    return false;
  }
  if (next.origin !== here.origin) return false;
  return next.pathname !== here.pathname || next.search !== here.search;
}
