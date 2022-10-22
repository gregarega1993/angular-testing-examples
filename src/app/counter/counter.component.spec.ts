import {
  byTestId,
  createComponentFactory,
  Spectator,
} from '@ngneat/spectator/jest';
import { take, toArray } from 'rxjs';

import { CounterComponent } from './counter.component';

const startCount = 0;
const newCount = 42;

describe('CounterComponent', () => {
  let spectator: Spectator<CounterComponent>;
  const createComponent = createComponentFactory({
    component: CounterComponent,
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: { startCount },
    });
  });

  it('shows the start count', () => {
    expect(spectator.query(byTestId('count'))).toHaveText(String(startCount));
  });

  it('increments the count', () => {
    spectator.click(byTestId('increment-button'));
    expect(spectator.query(byTestId('count'))).toHaveText(
      String(startCount + 1)
    );
  });

  it('decrements the count', () => {
    spectator.click(byTestId('decrement-button'));
    expect(spectator.query(byTestId('count'))).toHaveText(
      String(startCount - 1)
    );
  });

  it('reset the count', () => {
    spectator.click(byTestId('increment-button'));
    spectator.typeInElement(String(newCount), byTestId('reset-input'));
    spectator.click(byTestId('reset-button'));
    expect(spectator.query(byTestId('count'))).toHaveText(String(newCount));
  });

  it('does not reset if the value is not a number', () => {
    const value = 'not a number';
    spectator.typeInElement(value, byTestId('reset-input'));
    spectator.click(byTestId('reset-button'));
    expect(spectator.query(byTestId('count'))).toHaveText(String(startCount));
  });

  it('emits countChange events', () => {
    let actualCounts: number[] | undefined;
    spectator.component.countChange
      .pipe(take(3), toArray())
      .subscribe((counts) => (actualCounts = counts));

    spectator.click(byTestId('increment-button'));
    spectator.click(byTestId('decrement-button'));
    spectator.typeInElement(String(newCount), byTestId('reset-input'));
    spectator.click(byTestId('reset-button'));

    expect(actualCounts).toEqual([startCount + 1, startCount, newCount]);
  });
});
