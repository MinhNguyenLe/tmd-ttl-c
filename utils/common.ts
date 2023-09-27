import moment from "@/modules/moment";

export function sumMultipleDuration(listDate: Array<{ from: Date; to: Date }>) {
  let result: moment.Duration = moment.duration(0, "minutes");

  listDate.forEach(({ from, to }) => {
    const duration = moment.duration(moment(to).diff(moment(from)));
    result = duration.add(result);
  });

  const hours = Math.floor(result.asHours());
  const minutes = result.minutes();

  return { minutes, hours, duration: result };
}

export function getTypeByCode(code: number) {
  if (code === 56375) {
    return "HEALTH";
  }
  if (code === 56633) {
    return "CHORE";
  }
  if (code === 56356) {
    return "BTASKEE";
  }
  if (code === 65039) {
    return "RELAX";
  }
  if (code === 56650) {
    return "LEARN";
  }
  if (code === 56469) {
    return "LOVE";
  }
  if (code === 57312) {
    return "HOME";
  }
  if (code === 56493) {
    return "THINKING";
  }
  if (code === 56425) {
    return "FAMILY";
  }
  if (code === 57152) {
    return "MEDITATION";
  }
  if (code === 56732) {
    return "FRIEND";
  }
  if (code === 50 || code === 49) {
    return "STUPID";
  }

  throw new Error(`${code} invalid !`);
}
