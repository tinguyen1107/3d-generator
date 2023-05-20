export * from './category.cache';
export * from './post.cache';

export type LikeStatus = 'UpVote' | 'UnVote';

export type LikeTask = {
  type: LikeStatus;
  timestamp: number;
  status: 'exec' | 'wait';
  execution: () => Promise<void>;
};

export const LikeTasks: Map<string, [LikeTask]> = new Map();

export type LikeCacheData = {
  type: LikeStatus;
  count: number;
  timestamp: number;
  // tasks: [LikeTask];
};

export const LikeCache: Map<string, LikeCacheData> = new Map();

export function receiveNewLikeTask(postId: string, newTask: LikeTask) {
  let tasks = LikeTasks.get(postId);
  if (!tasks || !tasks.length) {
    // Handle case: list tasks empty
    newTask.status = 'exec';
    LikeTasks.set(postId, [newTask]);
    newTask
      .execution()
      .then(() => {
        resolveLikeTask(postId, newTask.timestamp);
      })
      .catch((e) => {
        console.warn('Vote bg job received error, ', newTask, ':', e);
      });
  } else {
    // Handle case: push tasks as waiting
    if (tasks.length == 1) {
      tasks.push(newTask);
    } else if (tasks.length == 2) {
      tasks = [tasks[0]];
    }
    LikeTasks.set(postId, tasks);
  }
  console.log(`Receive new task (${LikeTasks.get(postId)?.length}):`, newTask);
}

export function resolveLikeTask(postId: string, timestamp: number) {
  try {
    console.log(`Resolve vote task (${LikeTasks.get(postId)?.length}): \n`, LikeTasks.get(postId));
    let tasks = LikeTasks.get(postId);
    if (!!tasks && !!tasks.length) {
      // Resolve task
      if (tasks[0].timestamp == timestamp) {
        tasks.shift();
        if (!!tasks.length) {
          // Exec next task in waiting list
          tasks[0].status = 'exec';
          let task = tasks[0];
          task
            .execution()
            .then(() => {
              resolveLikeTask(postId, task.timestamp);
            })
            .catch((e) => {
              console.warn('Vote bg job received error, ', task, ':', e);
            });
        } else {
          console.log('Vote tasks empty');
        }
        LikeTasks.set(postId, tasks);
        console.log('Resolved task: \n', LikeTasks.get(postId)?.length, '\n', LikeTasks.get(postId));
      } else {
        throw '';
      }
    } else {
      throw '';
    }
  } catch (e) {
    console.error('Like Tasks is in invalid state');
  }
}

export const FollowCache: Map<string, boolean> = new Map();

export const RePostCache: Map<string, boolean> = new Map();
