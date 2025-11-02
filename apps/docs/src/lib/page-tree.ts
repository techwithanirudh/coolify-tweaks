import type { Item, Root } from 'fumadocs-core/page-tree'
import { flattenTree, getPageTreeRoots } from 'fumadocs-core/page-tree'

export { flattenTree, getPageTreeRoots } from 'fumadocs-core/page-tree'

/**
 * normalize url
 * adapted from: https://github.com/fuma-nama/fumadocs/blob/dev/packages/ui/src/utils/is-active.ts
 */
export function normalize(url: string) {
  if (url.length > 1 && url.endsWith('/')) return url.slice(0, -1)
  return url
}

export function findPage(
  tree: Root,
  url: string,
  options?: {
    separateRoot?: boolean
  }
): Item | undefined {
  const { separateRoot = true } = options ?? {}
  const roots = separateRoot ? getPageTreeRoots(tree) : [tree]
  if (tree.fallback) roots.push(tree.fallback)

  for (const root of roots) {
    const list = flattenTree(root.children)
    const page = list.find((item) => item.url === normalize(url))

    if (page) return page
  }

  return undefined
}
