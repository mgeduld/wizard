import React, { Component } from 'react'

export class PostStep extends Component {
  render = () => {
    const { text } = this.props

    return (
      <div className="step-wrapper post-step">
        {text && <h2>{text}</h2>}
      </div>
    )
  }
}