class Store {
  constructor() {
    this.actions = {};
    this.subscriptions = [];
    this.history = [];
  }
  subscribe(element, action, callback) {
    this.subscriptions[action] = this.subscriptions[action] || [];
    this.subscriptions[action].push(function (data) {
      callback.apply(element, data);
    });
  }
  dispatch(action, data) {
    data = data || [];

    // Store history of actions (not strictly neccessary)
    this.history.push([action, data]);

    // Call action reducers
    if ("function" === typeof this[action]) {
      this[action].apply(this, data);
    }

    // Add the action and state as final arguments
    data.push(action);
    data.push(this);

    // Call subscribers
    this.subscriptions[action] = this.subscriptions[action] || [];
    this.subscriptions[action].forEach(function (subscription) {
      subscription(data);
    });
  }
}

const STORE = new Store();
export default STORE;
