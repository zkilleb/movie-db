import { getFormattedDate } from './index';

test('getFormattedDate properly formats date', () => {
  const currentDate = new Date();
  expect(getFormattedDate()).toContain(`${currentDate.getMonth() + 1}/`);
  expect(getFormattedDate()).toContain(`/${currentDate.getDate()}/`);
  expect(getFormattedDate()).toContain(`/${currentDate.getFullYear()}`);
});
