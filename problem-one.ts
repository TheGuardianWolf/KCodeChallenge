/**
 * In this file I implement the solution to problem 1. This is inherently a graph problem
 * that requires the implementation of multiple graph algorithms.
 */

class Arc {
    origin: Vertex;
    destination: Vertex;
    distance: number;

    constructor(origin: Vertex, destination: Vertex, distance: number) {
        this.origin = origin;
        this.destination = destination;
        this.distance = distance;
    }
}

class Vertex {
    outConnections: Map<string, Arc> = new Map();
    inConnections: Map<string, Arc> = new Map();
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    addOutConnection(destination: Vertex, distance: number): void {
        const arc = new Arc(this, destination, distance);
        destination.inConnections.set(this.name, arc);
        this.outConnections.set(destination.name, arc);
    }

    removeOutConnection(destination: Vertex): void {
        destination.inConnections.delete(this.name);
        this.outConnections.delete(destination.name);
    }

    distanceTo(vertexName: string) {
        if (this.name === vertexName) {
            return 0;
        }

        if (this.outConnections.has(vertexName)) {
            const arc = this.outConnections.get(vertexName);
            if (Number.isFinite(arc.distance)) {
                return arc.distance;
            }
        }

        return Infinity;
    }
}

class Graph {
    vertices: Map<string, Vertex> = new Map();

    distance(from: string, to: string): number {
        if (this.vertices.has(from)) {
            const fromVertex = this.vertices.get(from);
            const distance = fromVertex.distanceTo(to);
            if (Number.isFinite(distance)) {
                return distance;
            }
        }
        return Infinity;
    }

    static parseGraphString(graphString: string): Graph {
        const g = new Graph();

        const terms = graphString.split(',')
        .map((term) => {
            return term.trim();
        });

        terms.forEach((term) => {
            const [from, to, cost] = term;

            let fromVertex: Vertex;
            if (!g.vertices.has(from)) {
                fromVertex = new Vertex(from);
                g.vertices.set(from, fromVertex);
            }
            else {
                fromVertex = g.vertices.get(from);
            }

            let toVertex: Vertex;
            if (!g.vertices.has(to)) {
                toVertex = new Vertex(to);
                g.vertices.set(to, toVertex);
            }
            else {
                toVertex = g.vertices.get(to);
            }

            fromVertex.addOutConnection(toVertex, Number.parseInt(cost, 10));
        });

        return g;
    }
}

function taskRouteDistance(graph: Graph, route: string[]): string {
    let totalDistance = 0;

    if (route.length < 2) {
        return String(totalDistance);
    }

    for (let i = 1; i < route.length; i++) {
        const from = route[i - 1];
        const to = route[i];

        const distance = graph.distance(from, to);
        if (Number.isFinite(distance)) {
            totalDistance += distance;
        }
        else {
            // console.debug(`No route found from ${from} to ${to}`);
            return 'NO SUCH ROUTE';
        }
    }

    // console.debug(`Route found with total distance ${totalDistance}`);
    return String(totalDistance);
}

function taskWalksMaximumStops(graph: Graph, start: string, end: string, maximumStops: number): string {
    // DL-DFS below
    const searchFn = (vertex: Vertex, depth: number, targetDepth: number): number => {
        if (depth != targetDepth) {
            return Array.from(vertex.outConnections.values()).reduce((acc, arc) => {
                return acc + searchFn(arc.destination, depth + 1, targetDepth);
            }, 0);
        }
        else {
            if (vertex.name === end) {
                return 1;
            }
            return 0;
        }
    };

    // Implement IDS
    const startVertex = graph.vertices.get(start);
    let count = 0;
    for (let i = 1; i <= maximumStops; i++) {
        count += searchFn(startVertex, 0, i);
    }

    return String(count);
}

function taskWalksExactStops(graph: Graph, start: string, end: string, stops: number): string {
    // Implement Depth-Limited DFS
    const startVertex = graph.vertices.get(start);

    const searchFn = (vertex: Vertex, depth: number, targetDepth: number): number => {
        if (depth != targetDepth) {
            return Array.from(vertex.outConnections.values()).reduce((acc, arc) => {
                return acc + searchFn(arc.destination, depth + 1, targetDepth);
            }, 0);
        }
        else {
            if (vertex.name === end) {
                return 1;
            }
            return 0;
        }
    };

    const paths = searchFn(startVertex, 0, stops);

    return String(paths);
}

function taskShortestWalk(graph: Graph, start: string, end: string): string {
    if (!graph.vertices.has(start) || !graph.vertices.has(end)) {
        console.debug(`The locations ${start} or ${end} does not exist.`)
        return 'INVALID';
    }

    // If we want shortest walk to self, we have to change the graph a bit to
    // shove in a new duplicate vertex
    if (end === start) {
        const self = graph.vertices.get(start);
        const liftedName = `${start}+`;
        const liftedSelf = new Vertex(liftedName);

        // Reconnect incoming connections on start to the lifted self
        Array.from(self.inConnections.values()).forEach((connection) => {
            connection.origin.removeOutConnection(self);
            connection.origin.addOutConnection(liftedSelf, connection.distance);
        });

        liftedSelf.addOutConnection(graph.vertices.get(start), 0);
        graph.vertices.set(liftedName, liftedSelf);

        end = liftedName;
    }

    // Implement Dijkstra’s
    const visited = new Set<string>();
    const unvisited = new Set<string>();
    const distanceTable = new Map<string, [number, string]>();

    graph.vertices.forEach((vertex) => {
        unvisited.add(vertex.name);
        distanceTable.set(vertex.name, [Infinity, null]);
    });
    distanceTable.set(start, [0, null]);

    // We assume all towns are connected, graph should be modified beforehand to
    // drop unreachable towns.
    while (!visited.has(end) && unvisited.size > 0) {
        // Find min vertex, could use a heap here for efficiency
        let minVertex: string;
        let minVertexDistance = Infinity;
        unvisited.forEach((key) => {
            const value = distanceTable.get(key);
            const distance = value[0];

            if (isFinite(distance) && distance < minVertexDistance) {
                minVertex = key;
                minVertexDistance = distance;
            }
        });

        const vertex = graph.vertices.get(minVertex);
        vertex.outConnections.forEach((arc, destination) => {
            const oldDistance = distanceTable.get(destination)[0];
            const newDistance = minVertexDistance + arc.distance;

            if (!isFinite(oldDistance) || oldDistance > newDistance) {
                distanceTable.set(destination, [newDistance, minVertex]);
            }
        });
        unvisited.delete(minVertex);
        visited.add(minVertex);
    }

    return String(distanceTable.get(end)[0]);
}

function taskWalksMaximumCost(graph: Graph, start: string, end: string, maximumCost: number): string {
    // Implement DFS with distance limiting, this is the simplest methods of doing this.
    const searchFn = (vertex: Vertex, distance: number, maxDistance: number): number => {
        const childCount = Array.from(vertex.outConnections.values()).reduce((acc, arc) => {
            const nextDistance = distance + arc.distance;
            if (nextDistance < maxDistance) {
                return acc + searchFn(arc.destination, nextDistance, maxDistance);
            }
            return acc;
        }, 0);

        return childCount + (distance > 0 && vertex.name === end ? 1 : 0);
    };

    const startVertex = graph.vertices.get(start);

    return String(searchFn(startVertex, 0, maximumCost));
}

export {
    Graph, Vertex, Arc,
    taskRouteDistance,
    taskWalksMaximumStops,
    taskWalksExactStops,
    taskShortestWalk,
    taskWalksMaximumCost
};
