/**
 * Home Page.
 * @file This file is saved as `Home/index.jsx`.
 */
import { log } from '@arpitmalik832/common-js-utils-pkg';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

import useNavigation from '../../hooks/useNavigation';
import Button from '../../components/atoms/Button';
import ButtonV2 from '../../components/atoms/ButtonV2';
import { ReactComponent as ReactIcon } from '../../assets/icons/react.svg';
import { useFetchDataQuery } from '../../redux/queries/sampleQuery';

/**
 * Home component renders the home page with buttons.
 * @returns {import('react').JSX.Element} The rendered component.
 * @example
 * <Home />
 */
function Home() {
  const apis = useSelector(state => state.apis);

  useNavigation();
  const { data, isLoading, isError } = useFetchDataQuery(
    apis[0]?.axiosInstance,
  );

  useEffect(() => {
    log({ isLoading, data, isError });
  }, [isLoading, data, isError]);

  return (
    <div>
      Home
      <Button />
      <ButtonV2 />
      <ReactIcon />
    </div>
  );
}

export default Home;
