class State {
  workflowType;
  id;
  label;
  weight;


  constructor(workflowType, id, label, weight) {
    this.workflowType = workflowType;
    this.id = id;
    this.label = label;
    this.weight = weight;
  }

}

class Transition {
  workflow;
  id;
  label;
  fromStateIds;
  toStateId;

  constructor(workflow, id, label, fromStateIds, toStateId) {
    this.workflow = workflow;
    this.id = id;
    this.label = label;
    this.fromStateIds = fromStateIds;
    this.toStateId = toStateId;
  }

  from() {
    return this.workflow.getStates(this.fromStateIds);
  }

  to() {
    return this.workflow.getState(this.toStateId);
  }
}

const labelWeightMultiSort = (o1, o2) => {
  const w1 = o1.weight;
  const w2 = o2.weight;
  const label1 = o1.label;
  const label2 = o2.label;

  if (w1 < w2) {
    return -1;
  }
  if (w1 > w2) {
    return 1;
  }
  if (label1 < label2) {
    return -1;
  }
  if (label1 > label2) {
    return 1;
  }
  return 0;
};

export class WorkflowType {
  states = [];
  transitions = NULL;

  constructor(configuration) {
    this.configuration = configuration;
  }

  getStates(ids) {
    if (!this.states) {
      this.states = Object.entries(this.configuration['states'])
        .sort(([id1, state1], [id2, state2]) => {
          return labelWeightMultiSort(state1, state2);
        })
        .map(([id]) => id)
        .map(this.getState);
    }

    if (ids) {
      return this.states.filter(state => ids.includes(state.id));
    }
    return this.states;
  }

  getState(id) {
    return new State(this, id, this.configuration.states[id].label, this.configuration.states[id].weight);
  }

  getTransitions(ids) {
    if (!this.transitions) {
      this.transitions = Object.entries(this.configuration.transitions)
        .sort(([id1, transition1], [id2, transition2]) => {
          return labelWeightMultiSort(transition1, transition2);
        })
        .map(([id]) => id)
        .map(this.getTransition);
    }

    if (ids) {
      return this.transitions.filter(transition => ids.includes(transition.id));
    }

    return this.transitions;
  }

  getTransition(id) {
    return new State(this, id, this.configuration.transitions[id].label, this.configuration.transitions[id].weight);
  }

  getTransitionsForState(stateId) {
    const transitionIds =
      Object.entries(this.configuration.transitions)
        .filter(([id, transition]) => {
          return transition.from.includes(stateId);
        });
    return this.getTransitions(transitionIds);
  }

}
