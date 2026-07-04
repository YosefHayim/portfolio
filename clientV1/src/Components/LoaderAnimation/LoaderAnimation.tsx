import { useEffect } from 'react';

const LoaderAnimation: React.FC<{
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ state, setState }) => {
  useEffect(() => {
    setState(true);
    setTimeout(() => {
      setState(false);
    }, 1000);
  }, [state]);

  return <div>{state && <div className="loader"></div>}</div>;
};

export default LoaderAnimation;
