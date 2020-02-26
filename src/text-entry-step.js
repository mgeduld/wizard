import React, { Component } from 'react'

export class TextEntryStep extends Component {
  render = () => {
    const { title, label, onDataEntry, cachedData } = this.props

    return (
      <div className="step-wrapper text-entry-step">
        {title && <h2>{title}</h2>}
        <div className="text-entry-form">
          {label && <span>{label}</span>}
          <input
            onChange={e => onDataEntry(e.target.value)}
            value={cachedData}
          />
        </div>
      </div>
    )
  }
}
