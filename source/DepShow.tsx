// @ts-ignore
import parseYarnLock from 'parse-yarn-lock';
import fs from 'fs';

export const showDepGraph = async (path: string, packageName: string) => {
	const lockfile = fs.readFileSync(path).toString()
	const lock = parseYarnLock.default(lockfile) as { object: Record<string, any>, type: Record<string, any> };

  const nodes = new Set<string>;
  const edges = [];
	const graph = new Map<string, string[]>;
  const edgeSet = new Set;

  for (const [key, value] of Object.entries(lock.object)) {
    const name = key.substring(0, key.indexOf("@", 1));
    const source = `${name}@${value.version}`;
    nodes.add(source);
    for (const [depkey, depvalue] of Object.entries({...value.optionalDependencies, ...value.dependencies})) {
      const targetKey = `${depkey}@${depvalue}`;
      const targetObject = lock.object[targetKey];
      const target = targetObject ? `${depkey}@${targetObject.version}` : targetKey;

      const edgeKey = `${source} ========= ${target}`
      if (!edgeSet.has(edgeKey)) {
				edgeSet.add(edgeKey);
				edges.push([source, target]);
				const edgeSource = graph.get(source as string) || [];
				if (!edgeSource.includes(target)) {
					edgeSource.push(target);
				}
				graph.set(source, edgeSource);
			}
    }
  }

  const roots = new Set(nodes);
	const rootsOfNode: Record<string, Set<string>> = {};

  for (const [_, target] of edges) {
    roots.delete(target || '');
  }

	for (const node of nodes) {
		rootsOfNode[node] = new Set<string>;
	}

	const bfsQueue: string[] = [];

	for (const root of roots) {
		rootsOfNode[root]?.add(root);
		bfsQueue.push(root);
	}

	const visited = new Set;

	while(bfsQueue.length) {
		const topNode = bfsQueue.shift() || '';
		if (visited.has(topNode)) {
			continue;
		}
		visited.add(topNode);
		const neightbours = graph.get(topNode) || [];
		neightbours.forEach(neightbour => {
			for (const r of rootsOfNode?.[topNode] || []) {
				rootsOfNode[neightbour]?.add(r);
			}
			bfsQueue.push(neightbour);
		});
	}
  	
	nodes.forEach(node => {
		return node?.includes(packageName) && console.log(node, rootsOfNode[node]);
	});
};
