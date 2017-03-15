// @flow weak

export default function stop() {
  if (this.TRANSITION_SCHEDULES) {
    Object.keys(this.TRANSITION_SCHEDULES).forEach((s) => {
      this.TRANSITION_SCHEDULES[s].timer.stop();
    });
  }
}
