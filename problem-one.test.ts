import {
    Graph,
    taskRouteDistance,
    taskWalksMaximumStops,
    taskWalksExactStops,
    taskShortestWalk,
    taskWalksMaximumCost
} from "./problem-one";

let graph: Graph;

beforeEach(() => {
    graph = Graph.parseGraphString('AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7');
});

test('Distance of the route A-B-C', () => {
    const result = taskRouteDistance(graph, ['A', 'B', 'C']);
    // console.debug(result);
    expect(result).toBe('9');
});

test('Distance of the route A-D', () => {
    const result = taskRouteDistance(graph, ['A', 'D']);
    // console.debug(result);
    expect(result).toBe('5');
});

test('Distance of the route A-D-C', () => {
    const result = taskRouteDistance(graph, ['A', 'D', 'C']);
    // console.debug(result);
    expect(result).toBe('13');
});

test('Distance of the route A-E-B-C-D', () => {
    const result = taskRouteDistance(graph, ['A', 'E', 'B', 'C', 'D']);
    // console.debug(result);
    expect(result).toBe('22');
});

test('Distance of the route A-E-D', () => {
    const result = taskRouteDistance(graph, ['A', 'E', 'D']);
    // console.debug(result);
    expect(result).toBe('NO SUCH ROUTE');
});

test('Number of trips starting at C and ending at C with a maximum of 3 stops', () => {
    const result = taskWalksMaximumStops(graph, 'C', 'C', 3);
    // console.debug(result);
    expect(result).toBe('2');
});

test('Number of trips starting at A and ending at C with exactly 4 stops', () => {
    const result = taskWalksExactStops(graph, 'A', 'C', 4);
    // console.debug(result);
    expect(result).toBe('3');
});

test('Length of shortest route from A to C', () => {
    const result = taskShortestWalk(graph, 'A', 'C');
    // console.debug(result);
    expect(result).toBe('9');
});

test('Length of shortest route from B to B', () => {
    const result = taskShortestWalk(graph, 'B', 'B')
    // console.debug(result);
    expect(result).toBe('9');
});

test('Number of different routes from C to C with a distance less than 30', () => {
    const result = taskWalksMaximumCost(graph, 'C', 'C', 30)
    // console.debug(result);
    expect(result).toBe('7');
});
