export type timestamp = number;
export type int = number;
export type ref<T> = number;

const FileFlags = {
  transcribed: 1 << 0,
};

/**a single audio file in the journal */
export interface File {
  /** timestamp of the file, in milliseconds since the epoch */
  timestamp: timestamp;
  /** state of file
   *  0: unprocessed
   *  1: processed transcriptions
   */
  flags: int;
}

/**a paragraph of text in the journal, points to a `file` */
export interface Paragraph {
  /** unique id */
  id: timestamp;
  /** the file this paragraph belongs to */
  file_id: ref<DBFile>;
  /** start time, in milliseconds since start of file */
  start_time: int;
  /** end time, in milliseconds since start of file */
  end_time: int;
  /** the full text of the paragraph */
  text: string;
}

/**a single force-aligned word in a paragraph, points to a `paragraph` */
export interface Word {
  /** unique id */
  id: timestamp;
  /** the paragraph this word belongs to */
  paragraph_id: ref<DBParagraph>;
  /** start time, in milliseconds since start of file */
  start_time: int;
  /** end time, in milliseconds since start of file */
  end_time: int;
  /** start index */
  start_index: int;
  /** end index */
  end_index: int;
  /** AI score for how well this word was transcribed/aligned */
  score: number;
}

/** table to store tags */
export interface Tag {
  /** unique id */
  id: timestamp;
  /** tag name */
  primary_name: string;
}

/** tags can have multiple names */
export interface TagSynonym {
  /** unique id */
  id: timestamp;
  /** tag name */
  name: string;
  /** tag id */
  tag_id: ref<DBTag>;
}

/** table to store paragraph tags */
export interface JunctionParagraphTag {
  /** the paragraph this tag belongs to */
  paragraph_id: ref<DBParagraph>;
  /** the tag itself */
  tag_id: ref<DBTag>;
}
