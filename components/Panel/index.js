

export default function SwitchComponents({ active, children }) {

    return children.filter(child => child.props.index === active)
}