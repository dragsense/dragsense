import StateList from "./StateList";
import AddState from './Add';

export function StateComponent({ states, setNewState, onRemove}) {
    return (
        <StateList states={states} setNewState={setNewState} onRemove={onRemove} />
    );
};

export function AddStateComponent({ newState, host, setNewState, onAdd }) {
    return (
        <AddState newState={newState} host={host} setNewState={setNewState} onAddNew={onAdd} />
    );
};
