const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { first_name, last_name, mobile_number, password, created_by } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'CALL sp_CreateUser(?, ?, ?, ?, ?)',
      [first_name, last_name, mobile_number, hashedPassword, created_by]
    );
    return result[0][0];
  }

  static async findByMobile(mobile_number) {
    const [rows] = await pool.execute(
      'CALL sp_GetUser(?)',
      [mobile_number]
    );
    return rows[0][0];
  }

  static async update(id, userData) {
    const { first_name, last_name, updated_by } = userData;
    await pool.execute(
      'CALL sp_UpdateUser(?, ?, ?, ?)',
      [id, first_name, last_name, updated_by]
    );
  }

  static async delete(id) {
    await pool.execute('CALL sp_DeleteUser(?)', [id]);
  }
}

module.exports = User;

