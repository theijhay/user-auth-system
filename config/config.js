require('dotenv').config(); // Load environment variables from .env file

module.exports = {
  development: {
    use_env_variable: 'postgresql://postgres.jlycnshtlrukiymtppel:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
    dialect: 'postgres',
  },
  test: {
    use_env_variable: 'postgresql://postgres.jlycnshtlrukiymtppel:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'postgresql://postgres.jlycnshtlrukiymtppel:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
    dialect: 'postgres',
  },
};
