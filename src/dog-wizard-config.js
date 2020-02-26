export const dogWizardConfig = () => {
  return [
    {
      stepId: '1',
      stepType: 'multiple-choice',
      title: "What's your favorite hobby?",
      defaultValue: 'fetching',
      options: [
        { label: 'walking', value: 'walking' },
        { label: 'running', value: 'running' },
        { label: 'fetching', value: 'fetching' }
      ],
      submit: async data => await Promise.resolve('foo'),
      next: async (data, response) => await Promise.resolve('2')
    },
    {
      stepId: '2',
      canSkip: true,
      stepType: 'text-entry',
      title: "What is your owner's name",
      // data will be whatever is collected from the user
      submit: async data => await Promise.resolve('foo'),
      // data will be whatever is collected from the user
      // and reponse will be whatever is returned from the submit function.
      // This is a function because there might be a branch:
      // goto step 2 if x, step 3 if y
      next: async (data, response) => await Promise.resolve('3')
    },
    {
      stepId: '3',
      stepType: 'multiple-choice',
      title: 'What kind of food do you like?',
      defaultValue: 'wet',
      options: [
        { label: 'dry', value: 'dry' },
        { label: 'wet', value: 'wet' }
      ],
      submit: async data => await Promise.resolve('foo'),
      next: async (data, response) => await Promise.resolve('4')
    },
    {
      stepId: '4',
      stepType: 'post-step',
      text: 'Thank you!',
      next: null
    }
  ]
}
