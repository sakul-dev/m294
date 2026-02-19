export const apiService = {
  // Fetch all records using the '?all' flag required by CrudProvider
  
  async getAll<T>(url: string): Promise<T> {
    const res = await fetch(`${url}?all`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  },

  // Create a new record (POST)
  async create (data: any, url: string) {
    const res = await fetch(`${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  /**
   * Update an existing record (PUT)
   * The CrudProvider expects the ID (id_lernende) to be inside the data object
   */
  async update (data: any, url: string) {
    const res = await fetch(`${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.error) throw new Error(result.error);
    return result;
  },

  // Delete a record using query parameters
  delete: async (id: number, url: string, idColumn: string) => {
    const res = await fetch(`${url}?${idColumn}=${id}`, {
      method: 'DELETE',
    });
    return res.json();
  }
};
