/* eslint-disable flowtype/require-valid-file-annotation */

export default from './transition';

export function stop() {
  if (this.TRANSITION_SCHEDULES) {
    Object.keys(this.TRANSITION_SCHEDULES).forEach((s) => {
      this.TRANSITION_SCHEDULES[s].timer.stop();
    });
  }
}
