export const getIndTime = (tempDateTime: Date) => {
  const indiaTimeZoneOffset = -330; // For converting UTC to Indian datetime
  return tempDateTime.getTime() + indiaTimeZoneOffset * 60 * 1000;
};
export const getTokenForProfile = async (profile: any) => {
  let fcmToken: string = "";
  try {
    await profile.forEach((snapshot: any) => {
      if (!fcmToken) {
        const userData = snapshot.data();
        if (!userData?.parentId) fcmToken = userData?.fcmToken;
      }
    });
    return fcmToken;
  } catch (e) {
    console.error("fetching profile error :", e);
    return fcmToken;
  }
};
