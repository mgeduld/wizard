import React, { Component } from 'react'

export class MultipleChoiceStep extends Component {
  onChange = e => {
    this.props.onDataEntry(e.target.value)
  }

  renderOptions = () => {
    const { options, cachedData } = this.props
    return options.map(({ label, value }) => {
      return (
        <div key={value}>
          <label>
            {label}
            <input
              type="radio"
              name="radio-group"
              value={value}
              defaultChecked={value === cachedData}
              onChange={this.onChange}
            />
          </label>
        </div>
      )
    })
  }

  render = () => {
    const { title } = this.props

    return (
      <div className="step-wrapper mutliple-choice-step">
        {title && <h2>{title}</h2>}
        <div className="multple-choice-form">{this.renderOptions()}</div>
      </div>
    )
  }
}
