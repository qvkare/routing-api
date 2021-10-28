import Joi from '@hapi/joi';
import {  TickMath } from '@uniswap/v3-sdk';
import { TokenInRoute, QuoteResponse, QuoteResponseSchemaJoi } from '../../schema'

export type PostSwapTargetPool = {
  address: string;
  tokenIn: TokenInRoute;
  tokenOut: TokenInRoute;
  sqrtRatioX96: string;
  liquidity: string;
  tickCurrent: string;
  fee: string;
};

export type ResponseFraction = {
  numerator: string;
  denominator: string;
}

export const QuoteToRatioQueryParamsJoi = Joi.object({
  token0Address: Joi.string().alphanum().max(42).required(),
  token0ChainId: Joi.number().valid(1, 4).required(),
  token1Address: Joi.string().alphanum().max(42).required(),
  token1ChainId: Joi.number().valid(1, 4).required(),
  token0Balance: Joi.number().min(0).required(),
  token1Balance: Joi.number().min(0).required(),
  tickLower: Joi.number().min(TickMath.MIN_TICK).max(TickMath.MAX_TICK).required(),
  tickUpper: Joi.number().min(TickMath.MIN_TICK).max(TickMath.MAX_TICK).required(),
  feeAmount: Joi.number().min(0).max(10_000).required(),
  recipient: Joi.string()
    .pattern(new RegExp(/^0x[a-fA-F0-9]{40}$/))
    .optional(),
  slippageTolerance: Joi.number().min(0).max(20).precision(2).optional(),
  deadline: Joi.number().max(10800).optional(), // 180 mins, same as interface max
  gasPriceWei: Joi.string()
  .pattern(/^[0-9]+$/)
  .max(30)
  .optional(),
  minSplits: Joi.number().max(7).optional(),
  errorTolerance: Joi.number().min(0).max(10).precision(2).optional(),
  maxIterations: Joi.number().min(1).max(10).default(5).required(),
}).and('recipient', 'slippageTolerance', 'deadline');

export type QuoteToRatioQueryParams = {
  token0Address: string;
  token0ChainId: number;
  token1Address: string;
  token1ChainId: number;
  token0Balance: string;
  token1Balance: string;
  tickLower: number;
  tickUpper: number;
  feeAmount: number;
  recipient?: string;
  slippageTolerance?: string;
  deadline?: string;
  gasPriceWei?: string;
  minSplits?: number;
  errorTolerance: number;
  maxIterations: number;
};

export type QuoteToRatioResponse = QuoteResponse & {
  tokenInAddress: string,
  tokenOutAddress: string,
  token0BalanceUpdated: string,
  token1BalanceUpdated: string,
  optimalRatio: string,
  optimalRatioFraction: ResponseFraction,
  newRatio: string,
  newRatioFraction: ResponseFraction,
  postSwapTargetPool: PostSwapTargetPool,
}

export const QuotetoRatioResponseSchemaJoi = QuoteResponseSchemaJoi.keys({
  tokenInAddress: Joi.string().required(),
  tokenOutAddress: Joi.string().required(),
  token0BalanceUpdated: Joi.string().required(),
  token1BalanceUpdated: Joi.string().required(),
  optimalRatio: Joi.string().required(),
  optimalRatioFraction: Joi.object({
    numerator: Joi.string(),
    denominator: Joi.string(),
  }).required(),
  newRatio: Joi.string().required(),
  newRatioFraction: Joi.object({
    numerator: Joi.string(),
    denominator: Joi.string(),
  }).required(),
  postSwapTargetPool: Joi.any().required(),
})
