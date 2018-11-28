import addDays from 'date-fns/add_days';
import chunk from 'lodash/chunk';
import differenceInCalendarWeeks from 'date-fns/difference_in_calendar_weeks';
import addMonths from 'date-fns/add_months';
import endOfMonth from 'date-fns/end_of_month';
import format from 'date-fns/format';
import getYear from 'date-fns/get_year';
import setDay from 'date-fns/set_day';
import startOfWeek from 'date-fns/start_of_week';
import getLocale from '../DateFnsLocale/locale';
import getDefaultT from '../translate';

export const pickerLocale = { locale: getLocale(getDefaultT()) };

/**
 * Generate days of week, starting from the provided index
 */
export function buildDayNames(firstDayOfweek = 1) {
	return new Array(7)
		.fill(0)
		.map((_, i) => (i + firstDayOfweek) % 7)
		.map(dayOfWeek => setDay(new Date(0), dayOfWeek))
		.map(headerDate => ({
			abbr: format(headerDate, 'd', pickerLocale),
			full: format(headerDate, 'dddd', pickerLocale),
		}));
}

/**
 * Generate the set of weeks for a specific month
 */
export function buildWeeks(year, monthIndex, firstDayOfWeek = 1) {
	const firstDateOfMonth = new Date(year, monthIndex);
	const firstDateOfCalendar = startOfWeek(firstDateOfMonth, {
		weekStartsOn: firstDayOfWeek,
	});

	const lastDateOfMonth = endOfMonth(firstDateOfMonth);
	const diffWeeks = differenceInCalendarWeeks(lastDateOfMonth, firstDateOfCalendar, {
		weekStartsOn: firstDayOfWeek,
	});
	const nbWeeksToRender = diffWeeks + 1;

	const dates = new Array(7 * nbWeeksToRender)
		.fill(0)
		.map((_, i) => addDays(firstDateOfCalendar, i));

	return chunk(dates, 7);
}

/**
 * Generate th sets of months, each set has the size of provided "chunkSize"
 */
export function buildMonths(chunkSize) {
	const months = new Array(12)
		.fill(0)
		.map((_, i) => i)
		.map(index => ({
			index,
			name: format(addMonths(new Date(0), index), 'MMMM', pickerLocale),
		}));
	return chunk(months, chunkSize);
}

/**
 * Generate a years window, centered on the current year by default, or the provided one
 */
export function buildYears(middle, window = 3) {
	const middleYear = middle === undefined ? getYear(new Date()) : middle;
	const start = middleYear - window;
	const end = middleYear + window;
	const years = [];
	for (let i = start; i <= end; i += 1) {
		years.push(i);
	}
	return years;
}
