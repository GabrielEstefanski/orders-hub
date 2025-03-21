const formatNumber = (value: number, n = 1): string => {
    const sign = value < 0 ? '-' : '';
    const valueAbs = Math.abs(value);

    let formattedValue: number;
    let suffix: string;

    if (valueAbs >= 1_000_000_000_000) {
        formattedValue = valueAbs / 1_000_000_000_000;
        suffix = 'T';
    } else if (valueAbs >= 1_000_000_000) {
        formattedValue = valueAbs / 1_000_000_000;
        suffix = 'B';
    } else if (valueAbs >= 1_000_000) {
        formattedValue = valueAbs / 1_000_000;
        suffix = 'M';
    } else if (valueAbs >= 1_000) {
        formattedValue = valueAbs / 1_000;
        suffix = 'K';
    } else {
        formattedValue = value;
        suffix = '';
    }

    return sign + (formattedValue % 1 === 0 ? `${formattedValue.toFixed(0)}${suffix}` : `${formattedValue.toFixed(n)}${suffix}`);
};

export default formatNumber;
