const Progress =({ maxTokens, tokensSold }) => {
  return (
    <div className="my-3">
    <p className='my-3'>{tokensSold} / {maxTokens} Tokens Sold</p>
    </div>
  );
}

export default Progress;