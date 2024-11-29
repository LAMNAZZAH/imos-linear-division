import { EvaluationErrors } from './types';
import { Node } from './Evaluator';

export function traverseTree(node: Node, callback: Function) {
  if (!node) {
    throw new EvaluationErrors(
      `unsupported node type to traverse: ${JSON.stringify(node)}`
    );
  }

  callback(node);

  if (node.type === 'Sections' && Array.isArray(node.sections)) {
    node.sections.forEach((section) => traverseTree(section, callback));
  } else if (node.type === 'Section' && node.nodes) {
    traverseTree(node.nodes as Node, callback);
  } else if (node.type === 'BinaryExpression') {
    // traverseTree(node.left as Node, callback);
    // traverseTree(node.right as Node, callback);
  }
}
