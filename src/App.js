import React, { Component } from 'react'
import { Wizard } from './wizard'
//import { catWizardConfig } from './cat-wizard-config'
import { dogWizardConfig } from './dog-wizard-config'
import { TextEntryStep } from './text-entry-step'
import { MultipleChoiceStep } from './multiple-choice-step'
import { PostStep } from './post-step'
import './styles.css'

export default class App extends Component {
  onComplete = data => {
    console.log('Data collected by wizard: ', data);
  }

  render = () => {
    return (
      <div className='App'>
        <Wizard config={dogWizardConfig()} onComplete={this.onComplete} showProgress={true}>
          <TextEntryStep />
          <MultipleChoiceStep />
          <PostStep />
        </Wizard>
      </div>
    )
  }
}
