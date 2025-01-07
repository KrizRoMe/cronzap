export const getFormattedDay = (date: Date): string => {
	const formatter = new Intl.DateTimeFormat('es-PE', {
		timeZone: 'America/Lima',
		day: '2-digit',
	});

	const formattedNowDay = formatter.format(date);

	return formattedNowDay;
};
