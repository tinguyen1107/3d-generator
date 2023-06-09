export * from './account.dto';
export * from './template.dto';

export interface GlobalConfig {
  username: string;
  project_name: string;
  name: string;
  save_dir: string;
  verbose: boolean;
  pretrained: null | string;
  resume: number;
  SEED: number;
}

export interface DatasetConfig {
  train: {
    params: {
      text_queries_path: string;
      pc_ids_path: string;
      pc_dir: string;
      ground_truth_path: string;
    };
  };
  val: {
    params: {
      text_queries_path: string;
      pc_ids_path: string;
      pc_dir: string;
      ground_truth_path: string;
    };
  };
}

export interface DataLoaderConfig {
  train: {
    params: {
      batch_size: number;
      num_workers: number;
      shuffle: boolean;
    };
  };
  val: {
    params: {
      batch_size: number;
      num_workers: number;
    };
  };
}

export interface PointCloudExtractorConfig {
  name: string;
  params: Record<string, any>;
}

export interface TextExtractorConfig {
  name: string;
  params: {
    pretrained: string;
    freeze: boolean;
  };
}

export interface EncoderConfig {
  pointcloud: {
    num_hidden_layer: number;
  };
  text: {
    num_hidden_layer: number;
  };
}

export interface XBMConfig {
  enable_epoch: number;
  memory_size: number;
}

export interface ModelConfig {
  name: string;
  embed_dim: number;
  xbm: XBMConfig;
  extractor: {
    pointcloud: PointCloudExtractorConfig;
    text: TextExtractorConfig;
  };
  encoder: EncoderConfig;
}

export interface TrainerConfig {
  lr: number;
  lr_scheduler: {
    params: {
      milestones: number[];
      gamma: number;
    };
  };
  use_fp16: boolean;
  debug: boolean;
  num_epochs: number;
  clip_grad: number;
  evaluate_interval: number;
  log_interval: number;
  save_interval: number;
}

export interface ModelCheckpointConfig {
  name: string;
  params: {
    filename: string;
    monitor: string;
    verbose: boolean;
    save_top_k: number;
    mode: string;
  };
}

export interface CallbackConfig {
  name: string;
  params: ModelCheckpointConfig['params'];
}

export interface TemplateConfig {
  global: GlobalConfig;
  dataset: DatasetConfig;
  data_loader: DataLoaderConfig;
  model: ModelConfig;
  trainer: TrainerConfig;
  callbacks: CallbackConfig[];
}

export interface CreateTemplateInputs {
  name: string;
  config: {
    data_loader: DataLoaderConfig;
    model: ModelConfig;
    trainer: TrainerConfig;
    callbacks: CallbackConfig[];
  };
}

export type PredictDto = {
  abc: {
    pred_ids: [string];
    scores: [number];
  };
};

