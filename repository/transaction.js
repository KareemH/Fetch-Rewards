const Repository = require("./repository");

class TransactionRepository extends Repository {
  /*
    payer: string
    @returns list of associated Transaction objects
  */
  getTransactionViaPayer(payer) {
    // @Query("SELECT u FROM Transaction u WHERE u.payer = :payer")
  }

  /*
    @returns list of associated Transaction objects
  */
  async getRecentPoints() {
    // @Query("SELECT u FROM Transaction u ORDER BY u.timestamp ASC")
    // Get all transctions and sort by timsestamp ascennding
    let records = await this.getAll();
    records.sort((a, b) => {
      return a.timestamp.localeCompare(b.timestamp);
      //   return -a.timestamp.localeCompare(b.timestamp);
    });
    return records;
  }

  /*
    points: int
    id: uuid
    @ returns void
  */
  updatePoints(points, id) {
    // @Query("UPDATE Transaction u SET u.points = :updatePoints WHERE u.id = :id")
  }

  /*
    id: uuid
    @ returns void
  */
  async removeSingleTransaction(id) {
    // @Query("DELETE Transaction u WHERE u.id = :id")
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }
}

module.exports = new TransactionRepository("transactions.json");
