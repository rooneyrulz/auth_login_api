// @Description     > Testing Route
// @Route           > /api/test
// @Access-Control  > Public
export const testController = (req, res, next) => {
  res.status(200).json({
    msg: `Yes, It's working...!`,
  });
};
