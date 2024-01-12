import { FiltreStudentPipe } from './student-filtre.pipe';

describe('StudentFiltrePipe', () => {
  it('create an instance', () => {
    const pipe = new FiltreStudentPipe();
    expect(pipe).toBeTruthy();
  });
});
