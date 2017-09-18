import { Request, Response, NextFunction, RequestHandler } from 'express'
import * as Validator from 'validatorjs'

export const wrap = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next)

interface Err extends Error {
  status: number
  data: any
}

export function error(status: number, message: string, data?: any): Error {
  let err = new Error(message) as Err
  err.status = status
  err.data = data
  return err
}

export function validateBody(rules: any, customErrorMessages?: Validator.ErrorMessages): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction): void {
    const validator = new Validator(req.body, rules, customErrorMessages)

    if (validator.fails()) {
      return next(error(400, 'Bad Request', validator.errors.all()))
    }

    next()
  }
}

export function validateQuery(rules: any, customErrorMessages?: Validator.ErrorMessages): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction): void {
    const validator = new Validator(req.query, rules, customErrorMessages)

    if (validator.fails()) {
      return next(error(400, 'Bad Request', validator.errors.all()))
    }

    next()
  }
}