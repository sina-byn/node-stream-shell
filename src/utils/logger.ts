import chalk from 'chalk';

// * types
type Color = 'redBright' | 'blueBright' | 'greenBright' | 'yellowBright';

const _logger = (color: Color, ...inputs: unknown[]) => {
  console.log(chalk[color]('[stream-shell]', ...inputs));
};

const logger = {
  success: _logger.bind(null, 'greenBright'),
  info: _logger.bind(null, 'blueBright'),
  warn: _logger.bind(null, 'yellowBright'),
  error: _logger.bind(null, 'redBright'),
};

export default logger;
