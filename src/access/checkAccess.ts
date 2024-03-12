import ACCESS_ENUM from "@/access/accessEnum";

/**
 * 检查权限（判断当前用户是否具有指定的权限）
 * @param loginUser 当前登录用户
 * @param needAccess 需要的权限
 * @return boolean 有无权限
 */
const checkAccess = (loginUser: any, needAccess: any) => {
  //获取当前用户权限，如果没有权限，则表示未登录
  // console.log(needAccess);
  const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN;
  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    return true;
  }
  //需要用户权限
  if (needAccess === ACCESS_ENUM.USER) {
    //只要不是未登录，就可以
    if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
      return false;
    }
  }
  //需要管理员权限
  if (needAccess === ACCESS_ENUM.ADMIN) {
    if (loginUserAccess !== ACCESS_ENUM.ADMIN) {
      return false;
    }
  }
  return true;
};
export default checkAccess;
