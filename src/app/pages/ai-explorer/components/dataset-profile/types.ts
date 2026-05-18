export interface ColumnProfile {
  dtype: string;
  subtype: string;
  num_unique: number;
  num_na: number;
  num_missing_pct: number;
  example_values: string[];
  memory_usage_bytes: number;
  is_unique_identifier: boolean;
  avg_length: number;
  min_length: number;
  max_length: number;
  num_unique_tokens: number;
  common_words: [string, number][];
  vectorizability?: {
    avg_length: number;
    unique_ratio: number;
    avg_nonzero_tfidf: number;
    vocab_size: number;
    avg_tokens: number;
    avg_sentences: number;
    vectorizable: number;
    recommended_chunk_size: number;
  };
  text_quality?: {
    special_char_ratio: number;
    empty_strings: number;
    avg_words_per_text: number;
    duplicate_texts: number;
    duplicate_ratio: number;
  };
  detected_language: string;
  text_preprocessing_needs?: {
    recommendations: string[];
    details: {
      casing_distribution: {
        lowercase_pct: number;
        uppercase_pct: number;
        mixed_pct: number;
      };
    };
    needs_preprocessing: boolean;
  };
  top_values: Record<string, number>;
  low_cardinality: boolean;
  cardinality_level: string;
  most_common_percentage: number;
  is_imbalanced: boolean;
  mean?: number;
  median?: number;
  std?: number;
  min?: number;
  max?: number;
  q25?: number;
  q75?: number;
  skew?: number;
  kurtosis?: number;
  outlier_count_iqr?: number;
  outlier_percentage_iqr?: number;
}

export interface DatasetProfile {
  num_rows: number;
  num_columns: number;
  num_constant_columns: string[];
  num_high_missing_columns: string[];
  total_missing_cells: number;
  num_duplicate_rows: number;
  duplicate_row_percentage: number;
  memory_usage_mb: number;
  numeric_columns: string[];
  datetime_columns: string[];
  text_columns: string[];
  boolean_columns: string[];
  categorical_columns: string[];
  datetime_parse_results: Record<
    string,
    {
      success: boolean;
      parsed_count: number;
      failed_count: number;
    }
  >;
  cols: Record<string, ColumnProfile>;
  summary: string;
}

export interface DatasetProfileAPIResponse {
  dataset: string;
  profile: DatasetProfile;
}
