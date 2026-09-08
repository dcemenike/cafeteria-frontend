import React from 'react'

const ToggleSwitch = ({ checked, onChange }) => {
    return (
        <div>
            <label className="toggle-switch">
                <input type="checkbox" checked={checked} onChange={onChange} />
                <span className="toggle-track"></span>
                <span className="toggle-label" style={{ color: checked ? "var(--available)" : "var(--unavailable)" }}>
                    {checked ? "Available" : "Unavailable"}
                </span>
            </label>
        </div>
    )
}

export default ToggleSwitch
