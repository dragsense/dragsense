import StateList from "./StateList";
import AddState from './Add';

export function StateComponent({ states, setNewState, onRemove}) {
    return (
        <StateList states={states} setNewState={setNewState} onRemove={onRemove} />
    );
};

export function AddStateComponent({ newState, setNewState, onAdd }) {
    return (
        <AddState newState={newState} setNewState={setNewState} onAddNew={onAdd} />
    );
};
