export const englishToBanglaDigits = (num: number | string): string => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .replace(/[0-9]/g, (digit) => banglaDigits[parseInt(digit, 10)]);
};

export const banglaToEnglishDigits = (str: string): string => {
  const banglaDigits: { [key: string]: string } = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  return str.replace(/[০-৯]/g, (match) => banglaDigits[match] || match);
};

export const normalizeMathInput = (input: string): string => {
  return banglaToEnglishDigits(input).trim().toLowerCase().replace(/s+/g, '');
};
