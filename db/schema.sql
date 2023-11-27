--a single audio file in the journal
CREATE TABLE file (
  -- timestamp of the file, in milliseconds since the epoch
  timestamp INTEGER PRIMARY KEY,
  -- state of file
  -- 0: unprocessed
  -- 1: processed transcriptions
  flags INTEGER NOT NULL,
  -- extension of file
  ext TEXT NOT NULL
);

--a paragraph of text in the journal, points to a `file`
CREATE TABLE paragraph (
  -- unique id
  id INTEGER PRIMARY KEY,
  -- the file this paragraph belongs to
  file_id INTEGER NOT NULL,
  -- start time, in milliseconds since start of file
  start_time INTEGER NOT NULL,
  -- end time, in milliseconds since start of file
  end_time INTEGER NOT NULL,
  -- the full text of the paragraph
  text TEXT NOT NULL,

  FOREIGN KEY(file_id) REFERENCES file(timestamp)
);

--a single force-aligned word in a paragraph, points to a `paragraph`
CREATE TABLE word (
  -- unique id
  id INTEGER PRIMARY KEY,
  -- the paragraph this word belongs to
  paragraph_id INTEGER NOT NULL,
  -- start time, in milliseconds since start of file
  start_time INTEGER,
  -- end time, in milliseconds since start of file
  end_time INTEGER,
  -- start index
  start_index INTEGER NOT NULL,
  -- end index
  end_index INTEGER NOT NULL,
  -- AI score for how well this word was transcribed/aligned
  score REAL,

  FOREIGN KEY(paragraph_id) REFERENCES paragraph(id)
);

-- table to store tags
CREATE TABLE tag (
  -- unique id
  id INTEGER PRIMARY KEY,
  -- tag name
  primary_name TEXT NOT NULL
);

-- tags can have multiple names
CREATE TABLE tag_synonym (
  -- unique id
  id INTEGER PRIMARY KEY,
  -- tag name
  name TEXT NOT NULL,
  -- tag id
  tag_id INTEGER NOT NULL,

  FOREIGN KEY(tag_id) REFERENCES tag(id)
);

-- table to store paragraph tags
CREATE TABLE j_paragraph_tag (
  -- the paragraph this tag belongs to
  paragraph_id INTEGER NOT NULL,
  -- the tag itself
  tag_id INTEGER NOT NULL,

  FOREIGN KEY(tag_id) REFERENCES tag(id),
  FOREIGN KEY(paragraph_id) REFERENCES paragraph(id),
  PRIMARY KEY (paragraph_id, tag_id)
);
