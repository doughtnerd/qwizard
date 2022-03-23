

export type Either<L, R> = Left<L> | Right<R>;
export type Left<L> = L
export type Right<R> = R

export type Maybe<T> = Just<T> | Nothing;
export type Just<T> = T
export type Nothing = undefined

export function isNothing(maybe: Maybe<unknown>): maybe is Nothing {
  return maybe === undefined
}