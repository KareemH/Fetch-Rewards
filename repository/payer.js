const Repository = require("./repository");
class PayerRepository extends Repository {
  /*
    payer: string
    @returns list of Payer objects
    */
  async getPayer(payer) {
    const records = await this.getAll();
    return records.find((record) => record.payer === payer);
  }

  /*
        payer: string
        points: int
        @ returns void
    */
  async updateBalance(payer, updated_points) {
    const records = await this.getAll();
    // Record references the found record in memory (reference, nt a copy)
    const record = records.find((record) => record.payer === payer);

    // if (!record) {
    //   throw new Error(`Record with ${record.id}`);
    // }

    // Take all the properties of attrs and assign them over the recod
    Object.assign(record, { points: record.points + updated_points });

    // The record object is updated, so rewrite the original database with an entirely new one, even if one record is updated
    await this.writeAll(records);
  }
}

module.exports = new PayerRepository("payer.json");
