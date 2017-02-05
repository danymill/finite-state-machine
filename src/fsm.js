class FSM {
  /**
   * Creates new FSM instance.
   * @param config
   */
  constructor(config) {
    this.states = config.states;
    this.state = config.initial;
    this._undo = [];
    this._redo = [];
  }

  /**
   * Returns active state.
   * @returns {String}
   */
  getState() {
    return this.state;
  }

  /**
   * Goes to specified state.
   * @param state
   */
  changeState(state) {
    if (this.states.hasOwnProperty(state)) {
      this._undo.push(this.state);
      if (this._redo.length > 0) {this._redo = []}
      this.state = state;
    }
    else {
      throw new Error('No such state: ' + state);
    }
  }

  /**
   * Changes state according to event transition rules.
   * @param event
   */
  trigger(event) {
    if (this.states[this.state].transitions.hasOwnProperty(event)) {
      this.changeState(this.states[this.state].transitions[event]);
    }
    else {
      throw new Error('No such event in this state');
    }
  }

  /**
   * Resets FSM state to initial.
   */
  reset() {
    this._undo.push(this.state);
    this.state = 'normal';
  }

  /**
   * Returns an array of states for which there are specified event transition rules.
   * Returns all states if argument is undefined.
   * @param event
   * @returns {Array}
   */
  getStates(event) {
    if (event === undefined) {
      return Object.getOwnPropertyNames(this.states);
    }
    let states = [];
    for (let prop in this.states) {
      if(this.states.hasOwnProperty(prop)) {
        if (this.states[prop].transitions.hasOwnProperty(event)) {
          states.push(prop);
        }
      }
    }
    return states;
  }

  /**
   * Goes back to previous state.
   * Returns false if undo is not available.
   * @returns {Boolean}
   */
  undo() {
    if (this._undo.length) {
      let last = this._undo.pop();
      this._redo.push(this.state);
      this.state = last;
      return true;
    }
    return false;
  }

  /**
   * Goes redo to state.
   * Returns false if redo is not available.
   * @returns {Boolean}
   */
  redo() {
    if (this._redo.length) {
      let last = this._redo.pop();
      this._undo.push(last);
      this.state = last;
      return true;
    }
    return false;
  }

  /**
   * Clears transition history
   */
  clearHistory() {
    this._undo = [];
    this._redo = [];
  }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
