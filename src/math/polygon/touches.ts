import { Vector } from '../vectors';
import { Edge, Polygon } from './Polygon';

// Check if polygon a touches polygon b
// https://www.codeproject.com/Articles/15573/2D-Polygon-Collision-Detection
export function touches(polygonA: Polygon, polygonB: Polygon) {
  const edgeCountA = polygonA.edges.length;
  const edgeCountB = polygonB.edges.length;

  let edge: Edge;
  for (let edgeIndex = 0; edgeIndex < edgeCountA + edgeCountB; edgeIndex++) {
    if (edgeIndex < edgeCountA) {
      edge = polygonA.edges[edgeIndex];
    } else {
      edge = polygonB.edges[edgeIndex - edgeCountA];
    }

    const point = edge.to.substract(edge.from);
    const axis = new Vector({
      x: point.x,
      y: -1 * point.y,
    }).normalize();
    const [minA, maxA] = projectPolygon(axis, polygonA);
    const [minB, maxB] = projectPolygon(axis, polygonB);

    if (intervalDistance(minA, maxA, minB, maxB) > 0) {
      return false;
    }
  }

  return true;
}

// Calculate the projection of a polygon on an axis
// and returns it as a [min, max] interval.
function projectPolygon(axis: Vector, polygon: Polygon): [number, number] {
  // To project a point on an axis use the dot product
  let dotProduct = axis.dotProduct(polygon.vertices[0]);
  let min = dotProduct;
  let max = dotProduct;
  for (let i = 0; i < polygon.vertices.length; i++) {
    dotProduct = polygon.vertices[i].dotProduct(axis);

    if (dotProduct < min) {
      min = dotProduct;
    } else if (dotProduct > max) {
      max = dotProduct;
    }
  }

  return [min, max];
}

// Calculate the distance between [minA, maxA] and [minB, maxB].
// The distance will be negative if the intervals overlap.
function intervalDistance(minA: number, maxA: number, minB: number, maxB: number) {
  if (minA < minB) {
    return minB - maxA;
  } else {
    return minA - maxB;
  }
}
