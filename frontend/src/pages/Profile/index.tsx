import { Profile } from '@components/Profile';

import { useParams } from 'react-router-dom';

export const ProfilePage = () => {
  const { id } = useParams();

  return <>{id && <Profile id={id} />}</>;
};
