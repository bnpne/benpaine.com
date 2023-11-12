// Virtual DOM

export function toVirtualDom(node, attributes, ...rest) {
  const children = rest.length ? rest : null
  return {
    node,
    attributes,
    children,
  }
}

export function render(virtualNode) {
  if (typeof virtualNode === "string") {
    return document.createTextNode(virtualNode)
  }

  const element = document.createElement(virtualNode.node)

  Object.keys(virtualNode.attributes || {}).forEach((attr) => {
    element.setAttribute(attr, virtualNode.attributes[attr])
  })

  if (virtualNode.children) {
    virtualNode.children.forEach((child) => element.appendChild(render(child)))
  }

  return element
}
