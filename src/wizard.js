import React, { Component } from 'react'

export class Wizard extends Component {
  constructor(props) {
    super(props)

    const { config } = props

    const firstStep = config[0]

    const allEnteredData = config.reduce((defaults, stepConfig) => {
      if (stepConfig.defaultValue) {
        defaults[stepConfig.stepId] = stepConfig.defaultValue
      }
      return defaults
    }, {})

    this.state = {
      currentStepEnteredData: allEnteredData[firstStep.stepId],
      currentStepConfig: firstStep,
      previousStepConfigIds: [],
      allEnteredData
    }
  }

  hasNextStep = () => !!this.state.currentStepConfig.next

  hasPreviousStep = () =>
    this.props.config.indexOf(this.state.currentStepConfig) > 0

  doStep = stepId => {
    const currentStepConfig = this.props.config.find(
      stepConfig => stepConfig.stepId === stepId
    )
    const currentStepEnteredData = this.state.allEnteredData[
      currentStepConfig.stepId
    ]
    this.setState({
      currentStepConfig,
      currentStepEnteredData
    })
  }

  markCurrentStepAsSeen = () => {
    const { currentStepConfig, previousStepConfigIds } = this.state

    this.setState({
      previousStepConfigIds: [
        ...previousStepConfigIds,
        currentStepConfig.stepId
      ]
    })
  }

  getNextStepId = async (dataCollectedFromStep, response) => {
    const { currentStepConfig } = this.state
    return typeof this.state.currentStepConfig.next === 'function'
      ? await currentStepConfig.next(
        dataCollectedFromStep,
        response
      )
      : Promise.resolve(this.state.currentStepConfig.next)
  }

  skipToNextStep = async () => {
    const nextStepId = await this.getNextStepId()
    this.markCurrentStepAsSeen()
    this.doStep(nextStepId)
  }

  doNextStep = async dataCollectedFromStep => {
    const { currentStepConfig } = this.state
    const response = await currentStepConfig.submit(dataCollectedFromStep)
    const nextStepId = await this.getNextStepId(
      dataCollectedFromStep,
      response
    )
    this.markCurrentStepAsSeen()
    this.doStep(nextStepId)
  }

  doPreviousStep = () => {
    const previousStepId = this.state.previousStepConfigIds.pop()
    this.doStep(previousStepId)
  }

  onDataEntry = data => {
    const { allEnteredData, currentStepConfig } = this.state
    this.setState({
      allEnteredData: { ...allEnteredData, [currentStepConfig.stepId]: data }
    })
  }

  renderCurrentStep = () => {
    const { currentStepConfig, currentStepEnteredData } = this.state
    const { metadata, config, children } = this.props
    const stepChild = children.find(
      child => child.type.name === currentStepConfig.stepType
    )
    const props = {
      ...currentStepConfig,
      metadata,
      allSteps: config,
      cachedData: currentStepEnteredData,
      onDataEntry: this.onDataEntry,
      enteredData: currentStepEnteredData
    }
    const StepComponent = React.cloneElement(stepChild, props)

    return StepComponent
  }

  render = () => {
    const {
      renderCurrentStep,
      doNextStep,
      doPreviousStep,
      hasNextStep,
      hasPreviousStep,
      skipToNextStep
    } = this

    const { showProgress, config } = this.props
    const { allEnteredData, currentStepConfig } = this.state
    const currentStepIndex = config.indexOf(currentStepConfig) + 1

    return (
      <div className="wizard-wrapper">
        {showProgress && (
          <div className="progress">
            step {currentStepIndex} of {config.length}
          </div>
        )}
        <div className="step">{renderCurrentStep()}</div>
        <div className="nav">
          <button
            className="previous-button"
            disabled={!hasPreviousStep()}
            onClick={doPreviousStep}
          >
            Back
          </button>
          {currentStepConfig.stepType !== 'post-step' && (
            <span>
              <button
                className="next-button"
                disabled={
                  !(hasNextStep() && allEnteredData[currentStepConfig.stepId])
                }
                onClick={doNextStep}
              >
                Next
              </button>

              <button
                className="skip-button"
                disabled={!currentStepConfig.canSkip}
                onClick={skipToNextStep}
              >
                Skip
              </button>
            </span>
          )}

          {hasNextStep() || (
            <button
              className="done-button"
              onClick={() => this.props.onComplete(this.state.allEnteredData)}
            >
              Done
            </button>
          )}
        </div>
      </div>
    )
  }
}
