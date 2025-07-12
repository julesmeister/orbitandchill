/* eslint-disable @typescript-eslint/no-unused-vars */

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'chart':
      return '📊';
    case 'interpretation':
      return '🔮';
    case 'sharing':
      return '🔗';
    case 'analysis':
      return '⚡';
    default:
      return '⭐';
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'chart':
      return '#6bdbff';
    case 'interpretation':
      return '#ff91e9';
    case 'sharing':
      return '#f2e356';
    case 'analysis':
      return '#51bd94';
    default:
      return '#f3f4f6';
  }
};