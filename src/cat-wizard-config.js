export const catWizardConfig = () => {
  return [
    {
      stepId: '1',
      stepType: 'text-entry',
      title: 'Please answer the following question',
      label: 'What is your name?',
      // data will be whatever is collected from the user
      submit: async data => await Promise.resolve('foo'),
      // data will be whatever is collected from the user
      // and response will be whatever is returned from the submit function.
      // next is a function because there might be a need branching:
      // goto step 2 if x, step 3 if y
      next: async (data, response) => await Promise.resolve('2')
    },
    {
      stepId: '2',
      stepType: 'multiple-choice',
      title: 'What is your favorite food?',
      options: [
        { label: 'chicken', value: 'c' },
        { label: 'tuna', value: 't' }
      ],
      submit: async data => await Promise.resolve('foo'),
      // this is the last step
      next: null
    }
  ]
}
