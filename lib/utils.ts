// convert the prisma object to a normal js object
export function convertPrismaToJs<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
