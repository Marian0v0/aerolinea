import PropTypes from 'prop-types';
import './Stepper.css';

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="stepper-container">
      <div className="stepper">{steps.map((step, index) => (
          <div key={step.id}className={`step ${index + 1 === currentStep ? 'active' : ''} ${index + 1 < currentStep ? 'completed' : ''}`}>
            <div className="step-number">{index + 1 < currentStep ? (
                <svg className="checkmark" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>) : (index + 1)}</div>
            <div className="step-label">{step.title}</div>{index < steps.length - 1 && (
              <div className="step-line"></div>)}
          </div>))}</div>
    </div>
  );
};
Stepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({id: PropTypes.number.isRequired,title: PropTypes.string.isRequired})
  ).isRequired,currentStep: PropTypes.number.isRequired
};

export default Stepper;