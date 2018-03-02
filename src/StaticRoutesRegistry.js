class StaticRoutesRegistry {
  constructor() {
    this.routes = [];
    this.addRoute = this.addRoute.bind(this);
  }

  /**
   * Registers a available route.
   *
   * @param {string} path
   *   A string like /apples or /orange/:orangeId
   * @param component
   * @param data
   */
  addRoute(path, component, data = {}) {
    this.routes.push({
      path,
      component,
      data
    });
  }
}

export default (new StaticRoutesRegistry());