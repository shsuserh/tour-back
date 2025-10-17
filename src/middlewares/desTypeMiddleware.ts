export const setType = (type) => (req, res, next) => {
  req.desType = type;
  res.locals.typeSet = type;
  next();
};

export const setAvailabilityLevel = (type: string) => (req, res, next) => {
  req.availabilityLevel = type;
  res.locals.availabilityLevel = type;
  next();
};

export const setSlug = (type: string) => (req, res, next) => {
  req.slug = type;
  res.locals.slug = type;
  next();
};
