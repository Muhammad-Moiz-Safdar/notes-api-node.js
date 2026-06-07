let notes = [
  { id: 1, title: 'Buy groceries', body: 'Milk, eggs, bread' },
  { id: 2, title: 'Read a book', body: 'Finish the Node.js docs' },
];

let nextId = 3;

const getAll = () => notes;

const getById = (id) => notes.find((n) => n.id === id);

const create = (title, body) => {
  const note = { id: nextId++, title, body };
  notes.push(note);
  return note;
};

const update = (id, title, body) => {
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) return null;
  notes[index] = { ...notes[index], title, body };
  return notes[index];
};

const remove = (id) => {
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) return false;
  notes.splice(index, 1);
  return true;
};

module.exports = { getAll, getById, create, update, remove };