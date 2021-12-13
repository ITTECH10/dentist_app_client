import faker from 'faker';
import { sample } from 'lodash';
// utils
import { mockImgAvatar } from '../utils/mockImages';

// ----------------------------------------------------------------------

const users = [...Array(6)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: mockImgAvatar(index + 1),
  name: faker.name.findName(),
  birthDate: faker.date.past(),
  isVerified: faker.datatype.boolean(),
  status: sample(['lose', 'dobro']),
  role: sample([
    'Asistent',
    'Direktor',
    'Zamjenik'
  ])
}));

export default users;
