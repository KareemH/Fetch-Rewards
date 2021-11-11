const Repository = require("./repository");

class TransactionRepository extends Repository {
  /*
    @returns list of associated Transaction objects
  */
  async getPoints() {
    // Get all transctions and sort by timsestamp ascennding (oldest to newest)
    let records = await this.getAll();
    records.sort((a, b) => {
      return a.timestamp.localeCompare(b.timestamp);
    });
    return records;
  }

  /*
    id: uuid
    @ returns void
  */
  async removeSingleTransaction(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }
}

module.exports = new TransactionRepository("transactions.json");
