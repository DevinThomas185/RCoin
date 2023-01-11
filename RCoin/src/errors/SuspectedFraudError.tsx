class SuspectedFraudError extends Error {
  constructor() {
    super('Suspected Fraud');
    this.name = 'SuspectedFraudError';
  }
}

export default SuspectedFraudError;
