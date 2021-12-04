import { center, Vector } from '../vectors';

export class Edge {
  from: Vector;
  to: Vector;

  constructor(from: Vector, to: Vector) {
    this.from = from;
    this.to = to;
  }

  public get center() {
    return center(this.from, this.to);
  }
}

export class Polygon {
  private _vertices: Vector[] = [];

  public set vertices(vertices: Vector[]) {
    if (vertices.length < 3) {
      throw new Error('At least 3 vertices required');
    }

    this._vertices = vertices;
  }

  public get vertices() {
    return this._vertices;
  }

  // TODO memoize? Redo to not calculate each time (calculate when vertices changed only)?
  public get edges(): Edge[] {
    const edges: Edge[] = [];

    for (let i = 0, l = this.vertices.length; i < l; i++) {
      const vertexA = this.vertices[i];
      let vertexB: Vector;

      if (this.vertices[i + 1]) {
        vertexB = this.vertices[i + 1];
      } else {
        vertexB = this.vertices[0];
      }

      edges.push(new Edge(vertexA, vertexB));
    }

    return edges;
  }

  constructor(vertices: Vector[]) {
    this.vertices = vertices;
  }
}
