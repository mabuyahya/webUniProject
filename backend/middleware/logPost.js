export const logSuccessfulPost = (req, res, next) => {
  res.on('finish', () => {
    if (req.method !== 'POST') {
      return;
    }

    if (res.statusCode >= 200 && res.statusCode < 300) {
      const userId = req.session?.userId ?? 'unknown';
      console.log(
        `[POST] ${new Date().toISOString()} user=${userId} path=${req.originalUrl}`
      );
    }
  });

  next();
};
