import { ProgressBar } from "react-bootstrap";

const Progress =({ maxTokens, tokensSold }) => {
  const percentageOfTokensSold = (tokensSold / maxTokens ) * 100;
  return (
    <div className="my-3">
      <ProgressBar now={(percentageOfTokensSold)} label={`${percentageOfTokensSold}%`} />
      <p className='my-3'>{tokensSold} / {maxTokens} Tokens Sold</p>
    </div>
  );
}

export default Progress;