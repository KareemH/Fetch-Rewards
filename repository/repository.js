const fs = require("fs");
const crypto = require("crypto");

module.exports = class Repository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a reposiitory requires a filename");
    }

    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  async create(attrs) {
    attrs.id = this.randomId();

    const records = await this.getAll();
    records.push(attrs);
    await this.writeAll(records);

    return attrs;
  }

  async getAll() {
    // Open the file called this.filename
    // const contents = await fs.promises.readFile(this.filename, {
    //   encoding: "utf8"
    // });

    // Read the contents
    // console.log(contents);

    // Parse the contents
    // const data = JSON.parse(contents)

    // Return the parsed data
    // return data;

    return JSON.parse(await fs.promises.readFile(this.filename));
  }

  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  //   async delete(id) {
  //     const records = await this.getAll();
  //     const filteredRecords = records.filter((record) => record.id !== id);
  //     await this.writeAll(filteredRecords);
  //   }

  async update(id, attrs) {
    const records = await this.getAll();
    // Record references the found record in memory (reference, nt a copy)
    const record = records.find((record) => record.id === id);

    if (!record) {
      throw new Error(`Record with ${id}`);
    }

    // Take all the properties of attrs and assign them over the recod
    Object.assign(record, attrs);

    // The record object is updated, so rewrite the original database with an entirely new one, even if one record is updated
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();
    for (let record of records) {
      // Iterating through an array
      let found = true;
      for (let key in filters) {
        // Iterating through a object
        if (record[key] !== filters[key]) {
          found = false;
        }
      }

      if (found) {
        return record;
      }
    }
  }
};
