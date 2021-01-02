export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation(
      (subject: string, data: string, callback: () => void) => {
        callback();
      }
    )
  }

  // note connect() is not used in tests
}