import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export function formatDate(date: string) {
  return dayjs(parseInt(date)).utc().format("DD/MM/YYYY HH:mm:ss UTC");
}
