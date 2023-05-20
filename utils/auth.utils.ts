export const AuthUtils = Object.freeze({
  async authCheckAndExec(exec?: (...args: any) => any): Promise<boolean> {
    if (exec) await exec();
    return true;
  },
});
