// api.js — data layer (initially imperfect). Your team must reconcile API <-> UI <-> Tests.
(function () {
  const STORAGE_KEY = "contact_v1"; // BUG: tests expect 'contacts_v1'
  let contacts = [];

  function _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      contacts = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(contacts)) contacts = [];
    } catch (e) {
      contacts = [];
    }
  }
  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }
  _load();

  // Expected by tests (see tests.js): addContact({name,email,phone}) -> {ok:boolean, error?:string}
  function addContact(obj) {
    // BUGS: no validation, no duplicate check, no normalization, no phone rules
    contacts.push({ name: obj.name, email: obj.email, phone: obj.phone });
    saveData();
    return { ok: true };
  }
  // Expected: getContacts() returns sorted by name ASC
  function getContacts() {
    // BUG: unsorted copy
    return contacts.slice();
  }

  // Expected: case-insensitive match by name/email
  function searchContacts(q) {
    // BUG: case-sensitive and only by name
    return contacts.filter((c) => (c.name || "").includes(q));
  }

  // Expected: remove by email
  function removeContact(email) {
    // BUG: removes by name mistakenly
    const before = contacts.length;
    contacts = contacts.filter((c) => c.name !== email);
    saveData();
    return contacts.length !== before;
  }

  // Helper for tests to simulate reload
  function _resetApi() {
    contacts = [];
    saveData();
    _load();
  }

  window.api = {
    addContact,
    getContacts,
    searchContacts,
    removeContact,
    _resetApi,
    _load,
    saveData,
  };
})();
