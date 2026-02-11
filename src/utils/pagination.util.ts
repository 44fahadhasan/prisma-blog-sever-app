import type { Request } from "express";

type TSortOrder = "asc" | "desc";

interface IPaginationOptions {
  page: number;
  limit: number;
  skip: number;
  orderBy: string;
  order: TSortOrder;
}

const paginationOptions = (req: Request): IPaginationOptions => {
  const {
    page = "1",
    limit = "12",
    orderBy = "created_at",
    order = "desc",
  } = req.query;

  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

  const skip = (pageNumber - 1) * limitNumber;

  return {
    page: pageNumber,
    limit: limitNumber,
    skip,
    orderBy: orderBy as string,
    order: order as TSortOrder,
  };
};

export default paginationOptions;
