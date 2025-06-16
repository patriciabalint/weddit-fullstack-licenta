import PropTypes from 'prop-types';

const Title = ({ text1, text2 }) => {
  return (
    <div className="text-center mb-3">
      <h2 className="text-[28px] text-[#576B7F] font-cormorant font-medium uppercase tracking-wide">
        {text1}
        {text2 && <span className="text-[#576B7F]"> {text2}</span>}
      </h2>
    </div>
  );
};

Title.propTypes = {
  text1: PropTypes.string.isRequired,
  text2: PropTypes.string,
};

export default Title;
