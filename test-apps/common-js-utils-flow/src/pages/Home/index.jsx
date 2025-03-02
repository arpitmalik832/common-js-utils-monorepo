// @flow
import React, { useEffect } from 'react';
import { log } from '@arpitmalik832/common-js-utils-flow';
import { useSelector } from 'react-redux';

import Button from '../../components/atoms/Button';
import ButtonV2 from '../../components/atoms/ButtonV2';
import useNavigation from '../../hooks/useNavigation';
import { ReactComponent as ReactIcon } from '../../assets/icons/react.svg';
import { useFetchDataQuery } from '../../redux/queries/sampleQuery';

/**
 * Home component renders the home page with buttons.
 * @returns {import('react').JSX.Element} The rendered component.
 * @example
 * <Home />
 */
function Home(): React.Node {
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
