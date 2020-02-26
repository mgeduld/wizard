import React, { Component } from 'react'
import { TextEntryStep } from './text-entry-step'
import { MultipleChoiceStep } from './multiple-choice-step'
import { PostStep } from './post-step'

/*
  TODO: 
  - docs
  - show progress
  - enum for step types
  - allow next to be a value
*/

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

  skipToNextStep = async () => {
    const nextStepId = await this.state.currentStepConfig.next()
    this.markCurrentStepAsSeen()
    this.doStep(nextStepId)
  }

  doNextStep = async dataCollectedFromStep => {
    const { currentStepConfig } = this.state
    const response = await currentStepConfig.submit(dataCollectedFromStep)
    const nextStepId = await currentStepConfig.next(
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
    const { metadata, config } = this.props
    const StepComponent = {
      'text-entry': TextEntryStep,
      'multiple-choice': MultipleChoiceStep,
      'post-step': PostStep
    }[currentStepConfig.stepType]
    return (
      <StepComponent
        {...currentStepConfig}
        metadata={metadata}
        allSteps={config}
        cachedData={currentStepEnteredData}
        onDataEntry={this.onDataEntry}
        enteredData={currentStepEnteredData}
      />
    )
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

    const { allEnteredData, currentStepConfig } = this.state

    return (
      <div className="wizard-wrapper">
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
