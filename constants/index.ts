import { CreateTemplateInputs } from "../dtos";

export const PRICE_FRACTION_DIGITS = 3;
export const RATIO_AMOUT_TO_CREATE_TASK = 110 / 100;
export const FETCH_POSTS_LIMIT = 8;
export const FETCH_COMMENT_LIMIT = 5;
export const FETCH_LIMIT_ON_VIEW_ALL_MODAL = 100;
export const CHAT_PRIVATE_KEY = 'chat_private_key';
export const FILE_LIMIT_SIZE = 4.5 * 1024 * 1024;
export const CREATE_POST_REDIRECT = 'create_post_redirect';
export const LIKE_TASKS = 'like_tasks';
export const BASE_URL = 'http://localhost:8888/software/v1';
export const CREATE_TEMPLATE_DEFAULT_VALUE: CreateTemplateInputs = {
  name: "",
  config: {
    data_loader: {
      train: {
        params: {
          batch_size: 16,
          num_workers: 2,
          shuffle: true,
        },
      },
      val: {
        params: {
          num_workers: 2,
          batch_size: 16,
        },
      },
    },
    model: {
      name: 'BaselineModel',
      embed_dim: 128,
      xbm: {
        enable_epoch: 1000000,
        memory_size: 1024,
      },
      extractor: {
        pointcloud: {
          name: 'CurveNet',
          params: {},
        },
        text: {
          name: 'LangExtractor',
          params: {
            pretrained: 'bert-base-uncased',
            freeze: true,
          },
        },
      },
      encoder: {
        pointcloud: {
          num_hidden_layer: 2,
        },
        text: {
          num_hidden_layer: 2,
        },
      },
    },
    trainer: {
      lr: 0.001,
      lr_scheduler: {
        params: {
          milestones: [120, 250, 350, 500],
          gamma: 0.5,
        },
      },
      use_fp16: false,
      debug: false,
      num_epochs: 10,
      clip_grad: 10.0,
      evaluate_interval: 1,
      log_interval: 1,
      save_interval: 1,
    },
    callbacks: [
      {
        name: 'ModelCheckpoint',
        params: {
          filename: 'baseline-{epoch}-{NN:.4f}-{mAP:.4f}-{train_loss:.4f}-{val_loss:.4f}',
          monitor: 'NN',
          verbose: true,
          save_top_k: 1,
          mode: 'min',
        },
      },
    ],
  }
}

